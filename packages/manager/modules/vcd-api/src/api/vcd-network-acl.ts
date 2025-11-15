import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VCDNetworkAclSpec, VCDNetworkAcl } from '../types';
import { getVcdOrganisationNetworkAcl } from '../utils/apiRoutes';

export const updateNetworkAcl = ({
  id,
  aclId,
  payload,
}: {
  id: string;
  aclId: string;
  payload: VCDNetworkAclSpec;
}): Promise<ApiResponse<VCDNetworkAcl>> =>
  apiClient.v2.put(getVcdOrganisationNetworkAcl(id, aclId), {
    targetSpec: payload,
  });
