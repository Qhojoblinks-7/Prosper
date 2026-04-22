from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, TransactionViewSet, BudgetViewSet,
    DashboardSummary, DriverProfileView, AnnualVisionData
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'budgets', BudgetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardSummary.as_view(), name='dashboard-summary'),
    path('profile/', DriverProfileView.as_view(), name='driver-profile'),
    path('annual-vision/', AnnualVisionData.as_view(), name='annual-vision'),
]