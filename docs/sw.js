// Service Worker for Push Notifications
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
    console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
    const payload = event.data?.json() || {
        title: 'New Notification',
        body: 'You have a new message!',
        icon: '/icon-192x192.png',
        url: '/'
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon,
            badge: '/badge-192x192.png',
            data: { url: payload.url }
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ 
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Focus existing tab if available
            for (const client of clientList) {
                if (client.url === event.notification.data.url) {
                    return client.focus();
                }
            }
            
            // Otherwise open new window
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});