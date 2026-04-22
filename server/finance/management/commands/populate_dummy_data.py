from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import random
from server.finance.models import Category, Transaction


class Command(BaseCommand):
    help = 'Populates the database with dummy transaction data'

    def handle(self, *args, **options):
        Category.objects.all().delete()
        Transaction.objects.all().delete()

        fuel_cat = Category.objects.create(name='Fuel', description='Fuel expenses', is_income=False)
        food_cat = Category.objects.create(name='Food/Personal', description='Food and personal expenses', is_income=False)
        repair_cat = Category.objects.create(name='Repair', description='Vehicle repairs', is_income=False)
        toll_cat = Category.objects.create(name='Toll/Road', description='Tolls and road charges', is_income=False)
        fare_cat = Category.objects.create(name='Fare Income', description='Passenger fare income', is_income=True)
        package_cat = Category.objects.create(name='Package Delivery', description='Package delivery income', is_income=True)

        categories_income = [fare_cat, package_cat]
        categories_expense = [fuel_cat, food_cat, repair_cat, toll_cat]

        today = timezone.now()
        months_data = [
            ('January', 1, 15),
            ('February', 2, 12),
            ('March', 3, 20),
            ('April', 4, 8),
        ]

        total_income = 0
        total_expense = 0

        for month_name, month_num, days_active in months_data:
            for day in range(1, days_active + 1):
                for _ in range(random.randint(3, 6)):
                    base_date = today.replace(month=month_num, day=day) if month_num <= 4 else today - timedelta(days=random.randint(1, 30))
                    date = base_date - timedelta(hours=random.randint(1, 12))

                    amount = Decimal(str(random.randint(50, 200)))
                    is_income = random.random() > 0.35

                    if is_income:
                        category = random.choice(categories_income)
                        amount = Decimal(str(random.randint(80, 350)))
                        total_income += amount
                    else:
                        category = random.choice(categories_expense)
                        amount = Decimal(str(random.randint(30, 250)))
                        total_expense += amount

                    intent = f"{category.name} - {month_name} {day}"

                    Transaction.objects.create(
                        amount=amount,
                        is_income=is_income,
                        method='CASH' if random.random() > 0.4 else 'MOMO',
                        category=category,
                        intent=intent,
                        notes=f'Dummy {category.name} transaction',
                        created_at=date,
                    )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created dummy data: {Transaction.objects.count()} transactions'
        ))
        self.stdout.write(f'Total Income: ₵{total_income:.2f}')
        self.stdout.write(f'Total Expense: ₵{total_expense:.2f}')
        self.stdout.write(f'Net Profit: ₵{total_income - total_expense:.2f}')