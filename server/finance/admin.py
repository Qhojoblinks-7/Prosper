from django.contrib import admin
from .models import (
    DriverProfile, Category, Transaction, Budget,
    Allocation, Milestone, Vault, Vehicle,
    MaintenanceLog, Notification, SyncLog, PendingUpload
)

# ============================================
# REGISTER MODELS WITHOUT CUSTOM ADMIN
# (Simple list view only)
# ============================================
simple_models = [Category, Budget, MaintenanceLog, PendingUpload]
for model in simple_models:
    admin.site.register(model)

# ============================================
# CUSTOM ADMIN CLASSES (with decorators)
# ============================================

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Transaction logs with full search and filtering"""
    list_display = ('id', 'driver', 'transaction_type', 'amount', 'category', 'method', 'created_at', 'synced')
    list_filter = ('transaction_type', 'method', 'category', 'synced', 'created_at')
    search_fields = ('intent', 'notes', 'driver__username')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ['-created_at']


@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    """Driver settings and configuration"""
    list_display = ('user', 'daily_goal', 'safety_net_target', 'safety_net_current', 'currency', 'is_shift_active')
    search_fields = ('user__username', 'user__email')
    list_filter = ('currency', 'is_shift_active')
    readonly_fields = ('days_of_freedom',)


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    """Vehicle asset management"""
    list_display = ('license_plate', 'driver', 'make', 'model', 'year', 'current_odometer', 'health_score', 'is_service_due')
    search_fields = ('license_plate', 'make', 'model')
    list_filter = ('make', 'year')
    readonly_fields = ('km_until_service', 'is_service_due')


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    """Goal tracking with progress visualization"""
    list_display = ('name', 'driver', 'target_amount', 'current_amount', 'status', 'deadline', 'progress_percent')
    list_filter = ('status', 'deadline')
    search_fields = ('name', 'driver__username')
    readonly_fields = ('progress_percent', 'days_left', 'daily_needed')


@admin.register(Vault)
class VaultAdmin(admin.ModelAdmin):
    """Savings vaults and allocation tracking"""
    list_display = ('name', 'driver', 'vault_type', 'current_amount', 'target_amount', 'progress_percent', 'is_emergency')
    list_filter = ('vault_type', 'is_emergency', 'is_active')
    search_fields = ('name', 'driver__username')
    readonly_fields = ('progress_percent',)


@admin.register(Allocation)
class AllocationAdmin(admin.ModelAdmin):
    """Income allocation percentages"""
    list_display = ('driver', 'label', 'percent', 'color', 'order', 'is_active')
    list_filter = ('is_active', 'label')
    search_fields = ('driver__username', 'label')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """In-app notification center"""
    list_display = ('driver', 'title', 'notification_type', 'is_read', 'is_persistent', 'created_at')
    list_filter = ('notification_type', 'is_read', 'is_persistent', 'created_at')
    search_fields = ('title', 'message', 'driver__username')
    readonly_fields = ('created_at',)


@admin.register(SyncLog)
class SyncLogAdmin(admin.ModelAdmin):
    """Sync operation audit trail"""
    list_display = ('id', 'driver', 'status', 'transaction_count', 'started_at', 'completed_at')
    list_filter = ('status', 'started_at')
    search_fields = ('driver__username', 'error_message')
    readonly_fields = ('started_at', 'completed_at', 'server_timestamp')
