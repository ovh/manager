import constant from './constant';

export default () => function formatModemBrandFilter(brand) {
  let brandFormatted = '';
  brand.toUpperCase().split('.').forEach((element) => {
    if (element !== constant.SPARE_BRAND.xdsl) {
      brandFormatted += ` ${element}`;
    }
  });
  return brandFormatted;
};
