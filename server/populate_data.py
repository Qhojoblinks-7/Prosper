import sqlite3
import random
from datetime import datetime, timedelta

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

cursor.execute("DELETE FROM finance_transaction")
cursor.execute("DELETE FROM finance_category")

now = datetime.now()

cursor.execute("INSERT INTO finance_category (name, description, icon, is_income, created_at) VALUES (?, ?, ?, 0, ?)", ('Fuel', 'Fuel expenses', '', now))
cursor.execute("INSERT INTO finance_category (name, description, icon, is_income, created_at) VALUES (?, ?, ?, 0, ?)", ('Food/Personal', 'Food and personal expenses', '', now))
cursor.execute("INSERT INTO finance_category (name, description, icon, is_income, created_at) VALUES (?, ?, ?, 0, ?)", ('Repair', 'Vehicle repairs', '', now))
cursor.execute("INSERT INTO finance_category (name, description, icon, is_income, created_at) VALUES (?, ?, ?, 0, ?)", ('Toll/Road', 'Tolls and road charges', '', now))
cursor.execute("INSERT INTO finance_category (name, description, icon, is_income, created_at) VALUES (?, ?, ?, 1, ?)", ('Fare Income', 'Passenger fare income', '', now))
cursor.execute("INSERT INTO finance_category (name, description, icon, is_income, created_at) VALUES (?, ?, ?, 1, ?)", ('Package Delivery', 'Package delivery income', '', now))

conn.commit()

cursor.execute("SELECT id, is_income FROM finance_category")
categories = cursor.fetchall()
income_ids = [c[0] for c in categories if c[1] == 1]
expense_ids = [c[0] for c in categories if c[1] == 0]

months_data = [
    ('January', 1, 15),
    ('February', 2, 12),
    ('March', 3, 20),
    ('April', 4, 8),
]

total_income = 0
total_expense = 0
now = datetime.now()

for month_name, month_num, days_active in months_data:
    for day in range(1, days_active + 1):
        num_transactions = random.randint(3, 6)
        for _ in range(num_transactions):
            try:
                if month_num <= 4:
                    date = datetime(now.year, month_num, day, random.randint(1, 23), random.randint(0, 59))
                else:
                    date = now - timedelta(days=random.randint(1, 30))
            except ValueError:
                date = now - timedelta(days=random.randint(1, 30))
            
            is_income = random.random() > 0.35
            
            if is_income:
                category_id = random.choice(income_ids)
                amount = random.randint(80, 350)
                total_income += amount
            else:
                category_id = random.choice(expense_ids)
                amount = random.randint(30, 250)
                total_expense += amount
            
            method = 'CASH' if random.random() > 0.4 else 'MOMO'
            
            cursor.execute("INSERT INTO finance_transaction (amount, is_income, method, category_id, intent, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                (amount, is_income, method, category_id, f'{month_name} {day}', 'Dummy transaction', date, date))

conn.commit()

cursor.execute("SELECT COUNT(*) FROM finance_transaction")
count = cursor.fetchone()[0]

conn.close()

print(f"Created {count} transactions")
print(f"Total Income: {total_income}")
print(f"Total Expense: {total_expense}")
print(f"Net Profit: {total_income - total_expense}")