# 🕐 Time Notification App

A beautiful, lightweight web application that provides continuous time notifications at custom intervals. Perfect for GitHub Pages hosting!

## ✨ Features

- **🕐 Live Digital Clock** - Real-time clock display with date
- **🔔 Custom Notifications** - Set any interval from 5 seconds to 1 hour
- **📱 Mobile Friendly** - Responsive design that works on all devices
- **🌐 Works Offline** - Service Worker enables background notifications
- **⚡ Lightweight** - Pure vanilla JavaScript, no dependencies
- **🎯 GitHub Pages Ready** - Deploy instantly to GitHub Pages

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose `main` branch
4. Visit your GitHub Pages URL: `https://yourusername.github.io/notification`

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/notification.git
cd notification

# Start a local server
python -m http.server 8000
# OR
npx serve .

# Open browser
open http://localhost:8000
```

## 📱 How to Use

1. **Enable Notifications** - Click the button and allow browser permission
2. **Set Your Interval** - Choose from presets (30s, 1m, 5m, etc.) or set custom seconds
3. **Start Notifications** - Begin receiving time notifications
4. **Background Operation** - Notifications continue even when tab is closed
5. **Stop Anytime** - Return to the page or use notification actions to stop

## 🛠️ Technical Details

### Files Structure
```
├── index.html          # Main HTML page
├── style.css          # Beautiful CSS styling
├── app.js             # Core JavaScript functionality
├── sw.js              # Service Worker for background notifications
└── README.md          # This file
```

### Browser Compatibility
- ✅ Chrome 50+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ✅ Mobile browsers (with some limitations)

### Features in Detail

**Live Clock Display**
- Real-time updates every second
- 24-hour format with smooth animations
- Full date display with day of week

**Notification System**
- Browser native notifications
- Service Worker for background operation
- Customizable intervals (5 seconds to 1 hour)
- Action buttons in notifications

**Responsive Design**
- Mobile-first approach
- Touch-friendly controls
- Adapts to all screen sizes

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #007bff;    /* Main theme color */
    --success-color: #28a745;    /* Success/start buttons */
    --danger-color: #dc3545;     /* Stop button */
}
```

### Modifying Intervals
Edit the preset buttons in `index.html`:
```html
<button class="btn btn-outline" onclick="setPreset(30)">30s</button>
<button class="btn btn-outline" onclick="setPreset(60)">1m</button>
<!-- Add more presets as needed -->
```

### Custom Notification Messages
Modify the notification content in `app.js`:
```javascript
const notification = new Notification('🕐 Your Custom Title', {
    body: `Custom message: ${timeString}`,
    // ... other options
});
```

## 🔧 Advanced Configuration

### Service Worker Settings
The Service Worker (`sw.js`) handles background notifications. Key settings:

- **Cache Name**: Update `CACHE_NAME` for new versions
- **Notification Tag**: Modify `NOTIFICATION_TAG` for grouping
- **Icon Generation**: Customize the `createClockIcon()` function

### Local Storage
Settings are automatically saved to browser local storage:
- Notification interval preference
- Enable/disable state
- Auto-restore on page reload

## 🌐 Deployment Options

### GitHub Pages
1. Push code to GitHub repository
2. Enable Pages in repository settings
3. Choose source branch (usually `main`)
4. App will be available at: `https://username.github.io/repository-name`

### Other Static Hosts
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **Surge.sh**: Use `surge` command
- **Firebase Hosting**: Use `firebase deploy`

## 📱 Mobile Considerations

### iOS Safari
- Background notifications may be limited
- Works best when page is added to home screen
- Some notification features may vary

### Android Chrome
- Full background notification support
- Works even when browser is closed
- Best overall experience

## 🔍 Troubleshooting

### Notifications Not Working
1. Check browser notification permissions
2. Ensure HTTPS (required for Service Workers)
3. Try refreshing the page
4. Check browser console for errors

### Service Worker Issues
1. Open Developer Tools > Application > Service Workers
2. Check if SW is registered and active
3. Try "Unregister" and refresh page
4. Clear browser cache if needed

### Background Notifications Stopping
- Some browsers limit background activity
- Mobile browsers may pause notifications
- Desktop browsers generally maintain background operation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icons and design inspired by modern web standards
- Service Worker implementation follows PWA best practices
- Responsive design based on mobile-first principles

---

**Made with ❤️ for continuous time notifications**

Deploy this app to GitHub Pages and never miss track of time again! 🕐
