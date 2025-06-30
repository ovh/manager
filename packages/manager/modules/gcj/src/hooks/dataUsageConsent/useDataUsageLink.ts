import { Region } from '@ovh-ux/manager-config';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  DEFAULT_SUB_BY_REGION,
  MORE_INFO_LINK,
} from '../../constants/constants';
import { useLink } from '../links/useLinks';

export const useDataUsageInfoLink = (
  subsidiary: OvhSubsidiary,
  region: Region,
) => {
  return useLink(MORE_INFO_LINK, subsidiary || DEFAULT_SUB_BY_REGION[region]);
};
