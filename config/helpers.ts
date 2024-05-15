// helpers.ts

export async function fetchPublishableKey() {
  // Fetch the publishable key from your server
  // Replace with your actual fetch logic
  const response = await fetch('https://your-server.com/get-publishable-key');
  const { publishableKey } = await response.json();
  return publishableKey;
}

export async function createPaymentIntent() {
  // Create a payment intent on your server
  // Replace with your actual fetch logic
  const response = await fetch('https://your-server.com/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 1099, // Amount in cents
    }),
  });
  const { clientSecret } = await response.json();
  return clientSecret;
}
