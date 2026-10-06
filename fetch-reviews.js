const fs = require('fs');

const API_KEY = process.env.PLACES_API_KEY;
const PLACE_ID = 'ChIJPRNZBdKx2YgRj7OTRgElpLA';

async function updateReviews() {
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-ApiKey': API_KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri'
    }
  });

  const data = await response.json();

  const output = {
    rating: data.rating || 4.3,
    user_ratings_total: data.userRatingCount || 127,
    url: data.googleMapsUri || 'https://www.google.com/search?q=Connected+Shop+Miami+Beach'
  };

  fs.writeFileSync('reviews.json', JSON.stringify(output, null, 2));
  console.log('reviews.json successfully generated:', output);
}

updateReviews().catch(console.error);
