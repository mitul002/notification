const webPush = require('web-push');

// Generate VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();

console.log('🔑 VAPID Keys Generated Successfully!\n');
console.log('📋 Copy these to your environment variables:\n');
console.log('VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('VAPID_SUBJECT=mailto:your-email@example.com');
console.log('\n💡 For Vercel deployment:');
console.log('1. Run: vercel env add VAPID_PUBLIC_KEY');
console.log('2. Run: vercel env add VAPID_PRIVATE_KEY'); 
console.log('3. Run: vercel env add VAPID_SUBJECT');
console.log('\n🎯 Public key for frontend:', vapidKeys.publicKey);
