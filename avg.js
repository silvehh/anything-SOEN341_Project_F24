export default function avg(ratings) {
  return ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) 
    : 'N/A';
}