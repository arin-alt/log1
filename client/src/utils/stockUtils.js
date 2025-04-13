export const calculateTotalStocks = (allStocks, listingId) => {
  if (!allStocks || !listingId) return 0;

  const filteredStocks = allStocks.filter((stock) => {
    const stockListingId = stock.listing?._id || stock.listing?.id;
    const matches = stockListingId === listingId;
    return matches && stock.status === "available";
  });

  return filteredStocks.reduce(
    (total, stock) => total + (stock.quantity || 0),
    0
  );
};

export const getStockLevel = (listings, allStocks, itemId) => {
  const listing = listings.find(
    (item) => item.id === itemId || item._id === itemId
  );

  //   console.log(`LISTING ON GET STOCK LEVEL: ${JSON.stringify(listing)}`);
  //   if (!listing) return "Unknown";

  const currentStock = calculateTotalStocks(allStocks, itemId);
  const maxLevel = listing.maxStockLevel || 0;
  const minLevel = listing.minStockLevel || 0;

  if (currentStock <= minLevel) return "Low";

  const range = maxLevel - minLevel;
  //   if (range <= 0) return "Unknown";

  const stockAboveMin = currentStock - minLevel;
  const stockPercentage = (stockAboveMin / range) * 100;

  if (stockPercentage >= 75) return "High";
  if (stockPercentage >= 25) return "Medium";
  return "Low";
};

export const getStockLevelClass = (stockLevel) => {
  var stockLevel = stockLevel.toLowerCase();
  if (stockLevel === "low") return "bg-red-100 text-red-800";
  if (stockLevel === "high") return "bg-green-100 text-green-800";
  if (stockLevel === "moderate") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};
