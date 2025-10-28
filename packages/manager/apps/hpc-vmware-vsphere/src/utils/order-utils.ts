export const getHpcVmwareVCsphereExpressOrderLink = ({
  orderBaseUrl,
}: {
  orderBaseUrl: string;
  region: string;
}) => {
  return `${orderBaseUrl}/privateCloud/?selection=~(range~%27vsphere~servicePack~%27vrops-nsxt)#/private-cloud/build?selection=~(range~'premier)`;
};
