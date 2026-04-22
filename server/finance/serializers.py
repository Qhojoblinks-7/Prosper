from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    DriverProfile, Category, Transaction, Budget,
    Allocation, Milestone, Vault, Vehicle,
    MaintenanceLog, Notification, SyncLog, PendingUpload
)

# ============================================
# AUTHENTICATION & USER SERIALIZERS
# ============================================

class UserSerializer(serializers.ModelSerializer):
    """Basic user info for mobile app"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """For creating new user accounts"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


# ============================================
# DRIVER PROFILE SERIALIZER
# ============================================

class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    days_of_freedom = serializers.IntegerField(source='days_of_freedom', read_only=True)

    class Meta:
        model = DriverProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_sync_at', 'device_id']


# ============================================
# CORE FINANCIAL SERIALIZERS
# ============================================

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'driver', 'amount', 'transaction_type', 'method',
            'category', 'category_name', 'category_icon', 'category_color',
            'intent', 'notes', 'odometer_reading', 'synced', 'local_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'synched']

    def create(self, validated_data):
        # Auto-assign to driver from request context
        request = self.context.get('request')
        if request and request.user:
            validated_data['driver'] = request.user
            validated_data['synced'] = False
        return super().create(validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            # Ensure budget belongs to current user
            pass
        return super().create(validated_data)


# ============================================
# ALLOCATION & TARGETS SERIALIZERS
# ============================================

class AllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allocation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class MilestoneSerializer(serializers.ModelSerializer):
    progress_percent = serializers.FloatField(source='progress_percent', read_only=True)
    days_left = serializers.IntegerField(source='days_left', read_only=True)
    daily_needed = serializers.DecimalField(source='daily_needed', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Milestone
        fields = [
            'id', 'driver', 'name', 'target_amount', 'current_amount',
            'deadline', 'status', 'progress_percent', 'days_left', 'daily_needed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'progress_percent', 'days_left', 'daily_needed']


# ============================================
# SAVINGS VAULTS SERIALIZERS
# ============================================

class VaultSerializer(serializers.ModelSerializer):
    progress_percent = serializers.FloatField(source='progress_percent', read_only=True)
    Icon = serializers.CharField(source='icon', read_only=True)  # for frontend icon lookup

    class Meta:
        model = Vault
        fields = [
            'id', 'driver', 'name', 'vault_type', 'description',
            'current_amount', 'target_amount', 'icon', 'color',
            'allocation_percent', 'is_emergency', 'is_active',
            'progress_percent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'progress_percent']


class VaultContributionSerializer(serializers.Serializer):
    """For adding money to a vault"""
    vault_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value


# ============================================
# VEHICLE SERIALIZERS
# ============================================

class VehicleSerializer(serializers.ModelSerializer):
    km_until_service = serializers.IntegerField(source='km_until_service', read_only=True)
    is_service_due = serializers.BooleanField(source='is_service_due', read_only=True)
    days_of_freedom = serializers.IntegerField(source='days_of_freedom', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'driver', 'make', 'model', 'year', 'license_plate',
            'current_odometer', 'last_service_odometer', 'service_interval_km',
            'fuel_efficiency', 'last_fuel_quantity', 'last_fuel_cost',
            'insurance_expiry', 'roadworthy_expiry', 'license_expiry',
            'health_score', 'estimated_value', 'maintenance_fund',
            'maintenance_fund_target', 'km_until_service', 'is_service_due',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'km_until_service', 'is_service_due']

    def validate_license_plate(self, value):
        # Normalize license plate (uppercase, no spaces)
        return value.upper().replace(' ', '')


class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceLog
        fields = '__all__'
        read_only_fields = ['created_at']


# ============================================
# NOTIFICATION SERIALIZERS
# ============================================

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'driver', 'title', 'message', 'notification_type',
            'icon', 'action_label', 'action_url', 'is_read',
            'is_persistent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NotificationMarkReadSerializer(serializers.Serializer):
    """Bulk mark notifications as read"""
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False
    )
    mark_all = serializers.BooleanField(default=False)


# ============================================
# SYNC & OFFLINE SERIALIZERS
# ============================================

class SyncLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncLog
        fields = [
            'id', 'driver', 'device_id', 'status', 'transaction_count',
            'bytes_uploaded', 'bytes_downloaded', 'started_at',
            'completed_at', 'error_message', 'server_timestamp'
        ]
        read_only_fields = ['id', 'started_at', 'server_timestamp']


class PendingUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingUpload
        fields = '__all__'
        read_only_fields = ['created_at', 'retry_count', 'last_error']


class BatchSyncSerializer(serializers.Serializer):
    """For uploading a batch of offline changes"""
    device_id = serializers.CharField(max_length=255)
    transactions = TransactionSerializer(many=True, required=False)
    vaults = VaultSerializer(many=True, required=False)
    milestones = MilestoneSerializer(many=True, required=False)
    vehicle = VehicleSerializer(required=False)
    # Add more models as needed

    def create(self, validated_data):
        # Process batch
        result = {
            'transactions_processed': 0,
            'vaults_processed': 0,
            'milestones_processed': 0,
            'errors': []
        }
        return result


# ============================================
# DASHBOARD & ANALYTICS SERIALIZERS
# ============================================

class DashboardSummarySerializer(serializers.Serializer):
    """Aggregated data for Home screen"""
    cash_on_hand = serializers.DecimalField(max_digits=12, decimal_places=2)
    momo_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_saved = serializers.DecimalField(max_digits=12, decimal_places=2)
    top_expense = serializers.CharField()
    top_expense_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    safety_net = serializers.DecimalField(max_digits=12, decimal_places=2)
    safety_net_target = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_transactions = TransactionSerializer(many=True)
    high_profit_days = serializers.IntegerField()
    break_even_days = serializers.IntegerField()
    loss_days = serializers.IntegerField()


class AnnualVisionDataSerializer(serializers.Serializer):
    """Data for Annual Vision screen chart"""
    monthly_data = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=12, decimal_places=2)
        )
    )
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    avg_monthly_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    projected_annual_savings = serializers.DecimalField(max_digits=12, decimal_places=2)
    current_year = serializers.IntegerField()