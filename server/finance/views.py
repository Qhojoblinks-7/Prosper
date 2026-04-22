from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncDate, TruncMonth</from datetime import datetime
from datetime import timedelta
from django.utils import timezone
from .models import Category, Transaction, Budget, DriverProfile
from .serializers import (
    CategorySerializer, TransactionSerializer, 
    BudgetSerializer, DriverProfileSerializer, UserSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

class DashboardSummary(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        cash_income = Transaction.objects.filter(
            method='CASH', is_income=True
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        cash_expense = Transaction.objects.filter(
            method='CASH', is_income=False
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        cash_on_hand = float(cash_income) - float(cash_expense)
        
        momo_income = Transaction.objects.filter(
            method='MOMO', is_income=True
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        momo_expense = Transaction.objects.filter(
            method='MOMO', is_income=False
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        momo_balance = float(momo_income) - float(momo_expense)
        
        expense_by_category = Transaction.objects.filter(
            is_income=False
        ).values('category__name').annotate(
            total=Sum('amount')
        ).order_by('-total').first()
        
        top_expense = expense_by_category['category__name'] if expense_by_category else 'None'
        top_expense_amount = float(expense_by_category['total']) if expense_by_category else 0
        
        daily_stats = Transaction.objects.filter(
            created_at__date__gte=week_ago
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            income=Sum('amount', filter=Q(is_income=True)),
            expense=Sum('amount', filter=Q(is_income=False))
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
        
        recent_transactions = Transaction.objects.all().order_by('-created_at')[:5]
        
        try:
            profile = DriverProfile.objects.first()
            safety_net = float(profile.safety_net_current) if profile else 0
            safety_net_target = float(profile.safety_net_target) if profile else 500
            total_saved = safety_net
        except DriverProfile.DoesNotExist:
            safety_net = 0
            safety_net_target = 500
            total_saved = 0
        
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

class DriverProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            profile = DriverProfile.objects.first()
            if profile:
                serializer = DriverProfileSerializer(profile)
                return Response(serializer.data)
            return Response({'error': 'Profile not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class AnnualVisionData(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        current_year = datetime.now().year
        
        monthly_stats = Transaction.objects.filter(
            created_at__year=current_year
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            income=Sum('amount', filter=Q(is_income=True)),
            expense=Sum('amount', filter=Q(is_income=False))
        ).order_by('month')

        transactions_list = list(monthly_stats)
        
        total_income = sum(float(t['income'] or 0) for t in transactions_list)
        total_expense = sum(float(t['expense'] or 0) for t in transactions_list)
        net_profit = total_income - total_expense
        
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