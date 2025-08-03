# 🚀 Deployment Guide

## Quick Deploy Steps

### 1. GitHub Repository Setup
```bash
# If not already done, create GitHub repository
git init
git add .
git commit -m "Initial commit: Time Notification System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/notification.git
git push -u origin main
```

### 2. Frontend (GitHub Pages)
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Click **Save**
6. Your frontend will be available at: `https://YOUR_USERNAME.github.io/notification`

### 3. Backend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Import your GitHub repository
4. **Root Directory**: Set to `backend`
5. **Environment Variables** (REQUIRED):
   ```
   VAPID_PUBLIC_KEY=your_public_key_here
   VAPID_PRIVATE_KEY=your_private_key_here  
   VAPID_SUBJECT=mailto:your_email@example.com
   ```
6. Click **Deploy**

### 4. Get Your VAPID Keys
```bash
cd backend
npm run generate-vapid
```
Copy the output and use in Vercel environment variables.

### 5. Update Frontend API URL
After Vercel deployment, update `app.js` line 23:
```javascript
return 'https://YOUR_VERCEL_URL.vercel.app/api';
```

### 6. Test Your Deployment
1. Visit your GitHub Pages URL
2. Click "Enable Notifications"
3. Start notifications
4. Close browser tab
5. Notifications should continue!

## Environment Variables for Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VAPID_PUBLIC_KEY` | `BH...` | Public key from generate-vapid |
| `VAPID_PRIVATE_KEY` | `your-private-key` | Private key from generate-vapid |
| `VAPID_SUBJECT` | `mailto:you@example.com` | Your contact email |

## Troubleshooting

### CORS Issues
- Make sure Vercel backend has CORS enabled
- Check browser console for errors

### Notifications Not Working
- Verify VAPID keys are correctly set in Vercel
- Check if GitHub Pages is using HTTPS
- Test API endpoints directly

### API URL Issues
- Update the Vercel URL in `app.js`
- Redeploy after changes

## File Structure for Deployment

```
notification/
├── index.html          # Main app (GitHub Pages)
├── app.js             # Frontend logic  
├── style.css          # Styles
├── sw.js              # Service Worker
├── README.md          # Documentation
├── .gitignore         # Git ignore file
└── backend/           # Vercel deployment
    ├── api/
    │   ├── start.js   # Start notifications
    │   ├── stop.js    # Stop notifications
    │   └── status.js  # Get status
    ├── package.json   # Dependencies
    ├── vercel.json    # Vercel config
    └── .env.example   # Environment example
```

## Success Checklist

- [ ] GitHub repository created
- [ ] GitHub Pages enabled
- [ ] Vercel project deployed
- [ ] VAPID keys generated and set
- [ ] API URL updated in frontend
- [ ] Test notifications working
- [ ] Works when tab is closed

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test API endpoints with curl
4. Check Vercel function logs
