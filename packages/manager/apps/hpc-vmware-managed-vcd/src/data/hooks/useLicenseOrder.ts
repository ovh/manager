import {
  useOrderURL,
  getVcdProductSettings,
} from '@ovh-ux/manager-module-order';

const useLicenseOrder = (serviceName: string) => {
  const orderBaseUrl = useOrderURL('express_review_base');
  const vcdProductSettings = getVcdProductSettings(serviceName);
  const licenseOrderLink = `${orderBaseUrl}?products=~(${vcdProductSettings})`;
  const redirectToLicenseOrder = () => {
    window.open(licenseOrderLink, '_blank', 'noopener,noreferrer');
  };

  return { licenseOrderLink, redirectToLicenseOrder };
};

export default useLicenseOrder;
