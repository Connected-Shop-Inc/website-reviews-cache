const fs = require('fs');

const API_KEY = process.env.PLACES_API_KEY;
const PLACE_ID = 'ChIJPRNZBdKx2YgRj7OTRgElpLA';

async function updateReviews() {
  if (!API_KEY) {
    throw new Error('PLACES_API_KEY environment variable is missing or empty!');
  }

  // Appended ?key=${API_KEY} parameter directly to the endpoint URL
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${API_KEY}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY, // Corrected header spelling with hyphen
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri'
    }
  });

  const data = await response.json();
  console.log('Raw API Response from Google:', JSON.stringify(data, null, 2));

  if (!response.ok || data.error) {
    throw new Error(`Google API Error (${response.status}): ${JSON.stringify(data.error || data)}`);
  }

  if (!data.userRatingCount) {
    throw new Error('API response missing userRatingCount field');
  }

  const output = {
    rating: data.rating,
    user_ratings_total: data.userRatingCount,
    url: data.googleMapsUri || 'https://www.google.com/search?q=Connected+Shop+Miami+Beach'
  };

  fs.writeFileSync('reviews.json', JSON.stringify(output, null, 2));
  console.log('reviews.json successfully generated:', output);
}

updateReviews().catch((err) => {
  console.error(err);
  process.exit(1);
});
