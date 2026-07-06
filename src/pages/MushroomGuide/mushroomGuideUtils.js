/* ═══════════════════════════════════════════════
   SHROOOMS — MUSHROOM GUIDE UTILITIES
   Shared runtime product matching logic
   ═══════════════════════════════════════════════ */

export const resolveProductForGuideItem = (item, productsList) => {
  if (!productsList || !Array.isArray(productsList) || !item || !item.productMatchNames) {
    return null;
  }

  const matches = productsList.filter((prod) => {
    const rawProdName = prod.name || "";
    // Normalize catalog product name
    const normalizedProdName = rawProdName
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

    return item.productMatchNames.some((matchName) => {
      const normalizedMatchName = matchName
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
      return normalizedProdName.includes(normalizedMatchName);
    });
  });

  // Strict matching: Only return if exactly one product resolves cleanly
  if (matches.length === 1) {
    return matches[0];
  }
  return null;
};
