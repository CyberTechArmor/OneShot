# OneShot - Design Document

## CID Framework Phase 2: Design

---

## 1. Information Architecture

### 1.1 Application Structure
```
OneShot
├── Authentication
│   ├── Sign In
│   ├── Sign Up
│   └── Password Reset
├── Dashboard (Authenticated)
│   ├── Sidebar (Collapsible)
│   │   ├── Navigation Links
│   │   ├── Recent Projects
│   │   └── User Settings
│   └── Main Content
│       ├── Projects Grid
│       │   ├── Project Cards
│       │   └── New Project Card (+)
│       └── Empty State
├── Project View
│   ├── Overview Tab
│   ├── Discovery Tab
│   │   ├── Conversations List
│   │   └── Recordings List
│   ├── Documents Tab
│   └── Settings Tab
├── Discovery Session
│   ├── Chat Interface
│   │   ├── Message Thread
│   │   ├── Voice Toggle (ElevenLabs)
│   │   └── Input Area
│   └── Meeting Mode (LiveKit)
│       ├── Video Grid
│       ├── Screen Share
│       ├── Chat Sidebar
│       └── Recording Controls
└── Settings
    ├── Profile
    ├── Preferences
    └── Integrations
```

---

## 2. User Flows

### 2.1 New User Onboarding Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Landing   │───▶│   Sign Up   │───▶│   Verify    │───▶│  Dashboard  │
│    Page     │    │    Form     │    │   Email     │    │ (Empty)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
                                                         ┌─────────────┐
                                                         │  Click "+"  │
                                                         │    Card     │
                                                         └─────────────┘
                                                                │
                                                                ▼
                                                         ┌─────────────┐
                                                         │  Discovery  │
                                                         │   Session   │
                                                         └─────────────┘
```

### 2.2 Project Creation Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │───▶│  Click "+"  │───▶│   Choose    │───▶│  Discovery  │
│             │    │    Card     │    │    Mode     │    │   Session   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                            │
                                            ├── Solo (Chat Only)
                                            ├── Solo + Voice (ElevenLabs)
                                            └── Collaborative (LiveKit Meeting)
```

### 2.3 Discovery Session Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                      Discovery Session                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  Start   │───▶│   AI     │───▶│  Refine  │───▶│ Generate │  │
│  │ Session  │    │ Prompts  │    │ Details  │    │   Doc    │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                                               │         │
│       │         Optional Paths                        │         │
│       │                                               ▼         │
│       │    ┌──────────────────────────────────────────────┐    │
│       ├───▶│  Enable Voice (ElevenLabs)                   │    │
│       │    └──────────────────────────────────────────────┘    │
│       │                                                         │
│       │    ┌──────────────────────────────────────────────┐    │
│       └───▶│  Start Meeting (LiveKit) → Share Link        │    │
│            └──────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Collaborative Session Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Owner     │───▶│   Create    │───▶│   Copy &    │
│  Initiates  │    │   Meeting   │    │ Share Link  │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
                         ┌──────────────────┼──────────────────┐
                         ▼                  ▼                  ▼
                   ┌──────────┐       ┌──────────┐       ┌──────────┐
                   │ Guest 1  │       │ Guest 2  │       │ Guest N  │
                   │  Joins   │       │  Joins   │       │  Joins   │
                   └──────────┘       └──────────┘       └──────────┘
                         │                  │                  │
                         └──────────────────┼──────────────────┘
                                            ▼
                                     ┌─────────────┐
                                     │ Collaborate │
                                     │  Together   │
                                     └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │  Recording  │
                                     │   Saved     │
                                     └─────────────┘
```

---

## 3. Wireframes

### 3.1 Dashboard Layout
```
┌────────────────────────────────────────────────────────────────────────┐
│  ☰  OneShot                                        [User] [Settings]   │
├────────┬───────────────────────────────────────────────────────────────┤
│        │                                                               │
│  ◀     │   Your Projects                              [+ New Project]  │
│        │                                                               │
│ ────── │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│        │   │             │  │             │  │             │          │
│ 🏠 Home│   │  Project A  │  │  Project B  │  │     ＋      │          │
│        │   │             │  │             │  │             │          │
│ 📁 All │   │  Updated    │  │  Updated    │  │   Create    │          │
│        │   │  2 days ago │  │  1 week ago │  │   New       │          │
│ ⭐ Fav │   └─────────────┘  └─────────────┘  └─────────────┘          │
│        │                                                               │
│ 🕐 Rec │   ┌─────────────┐                                            │
│        │   │             │                                            │
│ ────── │   │  Project C  │                                            │
│        │   │             │                                            │
│ ⚙ Set │   │  Updated    │                                            │
│        │   │  3 days ago │                                            │
│        │   └─────────────┘                                            │
│        │                                                               │
└────────┴───────────────────────────────────────────────────────────────┘
```

### 3.2 Empty State Dashboard
```
┌────────────────────────────────────────────────────────────────────────┐
│  ☰  OneShot                                        [User] [Settings]   │
├────────┬───────────────────────────────────────────────────────────────┤
│        │                                                               │
│  ◀     │                                                               │
│        │                                                               │
│ ────── │              ┌───────────────────────────────┐               │
│        │              │                               │               │
│ 🏠 Home│              │            ＋                 │               │
│        │              │                               │               │
│ 📁 All │              │     Start Your First          │               │
│        │              │        Project                │               │
│ ⭐ Fav │              │                               │               │
│        │              │  Click here to begin your     │               │
│ 🕐 Rec │              │  first discovery session      │               │
│        │              │                               │               │
│ ────── │              └───────────────────────────────┘               │
│        │                                                               │
│ ⚙ Set │                                                               │
│        │                                                               │
└────────┴───────────────────────────────────────────────────────────────┘
```

### 3.3 Chat-Style Discovery Interface
```
┌────────────────────────────────────────────────────────────────────────┐
│  ←  New Project Discovery                    [🎤 Voice] [👥 Invite]   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  🤖 OneShot AI                                                  │   │
│  │                                                                 │   │
│  │  Welcome! I'm here to help you define your project. Let's      │   │
│  │  start with the basics. What problem are you trying to solve?  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│                     ┌─────────────────────────────────────────────┐   │
│                     │  👤 You                                      │   │
│                     │                                              │   │
│                     │  I want to build an app that helps teams    │   │
│                     │  collaborate on document creation...         │   │
│                     └─────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  🤖 OneShot AI                                                  │   │
│  │                                                                 │   │
│  │  Great! Document collaboration is a valuable space. Can you    │   │
│  │  tell me more about your target users? Who will benefit most?  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐ [🎤] 📤 │
│  │  Type your message or click voice to speak...             │        │
│  └──────────────────────────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.4 LiveKit Meeting Mode
```
┌────────────────────────────────────────────────────────────────────────┐
│  ←  Project Discovery Meeting          [🔴 REC] [🔗 Copy Link] [End]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│  │                              │  │                              │   │
│  │                              │  │                              │   │
│  │         Participant 1       │  │         Participant 2       │   │
│  │           (You)             │  │          (Guest)            │   │
│  │                              │  │                              │   │
│  │                              │  │                              │   │
│  └──────────────────────────────┘  └──────────────────────────────┘   │
│                                                                        │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│  │                              │  │                              │   │
│  │                              │  │   ┌──────────────────────┐   │   │
│  │         Participant 3       │  │   │ 🤖 AI is listening... │   │   │
│  │          (Guest)            │  │   │                       │   │   │
│  │                              │  │   │ Current topic:        │   │   │
│  │                              │  │   │ User authentication   │   │   │
│  └──────────────────────────────┘  │   └──────────────────────┘   │   │
│                                     └──────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│         [🎤 Mute]  [📹 Video]  [🖥 Share]  [💬 Chat]  [📋 Notes]      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Hierarchy

### 4.1 Core Components
```
App
├── AuthProvider
│   ├── LoginPage
│   ├── SignupPage
│   └── ResetPasswordPage
├── AppLayout
│   ├── Sidebar
│   │   ├── SidebarToggle
│   │   ├── NavigationMenu
│   │   ├── RecentProjects
│   │   └── UserMenu
│   └── MainContent
│       └── <RouterOutlet>
├── DashboardPage
│   ├── PageHeader
│   ├── ProjectGrid
│   │   ├── ProjectCard (multiple)
│   │   └── NewProjectCard
│   └── EmptyState
├── ProjectPage
│   ├── ProjectHeader
│   ├── TabNavigation
│   └── TabContent
│       ├── OverviewTab
│       ├── DiscoveryTab
│       ├── DocumentsTab
│       └── SettingsTab
└── DiscoverySession
    ├── SessionHeader
    ├── ChatInterface
    │   ├── MessageList
    │   │   └── Message (multiple)
    │   ├── VoiceToggle
    │   └── MessageInput
    └── MeetingMode
        ├── VideoGrid
        │   └── ParticipantTile (multiple)
        ├── MeetingControls
        ├── ChatSidebar
        └── AINotesSidebar
```

### 4.2 Shared Components
```
Shared
├── UI
│   ├── Button
│   ├── Input
│   ├── Card
│   ├── Modal
│   ├── Dropdown
│   ├── Avatar
│   ├── Badge
│   ├── Tooltip
│   └── LoadingSpinner
├── Layout
│   ├── Container
│   ├── Grid
│   ├── Stack
│   └── Divider
└── Feedback
    ├── Toast
    ├── Alert
    └── EmptyState
```

---

## 5. Design System

### 5.1 Color Palette
```
Primary Colors:
├── Primary:      #6366F1 (Indigo 500)
├── Primary Dark: #4F46E5 (Indigo 600)
└── Primary Light:#818CF8 (Indigo 400)

Neutral Colors:
├── Background:   #FFFFFF
├── Surface:      #F9FAFB (Gray 50)
├── Border:       #E5E7EB (Gray 200)
├── Text Primary: #111827 (Gray 900)
├── Text Secondary:#6B7280 (Gray 500)
└── Text Muted:   #9CA3AF (Gray 400)

Semantic Colors:
├── Success:      #10B981 (Emerald 500)
├── Warning:      #F59E0B (Amber 500)
├── Error:        #EF4444 (Red 500)
└── Info:         #3B82F6 (Blue 500)

Dark Mode (Future):
├── Background:   #111827
├── Surface:      #1F2937
└── Text Primary: #F9FAFB
```

### 5.2 Typography
```
Font Family: Inter (Sans-serif)

Scale:
├── Display:  48px / 1.1  / -0.02em / Bold
├── H1:       36px / 1.2  / -0.02em / Bold
├── H2:       30px / 1.25 / -0.01em / Semibold
├── H3:       24px / 1.3  / -0.01em / Semibold
├── H4:       20px / 1.4  / 0       / Medium
├── Body:     16px / 1.5  / 0       / Regular
├── Small:    14px / 1.5  / 0       / Regular
└── Caption:  12px / 1.5  / 0       / Regular
```

### 5.3 Spacing System
```
Base: 4px

Scale:
├── xs:   4px   (0.25rem)
├── sm:   8px   (0.5rem)
├── md:   16px  (1rem)
├── lg:   24px  (1.5rem)
├── xl:   32px  (2rem)
├── 2xl:  48px  (3rem)
└── 3xl:  64px  (4rem)
```

### 5.4 Border Radius
```
├── None:   0px
├── Small:  4px
├── Medium: 8px
├── Large:  12px
├── XL:     16px
└── Full:   9999px (pills/circles)
```

### 5.5 Shadows
```
├── sm:  0 1px 2px rgba(0,0,0,0.05)
├── md:  0 4px 6px rgba(0,0,0,0.07)
├── lg:  0 10px 15px rgba(0,0,0,0.1)
└── xl:  0 20px 25px rgba(0,0,0,0.15)
```

---

## 6. Responsive Breakpoints

```
├── Mobile:  0 - 639px    (sm)
├── Tablet:  640 - 1023px (md)
├── Desktop: 1024 - 1279px (lg)
├── Wide:    1280px+      (xl)
```

### Responsive Behavior
- **Sidebar**: Collapsed by default on mobile, overlay on tablet, persistent on desktop
- **Project Grid**: 1 column mobile, 2 columns tablet, 3-4 columns desktop
- **Meeting Grid**: Stack on mobile, 2x2 on tablet, adaptive on desktop
- **Chat Interface**: Full width on all devices

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 AA Compliance
- Color contrast ratio minimum 4.5:1 for normal text
- Color contrast ratio minimum 3:1 for large text
- Focus indicators visible on all interactive elements
- Skip navigation links for keyboard users
- Proper heading hierarchy (h1 → h6)

### 7.2 Keyboard Navigation
- Tab order follows visual layout
- Escape closes modals and dropdowns
- Enter/Space activates buttons
- Arrow keys navigate menus

### 7.3 Screen Reader Support
- ARIA labels on all icons and images
- Live regions for dynamic content updates
- Form labels properly associated
- Status messages announced

---

*Document Version: 1.0*
*Created: 2026-01-06*
*Status: Draft - Pending Review*
