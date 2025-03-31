export const useOfficeServiceType = (serviceName = '') => {
  const [tenant] = serviceName.split('-');
  return tenant === serviceName ? 'payAsYouGo' : 'prepaid';
};
