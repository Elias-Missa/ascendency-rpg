# Ascendency - React Native Migration Document

## Project Overview

**App Name:** Ascendency - Free Looksmaxing App  
**Current Stack:** React + Vite + Tailwind CSS + Supabase  
**Target Stack:** React Native + Expo + NativeWind + Supabase  
**Purpose:** Help users become more attractive through AI-powered facial analysis, personalized recommendations, gamified daily tasks, and progress tracking.

---

## 🎨 Design System

### Theme: Solo Leveling / Cyberpunk HUD Aesthetic

The app uses a dark futuristic theme with glowing cyan accents, inspired by the Solo Leveling anime.

### Color Palette (HSL Values)

```javascript
// Primary Colors
background: '#0a0a0a',         // HSL: 0 0% 4%
foreground: '#e8f1f5',         // HSL: 200 20% 95%
card: '#0f1419',               // HSL: 220 20% 6%
primary: '#00e5ff',            // HSL: 185 100% 50% - Electric Cyan
secondary: '#1a2733',          // HSL: 200 30% 12%
muted: '#181c22',              // HSL: 220 15% 10%
border: '#1f3040',             // HSL: 200 30% 15%

// Accent Colors
accent: '#00d4eb',             // HSL: 185 100% 45%
destructive: '#e53935',        // HSL: 0 75% 50%

// Custom Colors
xp: '#00e5ff',                 // XP Bar - Primary cyan
level: '#ffc107',              // Level Gold - HSL: 45 100% 60%
premium: '#9c27b0',            // Premium Purple - HSL: 270 80% 60%
health: '#4caf50',             // Health Bar - HSL: 120 70% 45%
```

### Typography

```javascript
// Font Families
display: 'Orbitron',           // Headers, titles, stats
mono: 'JetBrains Mono',        // Labels, data, XP
body: 'Inter',                 // Body text

// For React Native, use Google Fonts with expo-font:
// expo install expo-font @expo-google-fonts/orbitron @expo-google-fonts/jetbrains-mono @expo-google-fonts/inter
```

### Animations & Effects

- `pulse-glow`: Pulsing cyan glow on active elements
- `flicker`: Subtle flicker for HUD aesthetic  
- `float`: Gentle floating animation
- `fade-in`: Entry animation with translateY
- `scale-in`: Entry animation with scale
- Border glow effect on cards
- Scan line overlay effect

---

## 📱 Screens & User Flow

### 1. Auth Screen (`/auth`)

**Purpose:** Login/Register with email/password

**Features:**
- Toggle between Login and Register modes
- Email & password fields with validation (Zod)
- Username field (register only)
- Show/hide password toggle
- "Hunter" themed terminology
- Features preview at bottom (AI Analysis, Secure Data, Gamified XP)

**UI Components:**
- CyberBackground (animated grid pattern)
- HUDCard (card with corner accents)
- Custom Input with `cyber-glow` variant
- Button with `cyber-fill` variant

**State:**
- `isLogin: boolean`
- `email, password, username: string`
- `showPassword: boolean`
- `isLoading: boolean`
- `errors: object`

---

### 2. Onboarding Survey (`/onboarding`)

**Purpose:** Collect user profile data for personalized recommendations

**3 Steps:**

#### Step 1: Vital Stats
- Age (number input)
- Gender (Select: Male/Female/Other)
- Height (toggle cm/ft+in)
- Weight (toggle kg/lbs)
- Ethnicity (Select dropdown)
- Body Fat % (Slider 5-40%)

#### Step 2: Lifestyle
- Workouts per week (Slider 0-7)
- Water intake (Select: <1L, 1-2L, 2-3L, 3L+)
- Wears glasses (Switch)
- Uses mouth tape at night (Switch)

#### Step 3: Inventory
- Supplements checklist (multi-select)
- Biometrics consent checkbox (required)

**Data Types:**
```typescript
interface VitalStatsData {
  age: number;
  gender: string;
  heightUnit: 'cm' | 'ft';
  heightCm: number;
  heightFt: number;
  heightIn: number;
  weightUnit: 'kg' | 'lbs';
  weightKg: number;
  weightLbs: number;
  ethnicity: string;
  bodyFatPercent: number;
}

interface LifestyleData {
  workoutsPerWeek: number;
  waterIntake: string;
  wearsGlasses: boolean;
  usesMouthTape: boolean;
}

interface InventoryData {
  supplements: string[];
  consentedToBiometrics: boolean;
}
```

---

### 3. Home Dashboard (`/`)

**Purpose:** Main hub showing user stats and quick actions

**Sections:**
- **Header:** Avatar circle with level, username, XP badge
- **XP Progress Bar:** Level N → Level N+1
- **Stats Row (3 cols):** Level | Face Score | Tasks completed today
- **Primary CTAs:**
  - Face Scan CTA (if no face score yet)
  - Complete Survey CTA (if onboarding incomplete)
- **Quick Actions Grid (2x2):**
  - View Report
  - Daily Tasks
  - Guide
  - New Scan
- **System Status:** Green dot with "SYSTEM OPERATIONAL"

---

### 4. Face Scan (`/face-scan`)

**Purpose:** Multi-image face capture for AI analysis

**Features:**
- 3 image captures: Front, Smile, Side profile
- Upload progress indicator
- Analysis loading state with spinning animation
- Guidelines list

**Upload Flow:**
1. User captures/uploads 3 images
2. Images uploaded to Supabase Storage
3. Edge function `analyze-face` called with image URLs
4. AI (Gemini 2.5 Flash) analyzes and returns:
   - `face_potential_score: 1-100`
   - `recommendations: array[]`
5. Results saved to database
6. Redirect to Report

**Image Types:**
```typescript
type ImageType = 'front' | 'smile' | 'side';

interface CapturedImages {
  front: File | null;
  smile: File | null;
  side: File | null;
}
```

---

### 5. Report (`/report`)

**Purpose:** Display AI-generated recommendations sorted by ROI

**Features:**
- Loading animation while analyzing
- Quest cards with:
  - Priority number
  - Issue title
  - Category badge (color-coded)
  - Impact score (1-10 progress bar)
  - Effort score (1-10 progress bar)
  - "VIEW" button → Quest Detail
- Legal disclaimer at bottom

**Category Colors:**
```typescript
const categoryColors = {
  Jaw: 'purple',
  Teeth: 'cyan',
  Face: 'amber',
  Skin: 'emerald',
  Hair: 'rose',
  Eyes: 'blue',
  Lifestyle: 'orange',
};
```

---

### 6. Quest Detail (`/quest/:id`)

**Purpose:** Detailed view of a single recommendation

**Sections:**
- Back button + Category badge
- Quest title with Impact/Effort bars
- Timeline estimate
- Overview paragraph
- Action Plan (numbered steps)
- Pro Tips (checkmark list)
- Recommended Products
- "ADD TO DAILY TASKS" button

---

### 7. Tasks (`/tasks`)

**Purpose:** Daily task management with XP rewards

**Features:**
- Streak badge (current streak / best streak)
- XP progress bar with level indicator
- Tabs: Tasks | Calendar
- Today's progress (X/Y completed, XP available)
- Task cards with:
  - Checkbox
  - Task name
  - XP reward badge (+15 XP)
  - Completion animation
- Generate Quests button (if no tasks)

**Task Templates:**
```typescript
const taskTemplates = [
  { task_name: 'Apply moisturizer (AM routine)', xp_reward: 10 },
  { task_name: 'Practice mewing for 10 minutes', xp_reward: 15 },
  { task_name: 'Drink 8 glasses of water', xp_reward: 15 },
  { task_name: 'Apply sunscreen SPF 30+', xp_reward: 10 },
  { task_name: '10 min facial massage', xp_reward: 20 },
  { task_name: 'Cold shower (2 min minimum)', xp_reward: 25 },
  { task_name: 'Sleep 7+ hours tonight', xp_reward: 20 },
];
```

**XP System:**
```typescript
const XP_PER_LEVEL = 100;

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function getXpProgress(xp: number): number {
  return ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
}
```

---

### 8. Guide (`/guide`)

**Purpose:** Knowledge base with interactive character

**Features:**
- Full-screen character image
- 4 clickable zones (glowing orbs):
  - Face → `/guide/face`
  - Body → `/guide/body`
  - Hygiene → `/guide/hygiene`
  - Style → `/guide/style`

Each sub-guide has accordion sections with detailed looksmaxing information.

---

### 9. Progress Tracker (`/progress`)

**Purpose:** Track transformation over time

**Features:**
- Frequency selector (bi-weekly / monthly)
- Stats: Total photos, Days until next
- Photo capture component with ghost overlay
- Before/After slider comparison
- Baseline photo (first face scan)
- Progress timeline grid

---

### 10. Profile (`/profile`)

**Purpose:** User settings and account management

**Features:**
- Avatar with level badge
- Username + email display
- Premium badge (if premium)
- XP progress bar
- Stats grid: Level | Face Score
- Actions:
  - Progress Tracker
  - Update Survey Data
  - New Face Scan
  - Sign Out
- Legal links: Privacy Policy, Terms of Service
- App version

---

### 11. Schedule (`/schedule`)

**Purpose:** Book 1-on-1 consultations

**Consultation Types:**
```typescript
const consultationTypes = [
  { id: 'basic', name: 'Quick Consultation', duration: '15 min', price: 5 },
  { id: 'standard', name: 'Standard Session', duration: '30 min', price: 15 },
  { id: 'premium', name: 'Premium Session', duration: '60 min', price: 35 },
];
```

**Features:**
- Type selection cards
- Calendar date picker
- Time slot grid (hourly)
- Booking summary
- Confirmation toast

---

## 🗄️ Database Schema (Supabase)

### Tables

#### `profiles`
```sql
id: uuid (PK, references auth.users)
username: text
avatar_url: text
level: int (default: 1)
current_xp: int (default: 0)
current_streak: int (default: 0)
best_streak: int (default: 0)
last_task_date: date
face_potential_score: int
is_premium: boolean (default: false)
free_scans_remaining: int (default: 1)
scan_count: int (default: 0)
created_at: timestamp
updated_at: timestamp
```

#### `onboarding_surveys`
```sql
id: uuid (PK)
user_id: uuid (references profiles, unique)
age: int
height_cm: int
weight_kg: int
ethnicity: text
habits: jsonb  -- Contains: gender, bodyFatPercent, workoutsPerWeek, waterIntake, wearsGlasses, usesMouthTape, supplements
consented_to_biometrics: boolean
created_at: timestamp
updated_at: timestamp
```

#### `face_scans`
```sql
id: uuid (PK)
user_id: uuid (references profiles)
image_path: text
images: jsonb  -- { front: string, smile: string, side: string }
analysis_data: jsonb
is_latest: boolean (default: true)
created_at: timestamp
```

#### `recommendations`
```sql
id: uuid (PK)
user_id: uuid (references profiles)
category: text
issue: text
action_plan: text
product_recommendation: text
impact_score: int (1-10)
effort_score: int (1-10)
roi_score: int
is_completed: boolean (default: false)
created_at: timestamp
updated_at: timestamp
```

#### `daily_tasks`
```sql
id: uuid (PK)
user_id: uuid (references profiles)
task_name: text
xp_reward: int (default: 10)
is_completed: boolean (default: false)
date_assigned: date
created_at: timestamp
```

#### `progress_photos`
```sql
id: uuid (PK)
user_id: uuid
image_path: text
photo_date: date
notes: text
created_at: timestamp
```

#### `push_subscriptions`
```sql
id: uuid (PK)
user_id: uuid
endpoint: text
p256dh: text
auth: text
created_at: timestamp
```

---

## ⚡ Edge Functions

### `analyze-face`

**Purpose:** AI-powered facial analysis using Gemini 2.5 Flash

**Input:**
```typescript
{
  imageUrls: { front: string, smile: string, side: string },
  faceScanId: string,
  userId: string,
  surveyData: object
}
```

**Output:**
```typescript
{
  face_potential_score: number,  // 1-100
  recommendations: [
    {
      category: string,          // Skin, Jaw, Teeth, Eyes, Hair, Face, Lifestyle
      issue: string,
      action_plan: string,
      product_recommendation: string | null,
      impact_score: number,      // 1-10
      effort_score: number       // 1-10
    }
  ]
}
```

**Key Areas Analyzed:**
- Face fat & bloating
- Eyebrow shape & grooming
- Skin quality (acne, texture, tone)
- Hair style & quality
- Teeth appearance
- Jawline definition
- Eye area (bags, sclera color)
- Facial symmetry

---

## 🧩 Reusable Components

### UI Components

| Component | Purpose | React Native Equivalent |
|-----------|---------|------------------------|
| `HUDCard` | Card with corner accents | Custom View with border styling |
| `HUDFrame` | Frame with corner brackets | Custom View |
| `GlowingDivider` | Gradient divider line | LinearGradient |
| `CyberBackground` | Animated grid background | Custom animated View |
| `Button` | Multiple variants (cyber, cyber-fill, etc.) | Pressable with styles |
| `TaskCard` | Tappable task with XP | Pressable with animation |
| `StreakBadge` | Fire icon with streak count | View with icon |
| `BeforeAfterSlider` | Compare two images | Custom gesture handler |
| `ProgressPhotoCapture` | Camera capture with ghost overlay | expo-camera |
| `MultiImageCapture` | 3-photo grid capture | expo-image-picker |

### Layout Components

| Component | Purpose |
|-----------|---------|
| `AppLayout` | Wrapper with BottomNav |
| `BottomNav` | 6-tab navigation bar |

---

## 📍 Navigation Structure

```
Stack Navigator (Root)
├── Auth (no nav bar)
├── Onboarding (no nav bar)
└── Main (Tab Navigator)
    ├── Home
    ├── Report
    │   └── QuestDetail (stack)
    ├── Guide
    │   ├── GuideFace
    │   ├── GuideBody
    │   ├── GuideHygiene
    │   └── GuideStyle
    ├── Tasks
    ├── Schedule
    └── Profile
        └── Progress (stack)
```

**Bottom Nav Tabs:**
1. Home (Home icon)
2. Report (ScrollText icon)
3. Guide (BookOpen icon)
4. Tasks (CheckSquare icon)
5. Schedule (CalendarClock icon)
6. Profile (User icon)

---

## 🔐 Authentication Flow

1. Check for existing session on app launch
2. If no session → Show Auth screen
3. After login/register → Check if onboarding complete
4. If no onboarding → Redirect to Onboarding
5. If complete → Show Home dashboard

```typescript
// Auth context provides:
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email, password, username?) => Promise<{ error }>;
  signIn: (email, password) => Promise<{ error }>;
  signOut: () => Promise<void>;
}
```

---

## 🛠️ Migration Checklist

### Phase 1: Setup
- [ ] Create new Expo project with TypeScript
- [ ] Install NativeWind for Tailwind-like styling
- [ ] Configure Supabase client (same project ID)
- [ ] Set up expo-font with Orbitron, JetBrains Mono, Inter
- [ ] Configure react-navigation

### Phase 2: Core Infrastructure
- [ ] Copy `src/integrations/supabase/` folder
- [ ] Copy `src/hooks/useAuth.tsx` (adapt for RN)
- [ ] Copy `src/lib/xp-utils.ts`
- [ ] Create NativeWind theme matching CSS variables
- [ ] Set up auth state persistence (SecureStore)

### Phase 3: Components
- [ ] Build HUDCard, HUDFrame, GlowingDivider
- [ ] Build Button variants
- [ ] Build Input with cyber-glow style
- [ ] Build BottomNav as Tab Navigator
- [ ] Build TaskCard with animations

### Phase 4: Screens
- [ ] Auth screen
- [ ] Onboarding flow (3 steps)
- [ ] Home dashboard
- [ ] Face Scan (expo-camera/expo-image-picker)
- [ ] Report screen
- [ ] Quest Detail screen
- [ ] Tasks screen
- [ ] Guide with sub-pages
- [ ] Progress tracker
- [ ] Profile
- [ ] Schedule

### Phase 5: Edge Functions
- [ ] Verify `analyze-face` works from RN client
- [ ] Test image upload to Supabase Storage

### Phase 6: Polish
- [ ] Animations with react-native-reanimated
- [ ] Haptic feedback
- [ ] Push notifications (expo-notifications)
- [ ] App icon and splash screen
- [ ] iOS build with EAS

---

## 📦 Recommended Expo Packages

```bash
# Core
expo install expo-router expo-font expo-secure-store

# UI
npx expo install nativewind tailwindcss
expo install expo-linear-gradient
expo install expo-blur

# Camera & Images
expo install expo-camera expo-image-picker expo-file-system

# Animations
npx expo install react-native-reanimated react-native-gesture-handler

# Icons
npx expo install lucide-react-native react-native-svg

# Supabase
npm install @supabase/supabase-js

# Forms
npm install react-hook-form zod @hookform/resolvers

# Date
npm install date-fns

# Notifications
expo install expo-notifications expo-device
```

---

## 🔑 Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://lwraaowzeoyjvwmhclwi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cmFhb3d6ZW95anZ3bWhjbHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDE3NDgsImV4cCI6MjA4MTU3Nzc0OH0.d2-rz5o_leLqYjrlM-tBMDsA6Pnqq-QlVgiw5gmX_PI
```

---

## 📝 Prompt for Cursor

Copy this prompt when starting in Cursor:

```
I'm migrating the Ascendency looksmaxing app from React/Vite to React Native/Expo for iOS App Store publishing.

Please help me rebuild this app with the following specifications:

TECH STACK:
- Expo with TypeScript
- Expo Router for navigation
- NativeWind for styling (Tailwind-like)
- Supabase for backend (existing project - see env vars)
- react-native-reanimated for animations
- expo-camera and expo-image-picker for face scanning

DESIGN SYSTEM:
- Dark cyberpunk/Solo Leveling HUD aesthetic
- Primary color: Electric Cyan (#00e5ff)
- Background: Near black (#0a0a0a)
- Fonts: Orbitron (headers), JetBrains Mono (data), Inter (body)
- Glowing border effects on cards
- Corner accent decorations on cards

KEY FEATURES:
1. Email/password auth with "Hunter" themed UI
2. 3-step onboarding survey (vital stats, lifestyle, inventory)
3. Multi-image face scan (front, smile, side) with AI analysis
4. Personalized recommendations sorted by ROI (impact/effort)
5. Gamified daily tasks with XP rewards and streak tracking
6. Interactive guide with body zones
7. Progress photo tracking with before/after comparison
8. Consultation scheduling

The Supabase backend is already set up. I have the full migration document with:
- Database schema (profiles, onboarding_surveys, face_scans, recommendations, daily_tasks, progress_photos)
- Edge function for AI analysis
- All screen layouts and navigation structure
- XP/leveling system logic
- Color palette and typography

Start by setting up the Expo project structure and authentication flow.
```

---

## 📸 Screenshots Reference

Your screenshots should show:
1. Auth screen (login/register toggle)
2. Onboarding step 1 (vital stats)
3. Onboarding step 2 (lifestyle)
4. Onboarding step 3 (inventory/consent)
5. Home dashboard
6. Face scan screen
7. Report with quest cards
8. Quest detail page
9. Tasks screen with XP
10. Guide with interactive character
11. Progress tracker
12. Profile page
13. Schedule booking

---

This document contains everything needed to rebuild Ascendency in React Native. Good luck with your iOS launch! 🚀
