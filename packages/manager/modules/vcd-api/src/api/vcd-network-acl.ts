import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VCDNetwokAclSpec, VCDNetwokAcl } from '../types';
import { getVcdOrganisationNetworkAcl } from '../utils/apiRoutes';

export const updateNetworkAcl = ({
  id,
  aclId,
  payload,
}: {
  id: string;
  aclId: string;
  payload: VCDNetwokAclSpec;
}): Promise<ApiResponse<VCDNetwokAcl>> =>
  apiClient.v2.put(getVcdOrganisationNetworkAcl(id, aclId), {
    targetSpec: payload,
  });
