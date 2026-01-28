export const isLabeuEnvironment = (hostname = window.location.hostname) =>
  /\.labeu\./.test(hostname);

export const isProdEnvironment = (hostname = window.location.hostname) =>
  /(?:ca|us|eu)\.ovhcloud\.com/.test(hostname);

export const getWillPaymentUrl = () => {
  if (isProdEnvironment()) {
    return '/order/payment/assets/remoteEntry.js';
  }

  return (
    (isLabeuEnvironment() && __WP_LABEU_ENTRY_POINT__) ||
    'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js'
  );
};
