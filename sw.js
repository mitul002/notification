// Service Worker for Time Notifications
// Handles push notifications from backend API

const CACHE_NAME = 'time-notification-v1';
const NOTIFICATION_TAG = 'time-notification';

// Install event
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// Handle push messages from backend
self.addEventListener('push', event => {
    console.log('Push message received:', event);
    
    if (event.data) {
        try {
            const data = event.data.json();
            
            event.waitUntil(
                self.registration.showNotification(data.title, {
                    body: data.body,
                    icon: data.icon || createClockIcon(),
                    badge: data.badge || createClockIcon(),
                    tag: data.tag || NOTIFICATION_TAG,
                    requireInteraction: false,
                    silent: false,
                    timestamp: data.timestamp || Date.now(),
                    actions: data.actions || [
                        {
                            action: 'stop',
                            title: '⏹️ Stop',
                            icon: createStopIcon()
                        },
                        {
                            action: 'open',
                            title: '📱 Open App',
                            icon: createOpenIcon()
                        }
                    ],
                    data: data.data || {}
                })
            );
            
        } catch (error) {
            console.error('Error processing push message:', error);
            
            // Fallback notification
            event.waitUntil(
                self.registration.showNotification('🕐 Time Notification', {
                    body: 'Received notification at ' + new Date().toLocaleTimeString(),
                    icon: createClockIcon(),
                    tag: NOTIFICATION_TAG
                })
            );
        }
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'stop') {
        // Stop notifications by calling backend API
        event.waitUntil(
            stopBackendNotifications(event.notification.data)
        );
        
    } else {
        // Open/focus the app (default action or 'open' action)
        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(clients => {
                    // Check if app is already open
                    for (const client of clients) {
                        if (client.url.includes(self.location.origin)) {
                            return client.focus();
                        }
                    }
                    
                    // Open new window if app not found
                    if (self.clients.openWindow) {
                        const url = event.notification.data?.url || '/';
                        return self.clients.openWindow(url);
                    }
                })
        );
    }
});

// Stop backend notifications
async function stopBackendNotifications(notificationData) {
    try {
        if (notificationData?.subscriptionId) {
            const apiUrl = getApiBaseUrl();
            
            await fetch(`${apiUrl}/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: notificationData.subscriptionId
                })
            });
            
            console.log('Backend notifications stopped from service worker');
            
            // Notify main app if available
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({ 
                    type: 'NOTIFICATION_STOPPED',
                    subscriptionId: notificationData.subscriptionId
                });
            });
        }
    } catch (error) {
        console.error('Failed to stop backend notifications:', error);
    }
}

// Get API base URL
function getApiBaseUrl() {
    if (self.location.hostname.includes('github.io')) {
        return 'https://your-backend-app.vercel.app/api';
    }
    return 'http://localhost:3001/api';
}

// Handle notification close
self.addEventListener('notificationclose', event => {
    console.log('Notification closed:', event.notification.tag);
});

// Keep service worker alive
self.addEventListener('fetch', event => {
    // Simple pass-through, just to keep SW active
});

// Utility functions for creating icons
function createClockIcon() {
    return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007bff">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
    `);
}

function createStopIcon() {
    return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc3545">
            <path d="M6 6h12v12H6z"/>
        </svg>
    `);
}

function createOpenIcon() {
    return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#28a745">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
    `);
}

console.log('Time Notification Service Worker loaded and ready');
