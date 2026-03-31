# Vertex3 — Product Requirements Document
> Pan-India Hackathon Teammate Finding Platform
> Stack: Next.js 14 + Supabase + Tailwind CSS + shadcn/ui

---

## 1. PROJECT OVERVIEW

**Platform Name:** Vertex3  
**Tagline:** "Find your team. Build your future."  
**Target Users:** Indian college students, developers, hackathon participants  
**Core Purpose:** Help builders find teammates for hackathons across India  

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database + Auth + Realtime:** Supabase
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel
- **Email:** Resend
- **Font:** Inter (Google Fonts)

### Brand Colors
- Background: `#0a0a0f`
- Surface: `#13131a`
- Primary: `#6c47ff` (electric violet)
- Secondary: `#00d4aa` (teal)
- Text Primary: `#f0f0ff`
- Text Muted: `#6b7280`

---

## 2. SUPABASE SCHEMA (Already Created)

The following tables exist in Supabase (do NOT recreate, just use them):

- `users` — id, phone, email, full_name, username, avatar_url, college, city, state, github_url, bio, skills[], roles[], subscription_tier, referral_code, referred_by
- `profiles_extended` — user_id, github_score, leetcode_username, leetcode_rating, codeforces_username, codeforces_rating, past_hackathons[], past_wins[], referral_count
- `badges` — user_id, badge_type (verified/influencer/spotlight/elite), earned_at
- `subscriptions` — user_id, plan (free/pro/elite), status, start_date, end_date, payment_id
- `hackathons` — id, title, organizer, location, mode, description, start_date, end_date, reg_deadline, prize_pool, tags[], website_url, is_featured, is_verified, created_by
- `hackathon_saves` — user_id, hackathon_id
- `teams` — id, hackathon_id, created_by, name, idea, is_open, max_members, required_skills[]
- `team_members` — team_id, user_id, role, status (pending/accepted/rejected)
- `connections` — requester_id, receiver_id, status (pending/accepted/rejected/blocked)
- `conversations` + `conversation_members` + `messages` — full DM system
- `notifications` — user_id, type, title, body, reference_id, is_read

---

## 3. FOLDER STRUCTURE TO CREATE

```
vertex3/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Landing page
│   │   ├── hackathons/page.tsx       # Public hackathon listings
│   │   ├── login/page.tsx            # Login page
│   │   └── signup/page.tsx           # Signup page
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── dashboard/page.tsx        # Home feed
│   │   ├── explore/page.tsx          # Builder directory
│   │   ├── profile/
│   │   │   ├── page.tsx              # My profile (edit)
│   │   │   └── [username]/page.tsx   # Public profile view
│   │   ├── messages/
│   │   │   ├── page.tsx              # Conversations list
│   │   │   └── [id]/page.tsx         # Individual chat
│   │   ├── hackathons/
│   │   │   ├── page.tsx              # Hackathon browser (authenticated)
│   │   │   └── saved/page.tsx        # Saved hackathons
│   │   ├── teams/
│   │   │   ├── page.tsx              # My teams
│   │   │   └── [id]/page.tsx         # Team detail
│   │   ├── notifications/page.tsx    # All notifications
│   │   ├── referral/page.tsx         # Referral page
│   │   └── upgrade/page.tsx          # Subscription/upgrade page
│   └── (admin)/
│       ├── layout.tsx                # Admin layout
│       ├── admin/page.tsx            # Admin dashboard
│       ├── admin/hackathons/page.tsx # Manage hackathons
│       ├── admin/badges/page.tsx     # Manage badges
│       └── admin/users/page.tsx      # Manage users
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── cards/
│   │   ├── BuilderCard.tsx           # User card for explore page
│   │   ├── HackathonCard.tsx         # Hackathon listing card
│   │   └── TeamCard.tsx              # Team card
│   ├── badges/
│   │   └── BadgeIcon.tsx             # Renders badge with glow
│   ├── chat/
│   │   ├── ConversationList.tsx
│   │   ├── ChatWindow.tsx
│   │   └── MessageBubble.tsx
│   └── profile/
│       ├── ProfileHeader.tsx
│       ├── SkillsSection.tsx
│       └── StatsRow.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser supabase client
│   │   ├── server.ts                 # Server supabase client
│   │   └── middleware.ts             # Auth middleware
│   ├── types/
│   │   └── database.types.ts         # Generated Supabase types
│   └── utils.ts                      # cn() and helpers
├── hooks/
│   ├── useUser.ts                    # Current user hook
│   ├── useMessages.ts                # Realtime messages hook
│   └── useNotifications.ts           # Realtime notifications hook
├── middleware.ts                     # Route protection
└── .env.local                        # Supabase keys
```

---

## 4. PAGES — DETAILED REQUIREMENTS

---

### 4.1 Landing Page `/`

**Purpose:** Convert visitors to signups.

**Sections:**
1. **Navbar**
   - Logo: "Vertex3" with a geometric triangle icon (3 vertices)
   - Links: Features, Hackathons, Pricing
   - CTA buttons: "Log In" (ghost) + "Get Started" (solid purple)
   - Sticky, blur backdrop on scroll

2. **Hero Section**
   - Headline: "Find Your Team. Win Hackathons."
   - Subtext: "India's largest builder network — connect with developers, designers, and innovators across 500+ colleges."
   - Two CTAs: "Find Teammates →" (primary) + "Browse Hackathons" (ghost)
   - Background: subtle grid pattern or particle effect

3. **Live Stats Bar**
   - "2,400+ Builders · 18 States · 130+ Hackathons · ₹50L+ Prize Pool Won"
   - Animated counters

4. **Features Section (3 columns)**
   - 🔍 Smart Discovery — filter by skills, college, city
   - 💬 Real-time Chat — DM any builder instantly
   - 🏆 Hackathon Hub — all India hackathons in one place

5. **Badge Showcase**
   - Show all 4 badges with descriptions
   - ✅ Verified, 🔥 Influencer, ⭐ Spotlight (Pro), 👑 Elite

6. **Testimonials / Social Proof**
   - 3 cards from "winning teams"

7. **Pricing Section**
   - Free / Pro (₹99/mo or ₹799/yr) / Elite (₹199/mo)
   - Feature comparison table

8. **Footer**
   - Logo, tagline, links, social icons

---

### 4.2 Signup Page `/signup`

**Fields:**
- Full Name
- Username (unique, auto-check availability)
- Phone Number (primary — Indian +91)
- Email (optional)
- College
- City + State
- Referral Code (optional)

**Flow:**
- Phone OTP via Supabase Auth (SMS)
- On success → redirect to profile setup step 2 (skills + roles)
- Skills multiselect: React, Python, ML, UI/UX, Blockchain, etc.
- Roles multiselect: Frontend Dev, Backend Dev, ML Engineer, Designer, etc.

---

### 4.3 Login Page `/login`

- Phone number input → OTP
- OR Email + magic link
- "Don't have an account? Sign up"

---

### 4.4 Dashboard `/dashboard`

**Layout:** Left sidebar + main content + right panel

**Left Sidebar:**
- Avatar + name + badge
- Nav links: Dashboard, Explore, Messages, Hackathons, Teams, Notifications, Profile, Upgrade

**Main Feed:**
- "Recommended Builders" — 3 cards based on matching skills
- "Open Teams Looking for Members" — teams where is_open = true
- "Hackathons Closing Soon" — reg_deadline within 7 days

**Right Panel:**
- Your badges earned
- Referral progress (X/10 for Influencer badge)
- Upcoming deadline alerts

---

### 4.5 Explore Page `/explore`

**Filter Sidebar (left):**
- Search by name/username
- Skills (multiselect chips)
- Role (multiselect)
- College (text input)
- City / State (dropdown)
- Badge type (checkboxes)
- Subscription tier

**Builder Grid (right):**
- BuilderCard component:
  - Avatar, Name, Username
  - College + City
  - Top 3 skill chips
  - Badge icon (if any) with glow
  - "Connect" button (sends connection request)
  - "Message" button (opens DM)

**Pagination:** Load more / infinite scroll

---

### 4.6 Public Profile `/profile/[username]`

**Sections:**
- Cover image + Avatar with badge overlay
- Name, Username, College, City, GitHub link button
- Bio
- Skills chips (all skills)
- Stats Row: Connections | Hackathons | Wins | Referrals
- Badges earned (with earned date)
- Past Hackathons list
- Past Wins list
- Action buttons: "Connect" / "Message" / "Share Profile"

---

### 4.7 My Profile `/profile`

Same as public profile but with edit mode:
- Edit bio, skills, roles, college, city, GitHub URL
- Upload avatar
- Connect GitHub (for Verified badge)
- Connect LeetCode / Codeforces usernames

---

### 4.8 Messages `/messages` and `/messages/[id]`

**Conversations List:**
- Search conversations
- Each item: avatar, name, badge, last message preview, timestamp, unread dot

**Chat Window:**
- Header: avatar, name, badge, online indicator
- Message bubbles (sent right, received left)
- Timestamps
- Message types:
  - Text (all users)
  - Image upload (Pro + Elite only — show upgrade prompt for free users)
  - Voice note (Elite only — show upgrade prompt)
- Input bar: emoji picker, attach (Pro+), voice (Elite+), send button
- Realtime via Supabase Realtime

---

### 4.9 Hackathons `/hackathons`

**Filters:**
- Mode: Online / Offline / Hybrid (toggle chips)
- Tags: AI, Web3, Social Impact, Cloud, Open Source (multiselect)
- Prize Pool: Any / ₹10k+ / ₹50k+ / ₹1L+
- Status: Upcoming / Open / Closed

**Hackathon Card:**
- Title, Organizer
- Mode badge (Online/Offline/Hybrid pill)
- Start - End date
- Prize pool
- Tags chips
- "Save" bookmark icon (toggles hackathon_saves)
- "View Details" button → website_url
- Featured cards: purple glow border + "Featured" tag
- Verified cards: teal checkmark

---

### 4.10 Teams `/teams`

**My Teams list:**
- Teams I created or joined
- Status: pending / accepted

**Create Team button:**
- Name, Idea/description, Hackathon (optional), Max members, Required skills, is_open toggle

**Team Detail `/teams/[id]`:**
- Team name, idea, hackathon link
- Members list with roles
- Open slots remaining
- "Apply to Join" button (for non-members)
- "Invite" button (for team creator)

---

### 4.11 Notifications `/notifications`

- List of all notifications grouped by today / earlier
- Types: connection_request, connection_accepted, message, team_invite, hackathon_deadline, badge_earned, subscription
- Mark all read button
- Click → navigate to relevant page

---

### 4.12 Referral Page `/referral`

- Your unique referral link (copy button)
- Progress bar: X / 10 referrals for Influencer badge
- List of users who signed up via your link
- Share buttons: WhatsApp, LinkedIn, Twitter/X

---

### 4.13 Upgrade Page `/upgrade`

**Three tier cards:**

| Feature | Free | Pro ₹99/mo | Elite ₹199/mo |
|---|---|---|---|
| DMs | Unlimited | Unlimited | Unlimited |
| Read Receipts | ❌ | ✅ | ✅ |
| Image in DMs | ❌ | ✅ | ✅ |
| Voice Notes | ❌ | ❌ | ✅ |
| Message Search | ❌ | ✅ | ✅ |
| Spotlight Badge | ❌ | ✅ | ❌ |
| Elite Badge | ❌ | ❌ | ✅ |
| Profile Boost | ❌ | ✅ | ✅ |
| Priority in Explore | ❌ | ✅ | ✅ |

- Yearly toggle: Pro ₹799/yr (save ₹389)
- Razorpay payment integration
- On success → update subscriptions table + add badge

---

### 4.14 Admin Panel `/admin`

**Access:** Only users with a hardcoded admin email list or a role column.

**Admin Dashboard:**
- Total users, active today, new this week
- Total hackathons, featured count
- Revenue this month (from subscriptions)

**Hackathon Management `/admin/hackathons`:**
- Table of all hackathons
- Toggle is_featured, is_verified
- Delete hackathon

**Badge Management `/admin/badges`:**
- Search user → manually award any badge

**User Management `/admin/users`:**
- Search users
- View subscription status
- Ban / unban user

---

## 5. COMPONENTS TO BUILD

### BadgeIcon.tsx
```tsx
// Props: badge_type: 'verified' | 'influencer' | 'spotlight' | 'elite'
// Renders colored pill with icon and glow shadow
// verified → teal, influencer → gold, spotlight → silver, elite → purple
```

### BuilderCard.tsx
```tsx
// Props: user object
// Shows: avatar, name, college, city, top 3 skills, badge, connect/message buttons
// Glassmorphism card with hover lift
```

### HackathonCard.tsx
```tsx
// Props: hackathon object
// Shows: title, organizer, mode pill, dates, prize, tags, save button
// Featured variant: purple glow border
```

---

## 6. SUPABASE CLIENT SETUP

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )
}
```

---

## 7. MIDDLEWARE (Route Protection)

```ts
// middleware.ts
// Protect all /dashboard/* and /admin/* routes
// Redirect to /login if no session
// Redirect admin routes if not admin email
```

---

## 8. ENV VARIABLES NEEDED

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RESEND_API_KEY=your_resend_key
```

---

## 9. BUILD ORDER (for Ralph Loop iterations)

Ralph Loop should follow this exact order:

1. **Iteration 1:** Project setup — `npx create-next-app`, install dependencies (supabase, shadcn, tailwind, lucide-react, razorpay)
2. **Iteration 2:** Supabase client setup + types + middleware
3. **Iteration 3:** Landing page (public)
4. **Iteration 4:** Login + Signup pages with Supabase Auth
5. **Iteration 5:** Dashboard layout (sidebar + navbar)
6. **Iteration 6:** Dashboard home feed page
7. **Iteration 7:** Explore page with filters + BuilderCard
8. **Iteration 8:** Public profile + My profile pages
9. **Iteration 9:** Messages — conversation list + chat window + Supabase Realtime
10. **Iteration 10:** Hackathons page with filters + HackathonCard
11. **Iteration 11:** Teams page + create team + team detail
12. **Iteration 12:** Notifications page + realtime
13. **Iteration 13:** Referral page
14. **Iteration 14:** Upgrade page + Razorpay integration
15. **Iteration 15:** Admin panel (dashboard + hackathons + badges + users)

---

## 10. DEPENDENCIES TO INSTALL

```bash
npx create-next-app@latest vertex3 --typescript --tailwind --app --src-dir=false
cd vertex3
npx shadcn@latest init
npx shadcn@latest add button card input label badge avatar sheet dialog tabs
npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react
npm install razorpay
npm install resend
npm install date-fns
npm install zustand
```

---

## 11. DESIGN RULES (enforce in all components)

- Dark background `#0a0a0f` everywhere — no white backgrounds
- Cards use `#13131a` with `border border-white/10`
- Primary buttons: `bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-lg`
- Ghost buttons: `border border-white/20 hover:border-white/40`
- All text on dark: primary `#f0f0ff`, muted `#6b7280`
- Glassmorphism cards: `bg-white/5 backdrop-blur-sm border border-white/10`
- Hover effects: `hover:-translate-y-1 transition-all duration-200`
- Badge glows:
  - Verified: `shadow-[0_0_12px_#00d4aa]`
  - Influencer: `shadow-[0_0_12px_#f59e0b]`
  - Spotlight: `shadow-[0_0_12px_#94a3b8]`
  - Elite: `shadow-[0_0_12px_#a855f7]`
- No light mode — dark only for now
