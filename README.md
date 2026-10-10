# EstateGuru - Modern Real Estate Portal & Agent Hub

A modern, responsive real estate listing platform inspired by PropertyGuru. Built with React, TypeScript, Tailwind CSS, and Google Firebase Firestore & Authentication.

## Key Features

### 1. Public Property Portal
- **Hero & Search Engine**: Multi-faceted filter system with Buy / Rent switch, keyword search (condo name, MRT, street), property type (Condo, Landed, HDB, Commercial), district selector, price brackets, and bedrooms.
- **Visual Listing Grid**: Real-time property cards with image galleries, verification badges, 3D Matterport tour indicators, price & S$/psf calculation, specs, and bookmarking.
- **Comprehensive Property Detail Page**:
  - Interactive 5-photo hero grid & fullscreen Lightbox modal
  - Key highlights & property specifications grid
  - Amenities and facilities checklist
  - Interactive Mortgage Estimator with sliders and MAS TDSR guidelines
  - Neighborhood Transit & Location view (walking distance to MRT stations, reputable schools, supermarkets, parks)
  - Agent Contact Card with direct WhatsApp link, phone call, and viewing scheduler form

### 2. Agent Dashboard & Listing Management
- **Upload & Edit Form**: Full UI for agents to create or update listings (title, price, specs, address, amenities, description, and image manager with file dropzone + architectural presets).
- **My Listings Hub**: Switch between table view and card grid view. Filter by status (Active, Pending, Sold, Rented), search, quick status toggling, direct editing, and secure deletion.
- **Viewing Leads Tracker**: In-app CRM to view incoming viewing requests and buyer inquiries with direct WhatsApp and email reply triggers.

### 3. Firebase & Authentication
- Google Authentication with real Firebase Auth (`signInWithPopup`) and fallback persona simulation.
- Firestore synchronization for `/properties` and `/inquiries`.
- Hardened `firestore.rules` and `firebase-blueprint.json` included for security.

---

## How to Commit to GitHub & Deploy on Vercel

### Step 1: Initialize Git and Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: EstateGuru real estate portal"
git branch -M main
git remote add origin https://github.com/your-username/estateguru.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository (`estateguru`).
3. Under **Environment Variables**, add your Firebase project settings (optional for zero-config mode, recommended for live cloud sync):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_APP_ID`
4. Click **Deploy**. Vercel will build and serve your app globally on edge CDN!

### Step 3: Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
