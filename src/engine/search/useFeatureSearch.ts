
import Fuse from "fuse.js";
import { getAllFeatures } from "../features/FeatureRegistry";

let fuse: Fuse<any>;

// Initialize Fuse.js with all features.
// This is more efficient than creating a new Fuse instance on every search.
const initializeFuse = () => {
    fuse = new Fuse(getAllFeatures(), {
        keys: ["title", "keywords", "tab"],
        threshold: 0.35, // Notion-like fuzziness
        includeScore: true,
    });
};

// We need to re-initialize if features are registered dynamically after initial load.
// For now, a simple initialization is enough.
initializeFuse();

export function searchFeatures(query: string) {
  // If Fuse isn't ready (e.g. called before initialization), fall back to simple search
  if (!fuse) {
      return getAllFeatures().filter(f => f.title.toLowerCase().includes(query.toLowerCase()));
  }

  if (!query.trim()) {
      // Return a sensible default list, e.g., all features, or most common ones.
      return getAllFeatures().slice(0, 20);
  }
  // Return the item from the search result
  return fuse.search(query).map(result => result.item);
}
