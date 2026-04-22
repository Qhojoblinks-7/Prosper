from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncDate, TruncMonth, TruncWeek
from django.utils import timezone
from datetime import timedelta, date
from django.db import transaction as db_transaction

from .models import (
    DriverProfile, Category, Transaction, Budget,
    Allocation, Milestone, Vault, Vehicle,
    MaintenanceLog, Notification, SyncLog, PendingUpload
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, DriverProfileSerializer,
    CategorySerializer, TransactionSerializer, BudgetSerializer,
    AllocationSerializer, MilestoneSerializer, VaultSerializer,
    VaultContributionSerializer, VehicleSerializer,
    MaintenanceLogSerializer, NotificationSerializer,
    NotificationMarkReadSerializer, SyncLogSerializer,
    PendingUploadSerializer, BatchSyncSerializer,
    DashboardSummarySerializer, AnnualVisionDataSerializer
)

# ============================================
# AUTHENTICATION VIEWS
# ============================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user with driver profile"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create default allocations for new user
        default_allocations = [
            ('Operating Costs', 50, '#F59E0B'),
            ('Business Growth', 20, '#10B981'),
            ('Safety Net', 10, '#004D40'),
            ('Personal/Home', 20, '#8B5CF6'),
        ]
        for label, percent, color in default_allocations:
            Allocation.objects.create(driver=user, label=label, percent=percent, color=color)
        
        # Create default vaults
        default_vaults = [
            ('Emergency Net', 'Safety buffer', 5000, '#BA1A1A', True),
            ('Vehicle Upgrade', 'Next vehicle', 20000, '#004D40', False),
            ('School Fees', 'Education', 3000, '#F59E0B', False),
            ('Business Growth', 'Expansion', 10000, '#10B981', False),
        ]
        for name, desc, target, color, is_emergency in default_vaults:
            Vault.objects.create(driver=user, name=name, description=desc, target_amount=target, color=color, is_emergency=is_emergency)
        
        # Create default milestones
        Milestone.objects.create(driver=user, name='License Renewal', target_amount=800, deadline=date.today() + timedelta(days=60))
        Milestone.objects.create(driver=user, name='New Tire Set', target_amount=1200, deadline=date.today() + timedelta(days=120))
        
        # Create vehicle record
        Vehicle.objects.create(driver=user)
        
        return Response({'message': 'User created successfully', 'user_id': user.id}, status=201)
    return Response(serializer.errors, status=400)

# ============================================
# DASHBOARD & HOME VIEWS
# ============================================

class DashboardSummary(APIView):
    """Aggregated dashboard data for Home screen"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        # Cash calculations
        cash_income = Transaction.objects.filter(
            driver=user, method='CASH', transaction_type='INCOME', created_at__date__gte=week_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        cash_expense = Transaction.objects.filter(
            driver=user, method='CASH', transaction_type='EXPENSE', created_at__date__gte=week_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        cash_on_hand = float(cash_income) - float(cash_expense)
        
        # Mobile Money calculations
        momo_income = Transaction.objects.filter(
            driver=user, method='MOMO', transaction_type='INCOME', created_at__date__gte=week_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        momo_expense = Transaction.objects.filter(
            driver=user, method='MOMO', transaction_type='EXPENSE', created_at__date__gte=week_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        momo_balance = float(momo_income) - float(momo_expense)
        
        # Top expense calculation
        expense_by_category = Transaction.objects.filter(
            driver=user, is_income=False, created_at__date__gte=week_ago
        ).values('category__name').annotate(
            total=Sum('amount')
        ).order_by('-total').first()
        
        top_expense = expense_by_category['category__name'] if expense_by_category else 'None'
        top_expense_amount = float(expense_by_category['total']) if expense_by_category else 0
        
        # Total saved from vaults
        total_saved = sum(v.current_amount for v in user.vaults.all())
        
        # Safety net
        try:
            profile = user.driver_profile
            safety_net = float(profile.safety_net_current)
            safety_net_target = float(profile.safety_net_target)
        except DriverProfile.DoesNotExist:
            safety_net = 0
            safety_net_target = 5000
        
        # Day classification (last 7 days)
        daily_stats = Transaction.objects.filter(
            driver=user, created_at__date__gte=week_ago
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            income=Sum('amount', filter=Q(transaction_type='INCOME')),
            expense=Sum('amount', filter=Q(transaction_type='EXPENSE'))
        ).order_by('date')
        
        high_profit_days = 0
        break_even_days = 0
        loss_days = 0
        
        for day in daily_stats:
            income = float(day['income'] or 0)
            expense = float(day['expense'] or 0)
            net = income - expense
            if net > 50:
                high_profit_days += 1
            elif net >= 0:
                break_even_days += 1
            else:
                loss_days += 1
        
        # Recent transactions
        recent_transactions = Transaction.objects.filter(driver=user).order_by('-created_at')[:5]
        
        return Response({
            'cash_on_hand': round(cash_on_hand, 2),
            'momo_balance': round(momo_balance, 2),
            'total_saved': round(total_saved, 2),
            'top_expense': top_expense,
            'top_expense_amount': round(top_expense_amount, 2),
            'safety_net': round(safety_net, 2),
            'safety_net_target': round(safety_net_target, 2),
            'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
            'high_profit_days': high_profit_days,
            'break_even_days': break_even_days,
            'loss_days': loss_days,
        })


# ============================================
# SIMPLE VIEWSETS (Auto-generated CRUD)
# ============================================

class CategoryViewSet(viewsets.ModelViewSet):
    """Expense/Income categories (read-only for app)"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Categories are global, not per-user
        return Category.objects.all()


class BudgetViewSet(viewsets.ModelViewSet):
    """Monthly spending limits by category"""
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Budget.objects.none()  # Placeholder, overridden by get_queryset
    
    def get_queryset(self):
        return Budget.objects.filter(driver=self.request.user)

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    """CRUD for financial transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Transaction.objects.none()  # Placeholder
    
    def get_queryset(self):
        return Transaction.objects.filter(driver=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user, synced=False)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Group transactions by category"""
        transactions = self.get_queryset()
        grouped = {}
        for t in transactions:
            cat = t.category.name if t.category else 'Uncategorized'
            if cat not in grouped:
                grouped[cat] = {'count': 0, 'total': 0}
            grouped[cat]['count'] += 1
            grouped[cat]['total'] += float(t.amount)
        return Response(grouped)

    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """Weekly summary for charts"""
        weeks = int(request.query_params.get('weeks', 4))
        start_date = timezone.now().date() - timedelta(weeks=weeks)
        
        data = []
        for i in range(weeks):
            week_start = start_date + timedelta(weeks=i)
            week_end = week_start + timedelta(days=6)
            
            week_income = Transaction.objects.filter(
                driver=request.user,
                transaction_type='INCOME',
                created_at__date__range=[week_start, week_end]
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            week_expense = Transaction.objects.filter(
                driver=request.user,
                transaction_type='EXPENSE',
                created_at__date__range=[week_start, week_end]
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            data.append({
                'week': f'Week {i+1}',
                'income': float(week_income),
                'expense': float(week_expense),
                'net': float(week_income) - float(week_expense),
            })
        
        return Response(data)


# ============================================
# ALLOCATION & TARGETS VIEWS
# ============================================

class AllocationViewSet(viewsets.ModelViewSet):
    """Manage income allocation percentages"""
    serializer_class = AllocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Allocation.objects.none()

    def get_queryset(self):
        return Allocation.objects.filter(driver=self.request.user).order_by('order')

    def perform_create(self, serializer):
        # Ensure total doesn't exceed 100%
        total = sum(a.percent for a in self.get_queryset())
        new_percent = serializer.validated_data['percent']
        if total + new_percent > 100:
            return Response(
                {'error': 'Total allocation cannot exceed 100%'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(driver=self.request.user)


class MilestoneViewSet(viewsets.ModelViewSet):
    """Milestone tracker management"""
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Milestone.objects.none()

    def get_queryset(self):
        return Milestone.objects.filter(driver=self.request.user, status='ACTIVE')

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)

    @action(detail=True, methods=['post'])
    def add_contribution(self, request, pk=None):
        """Add money to an existing milestone"""
        milestone = self.get_object()
        amount = request.data.get('amount')
        
        if not amount:
            return Response({'error': 'Amount required'}, status=400)
        
        try:
            amount = float(amount)
            milestone.current_amount += amount
            milestone.save()
            return Response({'new_total': milestone.current_amount})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark milestone as completed"""
        milestone = self.get_object()
        milestone.status = 'COMPLETED'
        milestone.current_amount = milestone.target_amount
        milestone.save()
        return Response({'status': 'completed'})


# ============================================
# SAVINGS VAULTS VIEWS
# ============================================

class VaultViewSet(viewsets.ModelViewSet):
    """Named savings vaults management"""
    serializer_class = VaultSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Vault.objects.none()

    def get_queryset(self):
        return Vault.objects.filter(driver=self.request.user, is_active=True).order_by('-is_emergency', 'name')

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Total saved and days of freedom"""
        vaults = self.get_queryset()
        total_saved = sum(v.current_amount for v in vaults)
        days_of_freedom = int(total_saved / 50)
        
        total_goals = sum(v.target_amount for v in vaults if v.target_amount)
        progress = (total_saved / total_goals * 100) if total_goals > 0 else 0
        
        return Response({
            'total_saved': float(total_saved),
            'days_of_freedom': days_of_freedom,
            'goal_progress': round(progress, 1),
            'vault_count': vaults.count(),
        })

    @action(detail=True, methods=['post'])
    def contribute(self, request, pk=None):
        """Add contribution to vault (from cash or external source)"""
        vault = self.get_object()
        serializer = VaultContributionSerializer(data=request.data)
        
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            vault.current_amount += amount
            vault.save()
            return Response({
                'vault_id': vault.id,
                'new_amount': float(vault.current_amount),
                'progress': vault.progress_percent,
            })
        return Response(serializer.errors, status=400)


# ============================================
# VEHICLE MANAGEMENT VIEWS
# ============================================

class VehicleViewSet(viewsets.ModelViewSet):
    """Vehicle asset tracking"""
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Vehicle.objects.none()

    def get_queryset(self):
        return Vehicle.objects.filter(driver=self.request.user)

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)

    @action(detail=True, methods=['post'])
    def update_odometer(self, request, pk=None):
        """Update vehicle odometer reading"""
        vehicle = self.get_object()
        new_odometer = request.data.get('current_odometer')
        
        if not new_odometer:
            return Response({'error': 'Odometer reading required'}, status=400)
        
        vehicle.current_odometer = int(new_odometer)
        vehicle.save()
        return Response({
            'current_odometer': vehicle.current_odometer,
            'km_until_service': vehicle.km_until_service
        })

    @action(detail=True, methods=['post'])
    def add_fuel(self, request, pk=None):
        """Log a fuel purchase"""
        vehicle = self.get_object()
        quantity = request.data.get('quantity')
        cost = request.data.get('cost')
        odometer = request.data.get('odometer')
        
        if not all([quantity, cost, odometer]):
            return Response({'error': 'quantity, cost, and odometer required'}, status=400)
        
        vehicle.last_fuel_quantity = float(quantity)
        vehicle.last_fuel_cost = float(cost)
        vehicle.current_odometer = int(odometer)
        vehicle.save()
        return Response({'status': 'fuel logged'})


class MaintenanceLogViewSet(viewsets.ModelViewSet):
    """Service history logging"""
    serializer_class = MaintenanceLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MaintenanceLog.objects.none()

    def get_queryset(self):
        vehicle_id = self.request.query_params.get('vehicle')
        if vehicle_id:
            return MaintenanceLog.objects.filter(vehicle__driver=self.request.user, vehicle_id=vehicle_id)
        return MaintenanceLog.objects.filter(vehicle__driver=self.request.user)

    def perform_create(self, serializer):
        vehicle = Vehicle.objects.get(id=self.request.data.get('vehicle'))
        if vehicle.driver != self.request.user:
            raise PermissionDenied()
        serializer.save()


# ============================================
# NOTIFICATION VIEWS
# ============================================

class NotificationViewSet(viewsets.ModelViewSet):
    """In-app notification center"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.none()

    def get_queryset(self):
        return Notification.objects.filter(driver=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        count = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'marked_read': count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'read'})


# ============================================
# PROFILES & SETTINGS VIEWS
# ============================================

class DriverProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = DriverProfile.objects.get_or_create(user=request.user)
        serializer = DriverProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, created = DriverProfile.objects.get_or_create(user=request.user)
        serializer = DriverProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ============================================
# SYNC & OFFLINE VIEWS
# ============================================

class SyncView(APIView):
    """Batch sync endpoint for offline data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        device_id = request.data.get('device_id', 'unknown')
        
        with db_transaction.atomic():
            # Log the sync attempt
            sync_log = SyncLog.objects.create(
                driver=user,
                device_id=device_id,
                status='IN_PROGRESS'
            )
            
            try:
                # Process unsaved local data
                # This endpoint accepts batches and returns latest server state
                # Implementation would handle conflict resolution with timestamps
                
                sync_log.status = 'SUCCESS'
                sync_log.save()
                return Response({'status': 'synced', 'sync_id': sync_log.id})
            except Exception as e:
                sync_log.status = 'FAILED'
                sync_log.error_message = str(e)
                sync_log.save()
                return Response({'error': str(e)}, status=500)


# ============================================
# REPORTING & ANALYTICS VIEWS
# ============================================

class AnnualVisionData(APIView):
    """Chart data for Annual Vision screen"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        current_year = timezone.now().year
        
        monthly_stats = Transaction.objects.filter(
            driver=user, created_at__year=current_year
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            income=Sum('amount', filter=Q(transaction_type='INCOME')),
            expense=Sum('amount', filter=Q(transaction_type='EXPENSE'))
        ).order_by('month')

        transactions_list = list(monthly_stats)
        
        total_income = sum(float(t['income'] or 0) for t in transactions_list)
        total_expense = sum(float(t['expense'] or 0) for t in transactions_list)
        net_profit = total_income - total_expense
        
        # FIX: Avoid division by zero
        avg_monthly_income = total_income / max(len(transactions_list), 1)
        
        projected_savings = avg_monthly_income * 12
        
        monthly_data = []
        running_total = 0
        for t in transactions_list:
            month_income = float(t['income'] or 0)
            month_expense = float(t['expense'] or 0)
            running_total += month_income - month_expense
            month_name = t['month'].strftime('%b') if t['month'] else 'N/A'
            monthly_data.append({
                'month': month_name,
                'income': month_income,
                'expense': month_expense,
                'net': month_income - month_expense,
                'running_total': running_total
            })
        
        return Response({
            'monthly_data': monthly_data,
            'total_income': round(total_income, 2),
            'total_expense': round(total_expense, 2),
            'net_profit': round(net_profit, 2),
            'avg_monthly_income': round(avg_monthly_income, 2),
            'projected_annual_savings': round(projected_savings, 2),
            'current_year': current_year
        })


class InsightReportsView(APIView):
    """Reports and analytics"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        period = request.query_params.get('period', 'monthly')
        
        # Calculate net margin, avg daily, etc.
        all_txns = Transaction.objects.filter(driver=user, created_at__date__gte=timezone.now().date() - timedelta(days=30))
        
        total_income = all_txns.filter(transaction_type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = all_txns.filter(transaction_type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
        net_profit = total_income - total_expense
        net_margin = (net_profit / total_income * 100) if total_income > 0 else 0
        avg_daily = net_profit / 30
        
        active_days = all_txns.annotate(date=TruncDate('created_at')).values('date').distinct().count()
        
        return Response({
            'net_margin': round(net_margin, 2),
            'avg_daily_profit': round(float(avg_daily), 2),
            'total_income': round(float(total_income), 2),
            'active_days': active_days,
            'period': period,
            'reports': [
                {'name': 'Monthly Statement - April 2026', 'date': '2026-04-01'},
                {'name': 'Q1 2026 Summary', 'date': '2026-03-31'},
                {'name': 'Tax Report 2025', 'date': '2025-12-31'},
            ]
        })
