from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget, DriverProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DriverProfile
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Budget
        fields = '__all__'

class DashboardSummarySerializer(serializers.Serializer):
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