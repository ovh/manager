export default () => function formatPhoneBrandFilter(brand) {
  return brand.replace(/\./g, ' ').toUpperCase();
};
