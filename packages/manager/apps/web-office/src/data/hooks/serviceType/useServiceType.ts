export const useServiceType = (serviceName = '') => {
  const [tenant] = serviceName.split('-');
  return tenant === serviceName ? 'payAsYouGo' : 'prepaid';
};
