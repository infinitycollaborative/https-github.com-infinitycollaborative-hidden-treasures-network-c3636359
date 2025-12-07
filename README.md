# Hidden Treasures Network

A global platform connecting aviation and STEM education organizations, mentors, students, and sponsors under a unified mission to impact **one million lives by 2030**.

## 🎯 Mission

Connect aviation and STEM education organizations worldwide to share resources, amplify impact, and empower underserved youth through aviation, STEM, and entrepreneurship education.

## 🏢 About

**Parent Organization:** Infinity Aero Club Tampa Bay, Inc. (501c3 nonprofit)
**Founder & CEO:** Ricardo "Tattoo" Foster, LCDR USN (Ret.)
**Domain:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)

## 🚀 Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom brand configuration
- **UI Components:** Shadcn/ui
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Maps:** Mapbox GL JS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🎨 Brand Design System

### Color Palette

- **Primary (Sky Blue):** `#0ea5e9` - Representing limitless possibilities
- **Navy:** `#1e3a8a` - Professional, trustworthy
- **Accent Colors:**
  - Red: `#dc2626`
  - Gold: `#f59e0b`
  - Green: `#10b981`

### Typography

- **Headings:** Montserrat (600, 700, 800)
- **Body:** Inter (400, 500, 600)
- **Display/Numbers:** Bebas Neue (400)

## 👥 User Roles

The platform supports five distinct user types:

1. **Student** - Youth participants with progress tracking
2. **Mentor** - Aviation professionals and volunteers
3. **Organization** - Partner affiliates and program managers
4. **Sponsor** - Donors and corporate partners
5. **Admin** - Infinity Aero Club staff with full system access

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Firebase project (for backend services)
- Mapbox account (for maps integration)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/infinitycollaborative/Hidden-Treasures-Network.git
cd Hidden-Treasures-Network
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Copy the environment template and fill in your credentials:

```bash
cp .env.local.template .env.local
```

Edit `.env.local` with your Firebase and Mapbox credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Set up Firebase Storage
5. Copy your configuration to `.env.local`

### Mapbox Setup

1. Sign up at [mapbox.com](https://mapbox.com)
2. Get your access token from your account dashboard
3. Add the token to `.env.local`

## 📁 Project Structure

```
Hidden-Treasures-Network/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility functions and configs
│   ├── firebase.ts       # Firebase initialization
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # User roles and data models
├── hooks/                # Custom React hooks
├── config/               # Application configuration
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Deployment

This project is configured for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📋 Phase 1 Deliverables (Week 1)

- [x] Project setup with Next.js 14 + TypeScript
- [x] Tailwind CSS with custom brand colors
- [x] Firebase SDK integration
- [x] Shadcn/ui components setup
- [x] Custom fonts (Montserrat, Inter, Bebas Neue)
- [x] TypeScript types for user roles
- [x] Environment variables structure
- [x] Basic home page layout

## 🤝 Contributing

This is a nonprofit project aimed at empowering underserved youth. Contributions are welcome!

## 📄 License

Copyright © 2024 Infinity Aero Club Tampa Bay, Inc. All rights reserved.

## 📞 Contact

For more information about the Hidden Treasures Network:

- **Website:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)
- **Email:** info@hiddentreasuresnetwork.org

---

**Built with ❤️ to impact one million lives by 2030**
