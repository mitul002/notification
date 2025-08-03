// Time Notification App - Main JavaScript
// Professional push notification implementation with backend API

class TimeNotificationApp {
    constructor() {
        this.notificationInterval = 60; // seconds
        this.isActive = false;
        this.subscriptionId = null;
        this.pushSubscription = null;
        this.clockTimer = null;
        
        // Backend API configuration
        this.apiBaseUrl = this.getApiBaseUrl();
        this.vapidPublicKey = null;
        
        this.init();
    }
    
    getApiBaseUrl() {
        // For GitHub Pages deployment, use your Vercel backend
        if (location.hostname.includes('github.io') || location.hostname.includes('vercel.app')) {
            return 'https://notification-git-notification-mituls-projects-2010a247.vercel.app/api';
        }
        // For local development
        return 'http://localhost:3001/api';
    }
    
    init() {
        this.updateClock();
        this.startClockTimer();
        this.loadSettings();
        this.checkNotificationSupport();
        this.bindEvents();
        this.initPushNotifications();
    }
    
    async initPushNotifications() {
        try {
            // Get VAPID public key from backend
            const response = await fetch(`${this.apiBaseUrl}/status`);
            const data = await response.json();
            this.vapidPublicKey = data.vapidPublicKey;
            
            if (!this.vapidPublicKey) {
                console.warn('VAPID public key not available from backend');
            }
        } catch (error) {
            console.error('Failed to get VAPID key:', error);
            this.showStatus('⚠️ Backend connection failed. Using local notifications.', 'warning');
        }
    }
    
    // Clock functionality
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const clockEl = document.getElementById('digitalClock');
        const dateEl = document.getElementById('dateDisplay');
        
        if (clockEl && dateEl) {
            clockEl.textContent = timeString;
            dateEl.textContent = dateString;
            
            // Add pulse animation on second change
            clockEl.classList.add('clock-update');
            setTimeout(() => clockEl.classList.remove('clock-update'), 500);
        }
    }
    
    startClockTimer() {
        this.clockTimer = setInterval(() => this.updateClock(), 1000);
    }
    
    // Push notification functionality
    async enableNotifications() {
        if (!this.checkNotificationSupport()) return;
        
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.showStatus('✅ Notifications enabled! Registering for push notifications...', 'success');
                
                // Register service worker and get push subscription
                await this.registerServiceWorker();
                await this.subscribeToPush();
                
                document.getElementById('enableBtn').disabled = true;
                document.getElementById('startBtn').disabled = false;
                
                this.sendTestNotification();
                
            } else if (permission === 'denied') {
                this.showStatus('❌ Notifications were denied. Please enable them in your browser settings.', 'error');
            } else {
                this.showStatus('⚠️ Notification permission is required for this app to work.', 'warning');
            }
        } catch (error) {
            console.error('Error enabling notifications:', error);
            this.showStatus('❌ Error enabling notifications: ' + error.message, 'error');
        }
    }
    
    async subscribeToPush() {
        if (!this.vapidPublicKey) {
            console.warn('No VAPID key available, skipping push subscription');
            return;
        }
        
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                // Create new subscription
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
                });
            }
            
            this.pushSubscription = subscription;
            console.log('Push subscription ready:', subscription);
            
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            this.showStatus('⚠️ Push notifications not available. Using local notifications.', 'warning');
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                // Don't show error to user, service worker is optional
            }
        }
    }
    
    async startNotifications() {
        if (Notification.permission !== 'granted') {
            this.showStatus('⚠️ Please enable notifications first', 'warning');
            return;
        }
        
        try {
            this.isActive = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            
            // Try to use backend API first
            if (this.pushSubscription && this.vapidPublicKey) {
                await this.startBackendNotifications();
            } else {
                // Fallback to local notifications
                this.startLocalNotifications();
            }
            
            this.saveSettings();
            
        } catch (error) {
            console.error('Error starting notifications:', error);
            this.showStatus('❌ Error starting notifications: ' + error.message, 'error');
            this.isActive = false;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
        }
    }
    
    async startBackendNotifications() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: this.pushSubscription,
                    interval: this.notificationInterval
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.subscriptionId = data.subscriptionId;
                this.showStatus(`🔔 Backend notifications started! You'll receive push notifications every ${this.notificationInterval} seconds, even when browser is closed.`, 'success');
            } else {
                throw new Error(data.error || 'Backend request failed');
            }
            
        } catch (error) {
            console.error('Backend notifications failed:', error);
            this.showStatus('⚠️ Backend unavailable. Starting local notifications...', 'warning');
            this.startLocalNotifications();
        }
    }
    
    startLocalNotifications() {
        // Send immediate notification
        this.sendTimeNotification();
        
        // Schedule recurring notifications (fallback)
        this.notificationTimer = setInterval(() => {
            this.sendTimeNotification();
        }, this.notificationInterval * 1000);
        
        this.showStatus(`🔔 Local notifications started! You'll receive notifications every ${this.notificationInterval} seconds.`, 'success');
    }
    
    async stopNotifications() {
        this.isActive = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        
        // Stop backend notifications if using backend
        if (this.subscriptionId) {
            try {
                await fetch(`${this.apiBaseUrl}/stop`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscriptionId: this.subscriptionId,
                        subscription: this.pushSubscription
                    })
                });
                this.subscriptionId = null;
            } catch (error) {
                console.error('Error stopping backend notifications:', error);
            }
        }
        
        // Stop local notifications
        if (this.notificationTimer) {
            clearInterval(this.notificationTimer);
            this.notificationTimer = null;
        }
        
        this.showStatus('⏹️ All notifications stopped.', 'warning');
        this.saveSettings();
    }
    
    sendTimeNotification() {
        if (!this.isActive || Notification.permission !== 'granted') return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        
        const notification = new Notification('🕐 Current Time', {
            body: `${timeString}\n${dateString}`,
            icon: this.createClockIcon(),
            tag: 'time-notification',
            requireInteraction: false,
            silent: false
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);
        
        // Click handler
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
    
    sendTestNotification() {
        const notification = new Notification('🎉 Notifications Enabled!', {
            body: `Test notification sent at ${new Date().toLocaleTimeString()}`,
            icon: this.createClockIcon(),
            tag: 'test-notification'
        });
        
        setTimeout(() => notification.close(), 3000);
    }
    
    // Settings management
    updateInterval() {
        const input = document.getElementById('customInterval');
        const value = parseInt(input.value);
        
        if (value && value >= 5 && value <= 3600) {
            this.notificationInterval = value;
            document.getElementById('currentInterval').textContent = value;
            this.showStatus(`✅ Interval updated to ${value} seconds`, 'success');
            
            // Restart notifications if active
            if (this.isActive) {
                this.stopNotifications();
                setTimeout(() => this.startNotifications(), 100);
            }
            
            this.saveSettings();
        } else {
            this.showStatus('❌ Please enter a valid interval between 5 and 3600 seconds', 'error');
        }
    }
    
    setPreset(seconds) {
        this.notificationInterval = seconds;
        document.getElementById('customInterval').value = seconds;
        document.getElementById('currentInterval').textContent = seconds;
        this.showStatus(`✅ Preset set to ${seconds} seconds`, 'info');
        
        // Restart notifications if active
        if (this.isActive) {
            this.stopNotifications();
            setTimeout(() => this.startNotifications(), 100);
        }
        
        this.saveSettings();
    }
    
    // Utility functions
    checkNotificationSupport() {
        if (!('Notification' in window)) {
            this.showStatus('❌ Notifications are not supported in this browser', 'error');
            return false;
        }
        return true;
    }
    
    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status ${type}`;
        }
    }
    
    createClockIcon() {
        // Create a simple clock icon as data URL
        return 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007bff">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
        `);
    }
    
    saveSettings() {
        const settings = {
            interval: this.notificationInterval,
            isActive: this.isActive
        };
        localStorage.setItem('timeNotificationSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('timeNotificationSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.notificationInterval = settings.interval || 60;
                
                // Update UI
                document.getElementById('customInterval').value = this.notificationInterval;
                document.getElementById('currentInterval').textContent = this.notificationInterval;
                
                // Check if notifications were previously enabled
                if (Notification.permission === 'granted') {
                    document.getElementById('enableBtn').disabled = true;
                    document.getElementById('startBtn').disabled = false;
                    this.showStatus('🔔 Notifications are already enabled. You can start time notifications.', 'success');
                    
                    // Auto-restart if was active (optional)
                    if (settings.isActive) {
                        setTimeout(() => this.startNotifications(), 1000);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    notifyServiceWorker(action) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: action === 'start' ? 'START_NOTIFICATIONS' : 'STOP_NOTIFICATIONS',
                interval: this.notificationInterval
            });
        }
    }
    
    bindEvents() {
        // Handle page visibility for better performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page hidden, service worker can take over
                this.notifyServiceWorker(this.isActive ? 'start' : 'stop');
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            if (this.isActive) {
                this.notifyServiceWorker('start');
            }
        });
    }
}

// Global functions for HTML onclick handlers
let app;

function enableNotifications() {
    app.enableNotifications();
}

function startNotifications() {
    app.startNotifications();
}

function stopNotifications() {
    app.stopNotifications();
}

function updateInterval() {
    app.updateInterval();
}

function setPreset(seconds) {
    app.setPreset(seconds);
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    app = new TimeNotificationApp();
});

// Handle service worker messages
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'NOTIFICATION_STOPPED') {
            app.stopNotifications();
        }
    });
}
