/**
 * Strict product matching resolver for SHROOOMS recipes.
 * Normalizes strings by stripping parentheticals, common product suffix/prefix modifiers,
 * and punctuation, then enforces a single unique match.
 */
export const resolveProductForMushroom = (mushroomName, products) => {
  if (!products || !Array.isArray(products) || products.length === 0 || !mushroomName) {
    return null;
  }

  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/\s*\(.*?\)\s*/g, "") // Strip parentheticals e.g. (Organic), (Premium)
      .replace(/organic/g, "")
      .replace(/mushrooms/g, "")
      .replace(/mushroom/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const target = normalize(mushroomName);

  const matches = products.filter((p) => {
    const pName = normalize(p.name);
    return pName === target;
  });

  if (matches.length === 1) {
    return matches[0];
  }
  return null;
};
