from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# ============================================
# PROFILES & USER CONFIGURATION
# ============================================

class DriverProfile(models.Model):
    """Extended profile for a driver/operator using Prosper"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    daily_goal = models.DecimalField(max_digits=10, decimal_places=2, default=400.00,
                                     help_text="Target daily net profit in local currency")
    safety_net_target = models.DecimalField(max_digits=10, decimal_places=2, default=5000.00,
                                            help_text="Emergency fund target amount")
    safety_net_current = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                             help_text="Current emergency fund balance")
    currency = models.CharField(max_length=3, default='GHS', choices=[
        ('GHS', 'Ghana Cedi'),
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('NGN', 'Nigerian Naira'),
        ('KES', 'Kenyan Shilling'),
    ])
    language = models.CharField(max_length=5, default='en')
    timezone = models.CharField(max_length=50, default='Africa/Accra')
    is_shift_active = models.BooleanField(default=False)
    shift_start_time = models.DateTimeField(null=True, blank=True)
    
    # Sync metadata
    last_sync_at = models.DateTimeField(null=True, blank=True)
    device_id = models.CharField(max_length=255, blank=True, help_text="Unique device identifier for sync")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Driver: {self.user.username}"

    @property
    def days_of_freedom(self):
        """How many days the safety net covers at ₵50/day burn rate"""
        return int(self.safety_net_current / 50)


# ============================================
# TRANSACTIONS & CATEGORIZATION
# ============================================

class Category(models.Model):
    """Expense/Income categories with icons and colors for UI"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, 
                          help_text="Lucide icon name (e.g., 'Fuel', 'Wrench')")
    color = models.CharField(max_length=7, default='#004D40',
                           help_text="Hex color code for UI")
    is_income = models.BooleanField(default=False)
    is_fixed = models.BooleanField(default=False,
                                   help_text="Fixed expense (rent, insurance) vs variable")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Transaction(models.Model):
    """Every financial movement logged by the driver"""
    METHOD_CHOICES = [
        ('CASH', 'Cash'),
        ('MOMO', 'Mobile Money'),
        ('BANK', 'Bank Transfer'),
        ('CARD', 'Card Payment'),
    ]

    TYPE_CHOICES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES, default='CASH')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    intent = models.CharField(max_length=255, help_text="Purpose or description (e.g., 'Morning fuel')")
    notes = models.TextField(blank=True)
    odometer_reading = models.IntegerField(null=True, blank=True,
                                          help_text="Vehicle km at time of transaction (for fuel/repair)")
    
    # Sync fields
    synced = models.BooleanField(default=False, help_text="Has this been uploaded to cloud?")
    local_id = models.CharField(max_length=100, blank=True, unique=True,
                               help_text="Temporary ID for offline edits")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['driver', 'created_at']),
            models.Index(fields=['transaction_type', 'category']),
        ]

    def __str__(self):
        return f"{self.transaction_type} {self.amount} - {self.intent}"


# ============================================
# BUDGETING & ALLOCATION
# ============================================

class Budget(models.Model):
    """Monthly spending limits per category"""
    PERIOD_CHOICES = [
        ('monthly', 'Monthly'),
        ('weekly', 'Weekly'),
        ('quarterly', 'Quarterly'),
    ]

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Budget limit for this period")
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='monthly')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['driver', 'category', 'period']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.category.name}: {self.amount}/{self.period}"


class Allocation(models.Model):
    """Income allocation percentages (Set Targets screen)"""
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='allocations')
    label = models.CharField(max_length=50, choices=[
        ('Operating Costs', 'Operating Costs'),
        ('Business Growth', 'Business Growth'),
        ('Safety Net', 'Safety Net'),
        ('Personal/Home', 'Personal/Home'),
    ])
    percent = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    color = models.CharField(max_length=7, default='#004D40')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['driver', 'label']
        ordering = ['order']

    def __str__(self):
        return f"{self.label} ({self.percent}%)"


class Milestone(models.Model):
    """Named savings goals with deadlines (milestone trackers)"""
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ARCHIVED', 'Archived'),
    ]

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=200)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Calculated field (not stored, computed)
    @property
    def progress_percent(self):
        if self.target_amount == 0:
            return 0
        return round((self.current_amount / self.target_amount) * 100, 1)

    @property
    def days_left(self):
        if not self.deadline:
            return None
        from datetime import date
        delta = self.deadline - date.today()
        return delta.days if delta.days >= 0 else 0

    @property
    def daily_needed(self):
        """Amount needed per day to reach target by deadline"""
        if not self.deadline or self.days_left <= 0:
            return 0
        remaining = self.target_amount - self.current_amount
        return max(0, remaining / self.days_left)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}: {self.current_amount}/{self.target_amount}"


# ============================================
# SAVINGS VAULTS
# ============================================

class Vault(models.Model):
    """Named savings containers with individual goals"""
    VAULT_TYPES = [
        ('Emergency Net', 'Emergency Net'),
        ('Vehicle Upgrade', 'Vehicle Upgrade'),
        ('School Fees', 'School Fees'),
        ('Business Growth', 'Business Growth'),
        ('Custom', 'Custom'),
    ]

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vaults')
    name = models.CharField(max_length=100)
    vault_type = models.CharField(max_length=50, choices=VAULT_TYPES, default='Custom')
    description = models.TextField(blank=True)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    icon = models.CharField(max_length=50, default='ShieldCheck')
    color = models.CharField(max_length=7, default='#004D40')
    allocation_percent = models.IntegerField(default=0,
                                            help_text="Auto-allocation % from income")
    is_emergency = models.BooleanField(default=False,
                                      help_text="Is this the primary safety net?")
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_emergency', 'name']

    def __str__(self):
        return f"{self.name}: {self.current_amount}/{self.target_amount or '∞'}"

    @property
    def progress_percent(self):
        if not self.target_amount or self.target_amount == 0:
            return 0
        return round((self.current_amount / self.target_amount) * 100, 1)


# ============================================
# VEHICLE MANAGEMENT
# ============================================

class Vehicle(models.Model):
    """Primary vehicle asset tracking"""
    driver = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vehicle')
    make = models.CharField(max_length=50, default='Toyota')
    model = models.CharField(max_length=50, default='Corolla')
    year = models.IntegerField(default=2020)
    license_plate = models.CharField(max_length=20, unique=True)
    
    # Odometer & Service
    current_odometer = models.IntegerField(default=0, help_text="Current km reading")
    last_service_odometer = models.IntegerField(default=0, help_text="Km at last service")
    service_interval_km = models.IntegerField(default=5000, help_text="Service interval in km")
    
    # Efficiency tracking
    fuel_efficiency = models.DecimalField(max_digits=5, decimal_places=2, default=12.5,
                                          help_text="Litres per 100km or ₵/km")
    last_fuel_quantity = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    last_fuel_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Insurance & Compliance
    insurance_expiry = models.DateField(null=True, blank=True)
    roadworthy_expiry = models.DateField(null=True, blank=True)
    license_expiry = models.DateField(null=True, blank=True)
    
    # Health & Valuation
    health_score = models.IntegerField(default=85, validators=[MinValueValidator(0), MaxValueValidator(100)])
    estimated_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Maintenance fund
    maintenance_fund = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    maintenance_fund_target = models.DecimalField(max_digits=12, decimal_places=2, default=2000)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model} ({self.license_plate})"

    @property
    def km_until_service(self):
        """Kilometers remaining until next service"""
        if self.last_service_odometer == 0:
            return self.service_interval_km
        km_driven = self.current_odometer - self.last_service_odometer
        return max(0, self.service_interval_km - km_driven)

    @property
    def is_service_due(self):
        return self.km_until_service <= 0


class MaintenanceLog(models.Model):
    """History of repairs, services, and modifications"""
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_logs')
    service_type = models.CharField(max_length=100, help_text="e.g., Oil Change, Brake Pad Replacement")
    description = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    odometer_reading = models.IntegerField(help_text="Odometer at time of service")
    service_date = models.DateField()
    receipt_image = models.URLField(blank=True, null=True, help_text="Link to uploaded receipt")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-service_date']

    def __str__(self):
        return f"{self.service_type} - {self.service_date}"


# ============================================
# NOTIFICATIONS & ALERTS
# ============================================

class Notification(models.Model):
    """In-app notifications for reminders and insights"""
    TYPE_CHOICES = [
        ('INFO', 'Information'),
        ('WARNING', 'Warning'),
        ('SUCCESS', 'Success'),
        ('ALERT', 'Alert'),
    ]

    ICON_MAP = {
        'INFO': 'Info',
        'WARNING': 'AlertTriangle',
        'SUCCESS': 'CheckCircle',
        'ALERT': 'AlertCircle',
    }

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='INFO')
    icon = models.CharField(max_length=50, blank=True)
    action_label = models.CharField(max_length=50, blank=True, help_text="Button text (e.g., 'View Report')")
    action_url = models.CharField(max_length=200, blank=True, help_text="Deep link to screen")
    is_read = models.BooleanField(default=False)
    is_persistent = models.BooleanField(default=False,
                                       help_text="Should user manually dismiss?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type}: {self.title}"

    def save(self, *args, **kwargs):
        if not self.icon and self.notification_type in self.ICON_MAP:
            self.icon = self.ICON_MAP[self.notification_type]
        super().save(*args, **kwargs)


# ============================================
# SYNC & OFFLINE SUPPORT
# ============================================

class SyncLog(models.Model):
    """Tracks sync operations for conflict resolution and audit"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('CONFLICT', 'Conflict Detected'),
    ]

    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sync_logs')
    device_id = models.CharField(max_length=255, help_text="Which device performed sync")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    transaction_count = models.IntegerField(default=0, help_text="Number of transactions synced")
    bytes_uploaded = models.BigIntegerField(default=0)
    bytes_downloaded = models.BigIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    server_timestamp = models.DateTimeField(auto_now_add=True, help_text="Server time of record")

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"Sync {self.id} - {self.status} ({self.device_id})"


class PendingUpload(models.Model):
    """Queue of unsynced changes waiting for upload"""
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pending_uploads')
    model_name = models.CharField(max_length=50, help_text="Model name (Transaction, Vault, etc.)")
    instance_id = models.CharField(max_length=100, help_text="Local ID of the record")
    operation = models.CharField(max_length=20, choices=[
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
    ])
    data = models.JSONField(help_text="Serialized record data to sync")
    retry_count = models.IntegerField(default=0)
    last_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.operation} {self.model_name} ({self.driver.username})"
