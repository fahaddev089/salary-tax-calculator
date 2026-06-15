# Salary Tax Calculator (Pakistan FY 2025–26 / FY 2026–27)

A small React + Vite app that calculates monthly/annual income tax for
salaried individuals in Pakistan, with a toggle between FBR's **FY 2025–26**
(TY2026) slabs and the **FY 2026–27** (TY2027) slabs proposed in Budget
2026–27 (effective 1 July 2026, pending formal passage of the Finance Bill
2026). For the entered salary it shows the **fixed tax** for the applicable
slab and the **tax on the additional amount** above that slab's threshold.

The layout is a two-column "receipt" that fits within one screen on desktop
(no vertical scroll) and stacks into a single scrollable column on mobile.

## 1. Run locally

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:5173).

## 2. Build for production

```bash
npm run build
npm run preview   # optional, preview the production build locally
```

The build output goes to the `dist/` folder.

## 3. Push to Git

```bash
git init
git add .
git commit -m "Initial commit: salary tax calculator"
git branch -M main
git remote add origin <YOUR_GIT_REPO_URL>
git push -u origin main
```

## 4. Deploy on Vercel

**Option A — via Vercel dashboard (recommended):**

1. Go to https://vercel.com and sign in.
2. Click **Add New → Project** and import the Git repository you just pushed.
3. Vercel auto-detects this as a **Vite** project:
   - Build command: `vite build`
   - Output directory: `dist`
4. Click **Deploy**. Future pushes to `main` will auto-deploy.

**Option B — via Vercel CLI:**

```bash
npm install -g vercel
vercel        # follow prompts for first deploy
vercel --prod # deploy to production
```

## Updating the tax slabs

The slabs live at the top of `src/App.jsx` in the `TAX_DATA` object, with one
entry per tax year (`'2025-26'` and `'2026-27'`). Each slab in a year's
`slabs` array has:

- `upTo` — upper bound of annual taxable income for this slab (PKR)
- `rate` — tax rate applied to the amount **above** the previous slab's `upTo`
- `fixed` — fixed tax amount already accumulated from lower slabs
- `label` — text shown in the breakdown

To add a future tax year, copy an existing entry, update the slabs/footnote,
and it will automatically appear in the year toggle.
