---
description: How to safely make changes and test before deploying to production
---

# Development & Deployment Workflow

## 🎯 Overview
This guide helps you make changes to the live project safely by testing everything locally first, then deploying to production.

---

## 📦 Prerequisites

1. **Git installed** - Version control
2. **Node.js installed** - Runtime environment
3. **Code editor** - VS Code recommended
4. **Supabase account** - For database (you already have this)

---

## 🚀 Method 1: Basic Workflow (Quick Testing)

### Step 1: Make Sure Local Environment is Set Up

```bash
# Navigate to project directory
cd "d:\Desktop\Personal\MERN Projects\Flash-doc\project\project"

# Install dependencies (if not already done)
npm install
```

### Step 2: Set Up Environment Variables

Create/verify `.env` file in project root:
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

⚠️ **Warning**: This uses your PRODUCTION database. Changes will affect live data!

### Step 3: Run Development Server

// turbo
```bash
npm run dev
```

- Server starts at `http://localhost:5173` (or similar)
- App will open in browser automatically
- Hot Module Replacement (HMR) enabled - changes reflect instantly

### Step 4: Make Your Code Changes

Edit any files in `src/` folder. Changes will auto-reload in browser.

### Step 5: Test Thoroughly

✅ **Test checklist:**
- [ ] Feature works as expected
- [ ] No console errors (F12 → Console tab)
- [ ] Mobile responsive (F12 → Toggle device toolbar)
- [ ] Authentication still works
- [ ] Navigation between pages works
- [ ] Database operations work (if applicable)

### Step 6: Build for Production

```bash
npm run build
```

- This creates optimized production files in `dist/` folder
- Checks for errors before deployment
- If build fails, fix errors before deploying!

### Step 7: Preview Production Build Locally

```bash
npm run preview
```

- Tests the actual production build
- More accurate than dev server
- Use this for final testing

### Step 8: Deploy to Production

**If using Vercel:**
```bash
# Push to GitHub (Vercel auto-deploys)
git add .
git commit -m "Description of changes"
git push origin main
```

**If using manual deployment:**
- Upload `dist/` folder contents to your hosting server
- Use FTP/SFTP or hosting dashboard

---

## 🏗️ Method 2: Professional Workflow (Recommended for Major Changes)

### Step 1: Create a Separate Testing Database

**Option A - Supabase Local Development:**
1. Go to Supabase Dashboard
2. Create a new project called "flash-doc-staging"
3. Copy schema from production (use migration SQL)

**Option B - Duplicate Production:**
1. Export production database schema
2. Create staging project
3. Import schema (without user data)

### Step 2: Use Environment Variables for Different Environments

Create `.env.local` for development:
```env
VITE_SUPABASE_URL=your_staging_supabase_url
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
```

Create `.env.production` for production:
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Step 3: Use Git Branches

```bash
# Create a new branch for your feature
git checkout -b feature/my-new-feature

# Make your changes...

# Test locally with staging database
npm run dev

# Commit changes
git add .
git commit -m "Add new feature: description"

# Push branch to GitHub
git push origin feature/my-new-feature
```

### Step 4: Deploy to Staging Environment

**Using Vercel:**
1. Every branch push creates a preview deployment automatically
2. Vercel gives you a unique URL like: `flash-doc-abc123.vercel.app`
3. Test on this URL thoroughly

**Using Netlify:**
- Similar to Vercel, creates branch previews

### Step 5: Merge to Production

```bash
# Switch to main branch
git checkout main

# Merge your feature branch
git merge feature/my-new-feature

# Push to production
git push origin main
```

Vercel/Netlify will auto-deploy to production domain.

---

## 🛠️ Method 3: Manual Testing Without Affecting Production

### Create a Safe Testing Setup

1. **Duplicate the entire project folder:**
   ```bash
   # In your Desktop\Personal\MERN Projects folder
   cp -r "Flash-doc\project\project" "Flash-doc\project\project-testing"
   ```

2. **Create test Supabase project** (staging database)

3. **Update `.env` in testing folder** with staging credentials

4. **Run dev server from testing folder:**
   ```bash
   cd "d:\Desktop\Personal\MERN Projects\Flash-doc\project\project-testing"
   npm run dev
   ```

5. **Make and test all changes** in the testing folder

6. **Copy working files back** to production folder when ready

---

## 📱 Testing Checklist Before Deployment

### Functionality Tests
- [ ] All pages load without errors
- [ ] Login/Signup works
- [ ] Student dashboard functions correctly
- [ ] Flashcard system works
- [ ] Admin panel accessible (if admin)
- [ ] All forms submit correctly
- [ ] Navigation works between all pages

### Technical Tests
- [ ] No console errors (press F12)
- [ ] No 404 errors in Network tab
- [ ] Images load correctly
- [ ] API calls succeed (check Network tab)
- [ ] Build completes without errors (`npm run build`)

### Browser Tests
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (if available)
- [ ] Works in Edge

### Responsive Tests
- [ ] Mobile view (375px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1920px width)

### Security Tests
- [ ] Protected routes still require login
- [ ] Admin routes only accessible to admins
- [ ] User data is secure

---

## 🚨 Emergency Rollback Plan

If deployment breaks production:

### Quick Rollback (Vercel/Netlify):
1. Go to your hosting dashboard
2. Find "Deployments" section
3. Click on previous working deployment
4. Click "Promote to Production" or "Rollback"

### Git Rollback:
```bash
# Find the last working commit
git log

# Revert to that commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

---

## 💡 Best Practices

1. **Always test locally first** - Never push untested code
2. **Use meaningful commit messages** - "Fix login bug" not "fixed stuff"
3. **Test on multiple devices** - What works on desktop may break on mobile
4. **Keep .env file secure** - Never commit to Git
5. **Use version control** - Commit frequently
6. **Create backups** - Export database before major changes
7. **Monitor after deployment** - Check production site after every deployment
8. **Use staging environment** - For major changes or new features

---

## 🔧 Common Issues & Solutions

### Issue: "Module not found" after deploying
**Solution:** Run `npm install` and commit `package-lock.json`

### Issue: Build fails
**Solution:** Check console for errors, fix them, run `npm run build` again

### Issue: Environment variables not working
**Solution:** 
- Vercel: Add them in Project Settings → Environment Variables
- Ensure they start with `VITE_` prefix

### Issue: Pages show 404 on refresh
**Solution:** Configure `vercel.json` with rewrites (already done in your project)

### Issue: Changes not reflecting after deployment
**Solution:** 
- Clear browser cache (Ctrl+Shift+R)
- Check if correct branch is deployed
- Wait 2-3 minutes for CDN to update

---

## 📚 Recommended Git Workflow

```bash
# Daily workflow
git pull origin main          # Get latest changes
git checkout -b fix/bug-name  # Create feature branch
# ... make changes ...
git add .
git commit -m "Fix: description"
git push origin fix/bug-name

# After testing in preview deployment
git checkout main
git merge fix/bug-name
git push origin main          # Deploys to production
git branch -d fix/bug-name    # Delete local branch
```

---

## 📞 Quick Reference Commands

```bash
# Development
npm run dev           # Start local dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Check code quality

# Git
git status            # Check what changed
git add .             # Stage all changes
git commit -m "msg"   # Commit changes
git push              # Push to GitHub
git pull              # Get latest changes

# Vercel (if using Vercel CLI)
vercel dev            # Local development with Vercel env
vercel                # Deploy to preview
vercel --prod         # Deploy to production
```

---

## ✅ Summary

**For Small Changes:**
Local Dev → Test → Build → Deploy → Monitor

**For Major Changes:**
Local Dev → Test → Create Branch → Deploy to Staging → Test Staging → Merge to Main → Deploy to Production → Monitor

**Golden Rule:** 
**NEVER deploy without testing the build locally first!**
