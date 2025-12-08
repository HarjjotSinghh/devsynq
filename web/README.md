# DevSynq Marketing Website

A modern, dark-themed marketing website for DevSynq built with Next.js 16, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** PostgreSQL with Drizzle ORM
- **Email:** React Email + Resend
- **Analytics:** PostHog
- **Forms:** react-hook-form + zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Resend API key (for emails)
- PostHog project (for analytics)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp env.example .env.local
   ```

3. Update `.env.local` with your values:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/devsynq
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run email:preview` | Preview email templates |

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── waitlist/      # Waitlist signup endpoint
│   │   ├── changelog/         # Changelog page
│   │   ├── download/          # Download page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── download/          # Download page components
│   │   ├── landing/           # Landing page sections
│   │   ├── providers/         # React providers
│   │   └── ui/                # shadcn/ui components
│   ├── emails/                # React Email templates
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       ├── db/                # Database schema & client
│       └── utils.ts           # Utility functions
├── drizzle/                   # Database migrations
├── env.example                # Environment variables template
├── drizzle.config.ts          # Drizzle configuration
└── package.json
```

## Pages

- **Homepage (`/`):** Main landing page with hero, features, waitlist form, FAQ
- **Download (`/download`):** OS-specific download links with auto-detection
- **Changelog (`/changelog`):** Version history and release notes

## API Endpoints

### POST /api/waitlist
Subscribe to the waitlist.

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome to DevSynq!",
  "spotsRemaining": 132,
  "position": 368
}
```

### GET /api/waitlist
Get waitlist statistics.

**Response:**
```json
{
  "totalSignups": 368,
  "spotsRemaining": 132,
  "spotsClaimed": 368
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build and run:
```bash
npm run build
npm run start
```

## License

MIT
