# Vertex3

Vertex3 is a premium Pan-India Hackathon Teammate Finding Platform designed to help builders, developers, and designers connect, collaborate, and win. Whether you're looking for a React expert in Bangalore or a UI designer from your own college, Vertex3 simplifies the process of building the perfect team.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk v6](https://clerk.com/)
- **Database / Backend**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Email**: [Resend](https://resend.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## ✨ Features

- **Smart Builder Discovery**: Search and filter teammates by skills, college, city, and achievement badges.
- **Hackathon Hub**: Stay updated with a curated list of hackathons across India, including prize pools and deadlines.
- **Real-time Chat**: Connect and communicate instantly with potential teammates via a robust DM system.
- **Team Formation**: Create or join teams for specific hackathons with clear role requirements.
- **Achievement Badges**: Earn badges like *Verified*, *Influencer*, and *Elite* based on your contributions and profile.
- **Pro Dashboard**: A personalized feed for recommended teammates and upcoming hackathon alerts.

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ installed
- A Clerk account
- A Supabase project
- A Resend API key

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aryantripathi52/vertex3.git
   cd vertex3
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory (see the [Environment Variables](#environment-variables-setup) section).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## 🔐 Environment Variables Setup

Create a `.env.local` file and add the following:

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend API Key
RESEND_API_KEY=re_...
```

## 🔗 Clerk + Supabase Integration

Vertex3 uses Clerk for authentication and Supabase for the database. To keep user data in sync, we use Clerk Webhooks.

### Webhook Configuration
1. Go to the **Clerk Dashboard** -> **Webhooks**.
2. Add a new endpoint pointing to `https://your-domain.com/api/webhooks`.
3. Select the `user.created` and `user.updated` events.
4. Copy the **Signing Secret** and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`.

The webhook handler in `app/api/webhooks/route.ts` will automatically create or update the user record in the Supabase `users` table whenever a user signs up or updates their profile on Clerk.

## 🛡️ Auth Flow

- **Public Routes**: accessible by everyone (`/`, `/login`, `/signup`, `/hackathons`, `/api/webhooks`).
- **Protected Routes**: All dashboard and profile management routes require authentication.
- **Redirection**: Unauthenticated users trying to access protected routes are automatically redirected to `/login`.

## 📂 Project Structure

```text
├── app/                  # Next.js App Router routes
│   ├── (public)/         # Landing, login, signup
│   ├── (dashboard)/      # Protected user dashboard & explore
│   ├── (admin)/          # Admin management tools
│   └── api/              # API routes (Webhooks, etc.)
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── cards/            # BuilderCard, HackathonCard, etc.
│   └── layout/           # Sidebar, Navbar, Footer
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities and Supabase client
├── public/               # Static assets
└── types/                # TypeScript interfaces/types
```

## 🚀 Deployment on Vercel

1. Push your code to GitHub.
2. Import your repository into [Vercel](https://vercel.com/new).
3. Add all the [Environment Variables](#environment-variables-setup) in the Vercel project settings.
4. Click **Deploy**.

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

Built with ❤️ by the Vertex3 Team.
