import { GetEdgeGatewayParams } from '../types';

export const VCD_ORGANIZATION_ROUTE = '/vmwareCloudDirector/organization';

export const getVcdOrganizationRoute = (id: string) => {
  return `${VCD_ORGANIZATION_ROUTE}/${id}`;
};

export const getVcdResetPasswordRoute = (id: string) =>
  `${VCD_ORGANIZATION_ROUTE}/${id}/password`;

// VDC
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

// Vrack
export const getVdcVrackSegmentListRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/vrackSegment`;
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
  return `${getVdcVrackSegmentListRoute(id, vdcId)}/${vrackSegmentId}`;
};

// Edge Gateway
export const getVcdEdgeGatewayListRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/edgeGateway`;
};

export const getVcdEdgeGatewayRoute = ({
  id,
  vdcId,
  edgeGatewayId,
}: GetEdgeGatewayParams) => {
  return `${getVcdEdgeGatewayListRoute(id, vdcId)}/${edgeGatewayId}`;
};

// IP Block
export const getVcdIpBlockListRoute = (id: string) => {
  return `${getVcdOrganizationRoute(id)}/ipblock`;
};
