/* eslint-disable no-undef */
/* global firebase */

// Firebase Cloud Messaging service worker for Flutter Web.
// This is required so Chrome/Edge can show system notifications when the
// Flutter app is in a background tab or not focused.

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyByYUQhic3KV8NZVEB3dIZNLEFuJpGd6LI',
  authDomain: 'blink-eye-web.firebaseapp.com',
  projectId: 'blink-eye-web',
  storageBucket: 'blink-eye-web.firebasestorage.app',
  messagingSenderId: '603796083055',
  appId: '1:603796083055:web:7c2d19eface49fc747989a',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const data = payload && payload.data ? payload.data : {};
  const notif = payload && payload.notification ? payload.notification : {};
  const title = data.title || notif.title || 'Blink Reminder 👁️';
  const body = data.body || notif.body || 'Time to blink your eyes!';

  const notificationOptions = {
    body: body,
    // Keep parity with the Flutter-provided strings.
    // icon: 'icons/Icon-192.png',
    data: {
      // Preserve payload data for click handling if you want to extend later.
      ...data,
    },
  };

  self.registration.showNotification(title, notificationOptions);
});

// Optional: bring the app to the front when user clicks the notification.
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification && event.notification.data && event.notification.data.click_url
    ? event.notification.data.click_url
    : '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

