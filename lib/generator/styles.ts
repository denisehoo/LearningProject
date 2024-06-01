// Import the JSON data
import stylesData from './stylesData.json';

// Define the Style interface
export type StyleDataProp = {
  name: string;
  positive: string;
  negative: string;
};

// Create a Map to act as the hashtable
const stylesMap = new Map<string, StyleDataProp>(stylesData.map(style => [style.name, style]));

// Function to get style by name
export function getStyleByName(name: string): StyleDataProp {
  // Check if the style exists in the map
  if (stylesMap.has(name)) {
    return stylesMap.get(name) as StyleDataProp;
  }

  // If not found, return a random style
  const randomIndex = Math.floor(Math.random() * stylesData.length);
  return stylesData[randomIndex];
}
