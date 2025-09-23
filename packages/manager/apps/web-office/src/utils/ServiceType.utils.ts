export const ServiceType = (serviceName = '') => {
  const [tenant] = serviceName.split('-');
  return tenant === serviceName ? 'payAsYouGo' : 'prepaid';
};
