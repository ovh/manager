export const useOfficeServiceType = (serviceName: string) => {
  const [tenant] = serviceName.split('-');

  return tenant === serviceName ? 'payAsYouGo' : 'prepaid';
};
