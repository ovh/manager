/* global globalThis */

const isLabeuEnvironment = (hostname = window.location.hostname) =>
  /\.labeu\./.test(hostname);

const isProdEnvironment = (hostname = window.location.hostname) =>
  /(?:ca|us|eu)\.ovhcloud\.com/.test(hostname);

const getLabeuEntryPoint = () => {
  const v = globalThis?.__WP_LABEU_ENTRY_POINT__;
  return typeof v === 'string' ? v : '';
};

const getWillPaymentUrl = () => {
  if (isProdEnvironment()) {
    return '/order/payment/assets/remoteEntry.js';
  }

  if (isLabeuEnvironment()) {
    return getLabeuEntryPoint() || '/order/payment/assets/remoteEntry.js';
  }

  return 'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js';
};

exports.isLabeuEnvironment = isLabeuEnvironment;
exports.isProdEnvironment = isProdEnvironment;
exports.getWillPaymentUrl = getWillPaymentUrl;
