// Test what's happening with start.js
try {
  console.log('Loading start.js...');
  const startFunction = require('./api/start.js');
  console.log('Type:', typeof startFunction);
  console.log('Value:', startFunction);
} catch (error) {
  console.log('Error loading start.js:', error.message);
  console.log('Stack:', error.stack);
}
