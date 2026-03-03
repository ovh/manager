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

  // WillPayment Preprod environment
  const preprodEnvironment =
    'aHR0cHM6Ly9vdmhjbG91ZGNvbWRldi5zdGF0aWMub3ZoLm5ldC9vcmRlci9wYXltZW50L2Fzc2V0cy9yZW1vdGVFbnRyeS5qcw==';
  return atob(preprodEnvironment);
  // return 'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js';
};

exports.isLabeuEnvironment = isLabeuEnvironment;
exports.isProdEnvironment = isProdEnvironment;
exports.getWillPaymentUrl = getWillPaymentUrl;
