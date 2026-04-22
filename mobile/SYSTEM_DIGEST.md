# Prosper Mobile - System Digest

## Overview

**Prosper** is a comprehensive financial management and business intelligence mobile application designed for professional drivers and informal workers. The app transforms raw financial data into actionable business insights, helping users build wealth through disciplined financial habits.

**Architecture:** React Native (Expo) with custom state-based navigation via Zustand, offline-first data persistence, and a component-driven UI system.

---

## Navigation System

Prosper uses a **custom state-driven navigation** architecture rather than react-navigation:

- **Navigation Store:** `store/useFinanceStore.js` manages the `currentScreen` state
- **Conditional Rendering:** `App.js` checks `currentScreen` and conditionally renders the appropriate screen component
- **Side Drawer:** `SideDrawer.js` provides the hamburger menu navigation
- **Screen Components:** Each screen accepts a `navigation` prop with `navigate(screenName)` function

**Navigation Pattern:**
```javascript
const currentScreen = useFinanceStore(state => state.currentScreen);
const setCurrentScreen = useFinanceStore(state => state.setCurrentScreen);

// Navigate: setCurrentScreen('Targets') or navigation.navigate('Targets')
```

---

## Screens Reference

### 1. Home Screen (Main Dashboard)

**File:** `mobile/App.js:28-166`  
**Route:** `Home` (default)

**Purpose:**  
Primary dashboard displaying a real-time financial overview, shift status, and quick-access widgets.

**Key Components Integrated:**

| Component | Purpose |
|-----------|---------|
| `Header` | App bar with menu trigger, notification bell, sync indicator |
| `SideDrawer` | Navigation drawer (conditionally rendered) |
| `HeroCard` | Welcome banner with driver name and "Start Shift" button |
| `LiquidityCards` | Two-card module: Cash on Hand + Digital (Mobile Money) Balance |
| `ShiftMonitor` | Active shift tracker with circular efficiency indicator |
| `ExpenseFocus` | Displays top spending category with amount |
| `SafetyNet` *(widget)* | Emergency fund progress bar (mini version) |
| `WealthTracker` | Accumulated wealth metric with trend |
| `WealthOverview` | Asset vs liability snapshot |
| `MaintenanceTracker` | Vehicle service countdown & fund status |
| `TransactionEntry` *(modal)* | Quick income/expense logging interface |

**Data Flow:**
- Pulls state from `useFinanceStore` (cashOnHand, momoBalance, safetyNet, topExpense, isShiftActive, etc.)
- `handleSaveTransaction()` dispatches `addTransaction()` and updates `topExpense` if a larger expense is logged

**Special Features:**
- Shift toggle: Starts/stops tracking session duration
- Drawer toggle controlled by Zustand `isDrawerOpen` state
- Transaction modal allows categorizing expenses (Fuel, Repair, Food/Personal)

---

### 2. Annual Vision Screen

**File:** `mobile/src/components/AnnualVisionScreen.js`  
**Route:** `AnnualVision`

**Purpose:**  
Long-term wealth projection and trajectory visualization. Helps users see their 5-year financial future based on current monthly patterns.

**Key Features:**

1. **Projected Savings Card** (Top)
   - Displays estimated total savings by end of year
   - Shows average monthly net income
   - Uses dark teal background with trend badge

2. **Wealth Growth Chart**
   - Dual-line area chart using `react-native-gifted-charts`
   - **Line 1 (Dark Teal):** Cumulative savings running total
   - **Line 2 (Green):** Monthly net profit (income - expenses)
   - Shows 4 months of sample data
   - Interactive with smooth curves and data point labels

3. **Stats Grid**
   - Two-column layout
   - Card 1: Total Income (teal icon)
   - Card 2: Total Expenses (red icon)
   - Displays aggregate values from monthly data

4. **Asset Goal Progress**
   - Visual progress bar (percentage-based)
   - Example: Vehicle savings goal
   - Shows estimated completion date

5. **Mindset Insight Card**
   - Teal-colored motivational text block
   - Provides context about financial trajectory
   - Encourages long-term thinking

**Data Model:**
```javascript
monthly_data = [
  { month, income, expense, net, running_total }
]
projected_annual_savings = ?
current_year = 2026
```

**User Interactions:**
- Single back button returns to Home

---

### 3. Vehicle Management Screen

**File:** `mobile/src/components/VehicleScreen.js`  
**Route:** `VehicleManagement`

**Purpose:**  
Complete vehicle asset management: maintenance scheduling, health tracking, cost analysis, and resale value awareness.

**Key Sections:**

1. **Service Status Card**
   - Large circular km display: "1250 km remaining"
   - Total odometer reading: 45000 km
   - Health badge: "Healthy" with shield icon

2. **Fuel Efficiency & Insurance (Mini-Cards Row)**
   - **Fuel Card:** Displays ₵/km efficiency (12.5)
   - **Insurance Card:** Expiry date (Aug 20th)

3. **Badge Row**
   - **Roadworthy Badge:** Expiry date (Oct 15th)
   - **Tire Health Badge:** Status text (Good)

4. **Maintenance Fund Card**
   - Current saved amount vs target
   - Progress bar (percentage)
   - Insight text: "X% ready for next service"

5. **Recent Repairs Log**
   - Vertical list of past maintenance entries
   - Each item: Service name, date, cost
   - No border on last item

6. **Vehicle Appreciation Asset Card**
   - Health score display (85/100 large font)
   - Estimated resale value (₵80,000)
   - Motivational insight about maintenance value

**Data Model (Static Example):**
```javascript
{
  nextServiceKm, totalKm, fuelEfficiency,
  insuranceExpiry, roadworthinessExpiry,
  tireHealth, maintenanceFund, fundTarget,
  assetValue, healthScore, recentLogs[]
}
```

**User Interactions:**
- Scrollable single-column layout
- Back navigation to Home

---

### 4. Financial Tips Screen

**File:** `mobile/src/components/FinancialTipsScreen.js`  
**Route:** `FinancialTips`

**Purpose:**  
Educational and motivational content hub delivering Stoic wisdom, tactical advice, and mindset reframing.

**Content Structure:**
- Cards scroll vertically
- Categorized tips (not explicitly labeled but implied)
- Three tip types: Stoic Mindset, Wealth Building, Tactical Advice
- Icons vary per tip (Lightbulb, Anchor, Wallet, Zap)

**UI Pattern:**
- Card-style layout with colored accents
- Large tip text block
- Optional icon at top-left of each card
- Chevron Right on some cards indicates actionable tip

**User Interactions:**
- Passive consumption (read-only)
- Back navigation

---

### 5. Insight Reports Screen

**File:** `mobile/src/components/InsightReportsScreen.js`  
**Route:** `InsightReports`

**Purpose:**  
Professional financial reporting and analytics dashboard with export capabilities.

**Key Features:**

1. **Filter Dropdown**
   - Options: Yearly / Quarterly / Monthly
   - Chevron indicator

2. **Stats Cards (Horizontal Grid)**
   - **Net Margin:** Percentage display with trend icon
   - **Avg Daily Profit:** Cedi amount
   - **Total Income:** Aggregate income
   - **Active Days:** Count of working days

3. **Reports List**
   - Each item represents a downloadable/exportable report
   - File icon + report name + download icon (Download)
   - Reports appear based on selected filter

**Data Model Example:**
```javascript
stats = {
  netMargin: '38.2%',
  avgDailyProfit: 425,
  totalIncome: 15800,
  activeDays: 37
}
reports = [...] // array of report entries
```

**User Interactions:**
- Filter selection updates stats and list
- Download buttons (non-functional UI placeholder)
- Back navigation

---

### 6. Set Targets Screen

**File:** `mobile/src/components/SetTargetsScreen.js`  
**Route:** `SetTargets`

**Purpose:**  
Goal configuration center: define daily profit targets, income allocation percentages, and milestone-based savings objectives.

**Four Core Modules:**

#### A. Daily Profit Target
- Central large value display (₵400 default)
- `+` / `-` circular buttons (±50 increments)
- Horizontal slider with 7 preset dots (₵100 → ₵1000)
- Info box shows required gross revenue calculation: *"To take home ₵400, gross must be ~₵800"*

#### B. Income Allocation Pie Chart
- Four fixed categories:
  1. **Operating Costs** (50%, amber)
  2. **Business Growth** (20%, green)
  3. **Safety Net** (10%, teal)
  4. **Personal/Home** (20%, purple)
- Each row has `-` and `+` buttons (±5% increments)
- Total percentage badge (100%) in header
- Visual pie representation: horizontal segmented bar (colors match rows)
- Total must equal 100%

#### C. Auto-Allocate Toggle
- Switch component
- "Automatically move digital earnings to vaults"

#### D. Milestone Trackers
- List of named savings goals with:
  - Name (e.g., "License Renewal")
  - Deadline & days left (badge)
  - Progress bar (current / target)
  - Daily needed amount below bar: *"₵28/day needed to hit target"*
- **Expandable rows:** Tapping reveals contribution input
  - Large ₵ symbol + numeric input field
  - "Add +₵X" button (disabled if blank/zero)
  - Adds to `current` amount and collapses
- **Add Milestone Form:**
  - Name input
  - Target amount input (₵ prefix)
  - Deadline input (free text)
  - Cancel / Add Milestone buttons

**Bottom Action:**
- Green "Save Targets" button (persists to store)

**User Interactions:**
- Dynamic percentage allocation with real-time total tracking
- Milestone expansion/collapse
- Interactive forms with validation
- Back button returns to Home

---

### 7. Savings Vaults Screen

**File:** `mobile/src/components/SavingsVaultsScreen.js`  
**Route:** `SavingsVaults`

**Purpose:**  
Multi-goal savings management with named "vaults" for different financial objectives.

**Key Components:**

1. **Total Saved Card** (Hero)
   - Teal background card at top
   - Large total balance: ₵12,500
   - "Days of freedom" badge: 🔒 250 days
   - Goal progress percentage: "23% of total goals"

2. **Vault List**
   - Four predefined vaults:
     - Emergency Net (ShieldCheck) - ₵2,500/₵5,000
     - Vehicle Upgrade (Car) - ₵8,000/₵20,000
     - School Fees (Home) - ₵1,500/₵3,000
     - Business Growth (TrendingUp) - ₵500/₵10,000
   - Each card shows:
     - Icon + vault name + description
     - Right-aligned current amount badge
     - Progress bar (width-coded: red if <30% progress, else vault color)
     - Progress text below bar

3. **Expandable Transfer Form**
   - Tap vault → card highlights with teal border
   - Reveals transfer input:
     - ₵ prefix label
     - Numeric input field
     - "Add +₵X" green button (disabled if invalid)
   - Submits and updates vault amount in local state

4. **Insight Tip Card**
   - Bottom tip: "The Vault Barrier"
   - Text: "Named money is harder to spend. Each vault is a promise to your future self."
   - Light teal background with shield icon

**User Interactions:**
- Tap vault to select/unselect
- Dynamic amount addition
- Progress bars update in real-time
- Back navigation

---

### 8. Safety Net Screen

**File:** `mobile/src/components/SafetyNetScreen.js`  
**Route:** `SafetyNet`

**Purpose:**  
Emergency fund management with risk coverage analysis (What-If scenarios).

**Key Sections:**

1. **Shield Status Card** (Hero)
   - Status badge with dynamic color:
     - Green (≥80%): "Fully Protected"
     - Amber (50-79%): "Partially Covered"
     - Red (<50%): "Vulnerable"
   - Current balance (large: ₵2,400)
   - Subtext: "Covers ~48 days of operations"
   - Progress bar: white-on-teal fill
   - **Top Up button** toggles contribution form

2. **Emergency Top-Up Form** (Expandable)
   - Centered input with ₵ symbol
   - Add button with green background
   - Updates store's `safetyNet` value on submit

3. **Potential Gap Alert** (Conditional)
   - Shows if currentNet < targetNet
   - Red border card with exclamation icon
   - Displays gap amount

4. **What-If Analysis Section**
   - Risk item cards in vertical list:
     - **Coverage badge** (Checkmark if fully covered, AlertTriangle if not)
     - Risk name + cost (e.g., "Transmission Repair • ₵2,000")
     - Progress bar showing percentage of risk cost covered
     - Status text: "Covered" or "45% Covered"

   Risks:
   - Tire Replacement (₵450) - Covered
   - Major Engine Service (₵1,200) - Partial/Not covered
   - Health Emergency (₵800) - Covered
   - License Renewal (₵300) - Covered
   - Transmission Repair (₵2,000) - Not covered (highlighted red)

5. **Auto-Save Surplus Setting**
   - Row with TrendingUp icon
   - Label: "Auto-Save Surplus"
   - Hint: "Move ₵5 from every ₵200+ day"
   - Custom toggle switch (thumb slides right on active)

6. **Insight Card**
   - "The Runway Mindset" text
   - Links days-of-coverage to psychological security

**User Interactions:**
- Expand/collapse top-up form
- Add contributions (updates safetyNet in store)
- Toggle auto-save setting (UI only, not persisted yet)
- Back navigation

---

### 9. Sync Settings Screen

**File:** `mobile/src/components/SyncSettingsScreen.js`  
**Route:** `SyncSettings`

**Purpose:**  
Cloud backup management, synchronization controls, and data safety.

**Key Components:**

1. **Sync Action Area**
   - Large animated sync button (RefreshCw icon with rotation animation)
   - Status line below: "Last synced: 2 min ago"

2. **Status Cards**
   - **Local Cache Card:** Shows timestamp of local data
   - **Cloud Status Card:** Shows cloud storage state

3. **Pending Uploads Warning**
   - Appears if unsaved transactions exist
   - Warning icon + count of pending items

4. **Settings Toggles**
   - **Wi-Fi Only:** Upload only on Wi-Fi
   - **Auto-Sync:** Background sync on/off
   - Custom toggle switches

5. **Sync History**
   - List of past sync operations
   - Timestamp + status (Success/Failed)

6. **Data Safety Insight**
   - Informational card about data encryption

**User Interactions:**
- Manual sync trigger (starts animation)
- Toggle preferences
- Back navigation

---

### 10. App Settings Screen

**File:** `mobile/src/components/AppSettingsScreen.js`  
**Route:** `AppSettings`

**Purpose:**  
Application preferences, localization, notifications, and data management.

**Settings Categories:**

1. **Display Settings**
   - Dark Mode toggle
   - High Contrast mode toggle

2. **Localization**
   - Currency selector (GHS, USD, EUR)
   - Language selector
   - Timezone picker

3. **Notifications**
   - Shift Reminders toggle
   - Daily Summary toggle
   - Maintenance Alerts toggle

4. **Data Management**
   - Export Data (Download icon)
   - Cloud Backup (Cloud icon)
   - Clear Cache (Trash icon)

5. **About**
   - App version display
   - Build number
   - Privacy policy link

**UI Structure:**
- List-group layout with chevron arrows for dropdown/action navigation
- Icons left of each setting row
- Toggles positioned at far right

**User Interactions:**
- Toggle settings
- Navigate to sub-screens (placeholder)
- Confirm destructive actions (clear cache)
- Back navigation

---

### 11. Notifications Screen

**File:** `mobile/src/components/NotificationsScreen.js`  
**Route:** `Notifications`

**Purpose:**  
Centralized notification center; displays alerts, reminders, and system messages.

**Features:**

1. **Mark All as Read** (top-right if unread > 0)

2. **Empty State:** "No new notifications" if list empty

3. **Notification Items**
   - Type-based icon:
     - TrendingUp: Financial update
     - Car: Vehicle-related
     - Target: Goal progress
     - AlertCircle: Warning
     - CheckCircle: Success
     - Info: Informational
   - Title + timestamp
   - Preview message
   - Optional action button (e.g., "View Report")

4. **Sync Reminder Prompt**
   - Appears when offline/synced = false
   - "Connect to sync data" with action link

**User Interactions:**
- Tap notification to mark read
- Swipe-to-delete (Trash icon overlay)
- Dismiss individual or all
- Back navigation

---

## Widget Components (Reusable)

These components are used across multiple screens and live in `mobile/src/components/`:

| Widget | Primary Use | Key Props |
|--------|-------------|-----------|
| `Header` | App bar with title, icons | isSynced, onMenuPress |
| `SideDrawer` | Navigation drawer | visible, onClose, navigation |
| `HeroCard` | Dashboard welcome banner | name, isShiftActive, onPress |
| `LiquidityCards` | Balance overview | cashOnHand, digitalBalance |
| `ShiftMonitor` | Shift timing & efficiency | isActive |
| `ExpenseFocus` | Top spending category widget | topExpense, topExpenseAmount |
| `SafetyNet` *(widget)* | Mini emergency fund | savingsAmount, targetAmount |
| `WealthTracker` | Net worth display | — |
| `WealthOverview` | Asset/liability summary | — |
| `MaintenanceTracker` | Vehicle service countdown | — |
| `TransactionEntry` | Modal for transaction input | visible, onClose, onSave |

---

## State Management (Zustand Store)

**File:** `mobile/store/useFinanceStore.js`

All screens read/write from a single Zustand store:

```javascript
// Navigation & UI State
currentScreen: 'Home' | string
isDrawerOpen: boolean
isSynced: boolean

// User Profile
driverName: string

// Financial Data
cashOnHand: number
momoBalance: number
safetyNet: number
safetyNetTarget: number
dailyGoal: number
allocations: [{ id, label, percent, color }]
milestones: [{ id, name, target, current, deadline, daysLeft }]
topExpense: { name, amount }

// Business Operations
isShiftActive: boolean
shiftStartTime: timestamp | null

// Vehicle
maintenanceFund: number
maintenanceTarget: number
nextServiceKm: number

// Notifications
notifications: []
unreadCount: number
alerts: []

// Persistence Layer
transactions: []
setTargetsSaved({ dailyGoal, allocations, milestones })
addTransaction(transaction)
```

**Actions Example:**
```javascript
const startShift = useFinanceStore(state => state.startShift);
const addTransaction = useFinanceStore(state => state.addTransaction);
const setCurrentScreen = useFinanceStore(state => state.setCurrentScreen);
```

---

## Design & Theming

**Color Palette:**
- Primary: `#004D40` (Deep Teal)
- Accent: `#10B981` (Success Green)
- Warning: `#F59E0B` (Amber)
- Error: `#BA1A1A` (Red)
- Background: `#F5F7F8` (Light Gray)
- Card: `#FFFFFF` (White)

**Typography:**
- Header: fontSize 18-24, weights 700-800
- Body: fontSize 12-16, weights 400-600
- Numbers: fontSize 32-48, weight 800 for large values

**Component Style:**
- Cards: border-radius 20-24px, subtle shadow (2-8 depth)
- Buttons: rounded-pill (16-24px), heavy use of flexbox centering
- Inputs: light gray background (#F5F7F8), rounded 12px

---

## Technical Dependencies

**Core Libraries:**
- `react-native` / `expo`
- `react-native-gifted-charts` (LineChart in Annual Vision)
- `lucide-react-native` (icon set)
- `zustand` (state management)
- `react-native-safe-area-context`
- `react-native-gesture-handler`

**Data Persistence:**
- MMKV or SQLite (offline-first)
- Django + Supabase backend (cloud sync layer)

---

## Navigation Map

```
Home (Dashboard)
├─ SideDrawer → Business
│  ├─ Annual Vision
│  ├─ Vehicle Management
│  └─ Insight Reports
├─ SideDrawer → Financial
│  ├─ Financial Tips
│  ├─ Set Targets
│  ├─ Savings Vaults
│  └─ Safety Net
└─ SideDrawer → Settings
   ├─ Sync Settings
   ├─ App Settings
   └─ Notifications
```

**Back Navigation:** All sub-screens have a back chevron (top-left) that calls `setCurrentScreen('Home')`.

---

## Continuous Data Loop Architecture

Prosper is designed as a **reactive financial operating system** where screens are not isolated pages but interconnected nodes in a continuous feedback cycle. The Zustand store acts as the central nervous system, ensuring that any state change on one screen instantly propagates to every dependent screen.

This creates a **conversation between screens** — actions trigger recalculations, which update metrics across the app in real-time, making Prosper feel like a living, coaching system rather than a static dashboard.

---

### 1. The Revenue & Allocation Loop

**Participants:** `Home` ↔ `TransactionEntry` ↔ `Savings Vaults` ↔ `Safety Net`

**Trigger:** Driver logs an income of **₵500** on the **Home Screen** via `TransactionEntry`.

**The Calculation:**
`addTransaction(transaction)` in the Zustand store updates `cashOnHand` and `momoBalance`. Immediately after, the store checks the **Set Targets** allocation percentages (e.g., 10% to Safety Net, 20% to Business Growth, etc.) and automatically distributes the income across the corresponding vaults.

**The Talk:**
- **Home Screen** liquidity cards (`LiquidityCards`) update instantly to reflect new balances.
- **Savings Vaults** silently increments the "Emergency Net" and "Business Growth" vault balances by their allocated percentages.
- **Safety Net** hero card recalculates "Days of Freedom" (`Math.floor(balance / 50)`) because the balance has grown.

**User Experience:** If the driver navigates from Home to Vaults immediately after logging income, they see their progress bars have already moved forward without requiring a manual refresh.

**Code Flow:**
```javascript
// In useFinanceStore.js
addTransaction: (transaction) => {
  state.transactions.push(transaction);
  if (transaction.is_income) {
    state.cashOnHand += transaction.amount;
    // Auto-allocate based on percentages
    allocations.forEach(alloc => {
      const amount = transaction.amount * (alloc.percent / 100);
      vaults.find(v => v.label === alloc.label).amount += amount;
    });
  }
}
```

---

### 2. The Daily vs. Vision Loop

**Participants:** `Home` ↔ `Set Targets` ↔ `Annual Vision`

**Purpose:** Connects daily performance to long-term destiny projections.

**The Talk:**
- **Set Targets** defines the `dailyGoal` (e.g., ₵400). This goal flows to **Home** as a performance benchmark.
- **Home Screen** uses this to contextualize `WealthTracker`. If the driver has only made ₵100 by noon, the tracker might display a "Warning" amber state or a "Behind" indicator.
- **Annual Vision** takes the *average* of actual net profits from the transaction history (via `Home`) and compares them against the `dailyGoal` from `Set Targets`.

**The Insight:** If the driver consistently misses the target, the **Annual Vision** line chart (Wealth Growth Trend) begins to dip downward, visually warning that their "New Car" or "Asset Goal" completion date is sliding further into the future. The projected annual savings value decreases accordingly.

**Data Transformation:**
```
Monthly Average Net = Σ(monthly_data.net) / count
Target Monthly = dailyGoal × activeDays
Projected Annual = Monthly Average × 12 (or adjusted downward if below target)
```

---

### 3. The Vehicle & Maintenance Loop

**Participants:** `Home` ↔ `Vehicle Management` ↔ `Insight Reports`

**Purpose:** Treats the car as both a business expense and an appreciating asset.

**The Talk:**
- When an expense is logged as "Repair" or "Fuel" in `TransactionEntry` (Home), the category is tagged and the transaction is automatically piped into **Vehicle Management**'s "Recent Repairs" list and used to calculate aggregate maintenance costs.
- **Vehicle Management** calculates `fuelEfficiency` (₵/km) from logged fuel expenses and odometer readings (manual entry or inferred). This efficiency metric is fed into **Insight Reports** as a key performance indicator for "Net Margin" calculations.
- If **Vehicle Management** health score drops (due to missed service or accumulated unrepaired issues), a notification is triggered in the **Notifications Screen**.

**Example:** A spike in "Repair" expenses reduces `healthScore` from 85 to 72. This change:
- Updates the health badge color in Vehicle Management
- Lowers the "Vehicle Appreciation" estimated resale value in the asset card
- Triggers a "Maintenance Required" notification if below threshold

---

### 4. The Safety & Protection Loop

**Participants:** `Safety Net` ↔ `Set Targets` ↔ `Notifications`

**Purpose:** Manages the driver's psychological security buffer and goal-based risk coverage.

**The Talk:**
- **Safety Net** identifies "Gaps" by comparing current `safetyNet` balance against the estimated cost of uncovered risks (e.g., "You are ₵500 short for an engine overhaul").
- This "Gap" data is sent to **Set Targets** milestone tracker as a suggested milestone ("Close Engine Fund Gap") with the gap amount as the target.
- When the gap is bridged (via contributions logged from Home), the **Notifications Screen** sends a "Shield Secure" alert, reinforcing the safety achievement.

**Feedback Cycle:** Gap appears → milestone auto-created → user allocates income → gap closes → notification celebrates.

---

### 5. The Infrastructure & Sync Loop

**Participants:** `All Screens` ↔ `Sync Settings` ↔ `Cloud Icon` (Header)

**Purpose:** Ensures data integrity and cross-device persistence.

**The Talk:**
- Every time *any* screen updates a value in the Zustand store, the `isSynced` flag in the `Header` component flips to `false`, displaying a cloud icon with an exclamation mark.
- The **Sync Settings** screen tracks these "Pending Logs" (transactions not yet uploaded), showing a warning card with count.
- When the user taps "Sync Now" or when background auto-sync triggers, pending transactions are batched and sent to the backend. Upon success:
  - `isSynced = true` across all screens
  - Cloud icon in header turns to green checkmark
  - Pending uploads count resets to zero

**Conflict Resolution:** If two devices make conflicting changes, the local MMKV/SQLite cache version is preserved and a merge conflict dialog appears on the next app launch.

---

## Inter-Screen Dependency Table

| Trigger Action | Primary Screen | Secondary Affected Screen(s) | Metric Updated |
|----------------|----------------|------------------------------|----------------|
| **Log Income** | Home | Savings Vaults, Safety Net | All vault progress bars, Days of Freedom |
| **Log Repair** | Home | Vehicle Management, Insight Reports | Repair history, Health score, Fuel efficiency metric |
| **Update Goal** | Set Targets | Home, Annual Vision | Target line indicator, Future projection curve |
| **Top Up Safety Net** | Safety Net | Home | Cash/Digital balance decreases, allocation recalculated |
| **Clear Cache** | App Settings | All Screens | Store resets to initial state, all progress cleared |
| **Change Allocation %** | Set Targets | Savings Vaults | Pie chart updates, auto-distribution ratios change |
| **Add Milestone** | Set Targets | Home (indirect) | Milestone appears in future projection if funding allocated |
| **Miss Service** | Vehicle Management | Notifications | Maintenance alert triggered |
| **Bridge Safety Gap** | Safety Net | Notifications | "Shield Secure" celebration sent |

---

## Why This "Conversation" Is Essential

By linking every screen through a shared reactive store, Prosper solves the **"Fragmented Data"** problem endemic to most financial apps, where settings, goals, and transactions live in isolated silos.

In Prosper:
- A driver's **Targets** dictate their **Home Screen** color-coded performance indicators.
- Their **Vehicle** health directly impacts their **Annual Vision** asset timeline.
- Their **Savings Vault** balances update the moment an income is logged, creating immediate positive reinforcement.
- Their **Safety Net** coverage level triggers warnings or celebrations in **Notifications**.

This makes the app feel like a **living coach** that understands the "Total Picture" of the business, not just a collection of disconnected calculators. The user experiences continuous coherence: change one number, watch the entire system rebalance and respond.

---

## Implementation Notes

**State Update Pattern:**
```javascript
// All store updates are centralized
const useFinanceStore = create((set) => ({
  // State
  cashOnHand: 0,
  safetyNet: 0,
  vaults: [],
  // Actions
  addTransaction: (transaction) => {
    set((state) => {
      const newState = { ...state, isSynced: false };
      // Update balances
      if (transaction.is_income) {
        newState.cashOnHand += transaction.amount;
        // Auto-allocate to vaults
        newState.vaults = newState.vaults.map(v => ({
          ...v,
          amount: v.amount + (transaction.amount * (v.allocationPercent / 100))
        }));
        // Recalculate safety net days
        newState.daysOfFreedom = Math.floor(newState.safetyNet / 50);
      }
      return newState;
    });
  },
}));
```

**React Re-rendering:** All components using `useFinanceStore(selector)` subscribe to store changes. When any relevant state key updates, all subscribers re-render automatically, ensuring visual consistency.

---

## Summary

The **Continuous Data Loop** is what transforms Prosper from a static CRUD app into an **intelligent financial OS**. Each screen both **consumes** and **produces** data, creating a network of dependencies where:

- **Actions propagate forward** (e.g., logging income updates vaults)
- **Metrics flow laterally** (e.g., vehicle health affects reports)
- **Settings ripple outward** (e.g., daily goal colors multiple screens)
- **Achievements loop back** (e.g., closing a gap triggers a notification)

The result is an app that **responds as a unified whole**, not a collection of isolated pages.
