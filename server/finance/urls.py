from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # Auth
    register_user,
    # Dashboard
    DashboardSummary,
    DriverProfileView,
    # Financial CRUD
    CategoryViewSet, TransactionViewSet, BudgetViewSet,
    # Targets & Goals
    AllocationViewSet, MilestoneViewSet,
    # Vaults
    VaultViewSet,
    # Vehicle
    VehicleViewSet, MaintenanceLogViewSet,
    # Notifications
    NotificationViewSet,
    # Reports
    AnnualVisionData, InsightReportsView,
    # Sync
    SyncView,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'allocations', AllocationViewSet, basename='allocation')
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'vaults', VaultViewSet, basename='vault')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'maintenance-logs', MaintenanceLogViewSet, basename='maintenancelog')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', register_user, name='register'),
    
    # Dashboard & Profile
    path('dashboard/', DashboardSummary.as_view(), name='dashboard-summary'),
    path('profile/', DriverProfileView.as_view(), name='driver-profile'),
    
    # Core data CRUD (router)
    path('', include(router.urls)),
    
    # Reports & Analytics
    path('reports/annual-vision/', AnnualVisionData.as_view(), name='annual-vision'),
    path('reports/insights/', InsightReportsView.as_view(), name='insight-reports'),
    
    # Sync
    path('sync/', SyncView.as_view(), name='sync'),
]