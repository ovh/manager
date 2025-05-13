/**
 * Initialize brand list for the filter
 * @param {Array} offers
 */
export default function initializeBrandList(offers) {
  let brands = offers.map((offer) => {
    let brand = offer.name.substring(0, offer.name.indexOf('.'));
    brand = brand.replace(/^./, brand[0].toUpperCase());
    return brand;
  });
  brands = brands.filter((offer, index) => brands.indexOf(offer) === index);
  const brandList = ['All', ...brands];
  return brandList;
}
