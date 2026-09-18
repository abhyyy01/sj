# Student Workload Management System (SWMS)

A beautiful, responsive web application for tracking academic workload, mental health, and student performance.

## 🚀 Quick Start

### Option 1: Direct File Opening (Simplest)
1. Navigate to the folder containing the files
2. Double-click `index.html` 
3. The app opens in your default browser

**Files needed:**
- `index.html`
- `styles.css`
- `app.js`

---

## 📱 Option 2: Local Server (Recommended for Development)

### Windows

#### Using Python 3 (Easiest):
```bash
# Navigate to the app folder
cd path\to\swms\folder

# Start a local server
python -m http.server 8000
```

Then open: `http://localhost:8000`

#### Using Python 2:
```bash
python -m SimpleHTTPServer 8000
```

#### Using Node.js (if installed):
```bash
# Install http-server globally (one time)
npm install -g http-server

# Start server in app folder
http-server

# Opens at: http://localhost:8080
```

---

### Mac/Linux

#### Using Python:
```bash
cd /path/to/swms/folder
python3 -m http.server 8000
```

#### Using Node.js:
```bash
npm install -g http-server
http-server
```

#### Using Ruby:
```bash
cd /path/to/swms/folder
ruby -run -ehttpd . -p8000
```

#### Using PHP:
```bash
php -S localhost:8000
```

---

## 🔧 Step-by-Step Setup

### **Step 1: Get the Files**
Make sure you have these 3 files in the same folder:
```
swms-folder/
├── index.html
├── styles.css
└── app.js
```

### **Step 2: Choose Your Method**

**Option A - No Installation (Fastest):**
- Double-click `index.html` - Opens in browser immediately

**Option B - With Local Server (Better for testing):**
- Open Terminal/Command Prompt
- Navigate to folder: `cd path/to/swms-folder`
- Run: `python -m http.server 8000`
- Visit: `http://localhost:8000`

### **Step 3: Login**
- Use any email and password (demo mode)
- Check "Remember me" to stay logged in
- Or click "Sign up" to create a new account

---

## 🌐 Browser Compatibility

Works on:
- ✅ Chrome/Chromium (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📂 Folder Structure

```
your-project/
│
├── index.html          # Main HTML file
├── styles.css          # All styling with custom theme
├── app.js              # All JavaScript functionality
└── README.md           # This file
```

---

## ⚙️ Features

### Dashboard
- Real-time stats (Tasks, GPA, Completion Rate, Stress Level)
- Upcoming deadlines with priority colors
- Interactive weekly performance polygon graph
- Personalized recommendations

### Performance Tracker
- GPA trend visualization
- Grade management
- Assignment completion tracking
- Semester performance analytics

### Mental Health
- Daily mood assessment (1-10 scale)
- Stress and anxiety tracking
- Sleep hours monitoring
- 7-day stress trend chart
- Wellness tips and mood history

### Task Manager
- Add tasks with priority levels
- Track due dates
- Filter by status (All/Pending/Completed)
- Mark tasks as complete
- Color-coded priorities

### Settings
- Enable/disable daily mood reminders
- Set custom reminder time
- Task reminder configuration
- Animation preferences
- Export data as JSON
- Clear all data option

---

## 💾 Data Storage

All data is stored in **browser localStorage**:
- Automatically saved
- Persists between sessions
- No backend server needed
- Local machine only

To clear data:
1. Go to Settings
2. Click "Clear All Data"
3. Or manually clear browser cache/localStorage

---

## 🎨 Customization

### Change Colors
Edit in `styles.css` (around line 10):
```css
:root {
    --primary-color: #6bc4a6;      /* Mint green */
    --accent-color: #7d5a50;       /* Brown */
    --bg-primary: #f8f6f3;         /* Cream */
    /* ... more colors ... */
}
```

### Modify Content
Edit `index.html` to change:
- Text and labels
- Form fields
- Feature descriptions
- Help text

### Adjust Styling
Edit `styles.css` to change:
- Font sizes
- Spacing
- Colors
- Border radius
- Shadows

---

## 🔐 Login System

**Demo Mode (Frontend Only):**
- Any email/password combination works
- Data stored in browser localStorage
- No backend validation

**To Add Backend (Optional):**
1. Create API endpoints for:
   - `/api/auth/login`
   - `/api/auth/signup`
   - `/api/auth/logout`

2. Update `app.js` to call your backend instead of demo mode

3. Store user data in database

---

## 📱 Mobile Responsive

The app is fully responsive:
- **Desktop**: Sidebar + full layout
- **Tablet**: Adaptive grid
- **Mobile**: Hamburger menu + single column

Test on mobile:
```
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test on different screen sizes
```

---

## 🐛 Troubleshooting

### **White screen appears**
- Check browser console (F12 → Console)
- Verify all 3 files are in same folder
- Try clearing cache (Ctrl+Shift+Del)

### **Data not saving**
- Check if localStorage is enabled
- Try private/incognito mode
- Clear browser cache

### **Styles not loading**
- Verify `styles.css` is in same folder
- Check file names are exactly correct (case-sensitive on Mac/Linux)
- Refresh page (Ctrl+F5)

### **JavaScript not working**
- Check `app.js` is in same folder
- Open browser console for errors (F12)
- Verify JavaScript is enabled in browser

---

## 🚀 Deployment (Online)

### Option 1: GitHub Pages (Free)
```bash
# Push files to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/swms.git
git push -u origin main
```
Then enable GitHub Pages in repo settings.

### Option 2: Netlify (Free)
1. Visit https://netlify.com
2. Drag & drop folder
3. Deploy instantly

### Option 3: Vercel (Free)
1. Visit https://vercel.com
2. Import GitHub repo or upload files
3. Deploy with one click

---

## 📝 Notes

- This is a **frontend-only** application
- All data stays on user's device
- No user data is sent to servers
- Perfect for local/educational use
- Can be extended with backend APIs

---

## 🎓 Project Based On

Research: "Impact of Workload on Student Performance and Mental Health"

Features designed to:
- Track academic progress
- Monitor mental well-being
- Manage workload efficiently
- Provide actionable insights

---

## 📧 Support

For issues or questions:
1. Check browser console (F12)
2. Verify file setup
3. Try different browser
4. Clear cache and reload

---

**Happy studying! 🎉**
