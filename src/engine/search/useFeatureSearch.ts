
import Fuse from "fuse.js";
import { getAllFeatures } from "../features/FeatureRegistry";

const fuse = new Fuse(getAllFeatures(), {
  keys: ["title", "keywords", "tab"],
  threshold: 0.35, // Word/Notion-like fuzziness
});

export function searchFeatures(query: string) {
  if (!query.trim()) return getAllFeatures().slice(0, 20);
  return fuse.search(query).map(r => r.item);
}
