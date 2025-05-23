export const VCD_ORGANIZATION_ROUTE = '/vmwareCloudDirector/organization';

export const getVcdOrganizationRoute = (id: string) => {
  return `${VCD_ORGANIZATION_ROUTE}/${id}`;
};

export const getVcdResetPasswordRoute = (id: string) =>
  `${VCD_ORGANIZATION_ROUTE}/${id}/password`;

export const getVcdDatacentresRoute = (id: string) => {
  return `${VCD_ORGANIZATION_ROUTE}/${id}/virtualDataCenter`;
};

export const getVcdDatacentreRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentresRoute(id)}/${vdcId}`;
};

export const getVcdDatacentreComputeRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/compute`;
};

export const getVcdDatacentreStorageRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/storage`;
};

export const getVdcOrderableResourceRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/orderableResource`;
};

export const getVdcVrackSegmentListRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentresRoute(id)}/${vdcId}`;
};

export const getVdcVrackSegmentRoute = ({
  id,
  vdcId,
  vrackSegmentId,
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
}) => {
  return `${getVdcVrackSegmentListRoute(
    id,
    vdcId,
  )}/vrackSegment/${vrackSegmentId}`;
};
