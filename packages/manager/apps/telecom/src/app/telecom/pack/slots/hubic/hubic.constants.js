export const HUBIC_LOGIN_URL = 'https://hubic.com/home/';

export const HUBIC_VOUCHER_URL = 'https://hubic.com/home/gift/';

export const buildHubicVoucherURL = (voucher) =>
  `${HUBIC_VOUCHER_URL}?token=${voucher}`;

export default {
  HUBIC_LOGIN_URL,
  HUBIC_VOUCHER_URL,
  buildHubicVoucherURL,
};
