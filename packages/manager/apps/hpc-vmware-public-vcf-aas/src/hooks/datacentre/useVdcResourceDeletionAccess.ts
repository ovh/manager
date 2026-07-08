import {
  useVcdDatacentreCompute,
  useVcdDatacentreStorage,
  VCDCompute,
  VCDStorage,
} from '@ovh-ux/manager-module-vcd-api';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subRoutes } from '@/routes/routes.constant';
import {
  isVdcResourceDeletable,
  VdcResourceDeletionParams,
} from '@/utils/vdcResourceDeletion';

type UseVdcResourceDeletionAccessParams =
  | { type: 'compute'; resource: VCDCompute }
  | { type: 'storage'; resource: VCDStorage };

const TRANSLATION_NAMESPACE = {
  compute: 'datacentres/compute',
  storage: 'datacentres/storage',
} as const;

const DELETE_SUB_ROUTE = {
  compute: subRoutes.datacentreComputeDelete,
  storage: subRoutes.datacentreStorageDelete,
} as const;

export const useVdcResourceDeletionAccess = ({
  type,
  resource,
}: UseVdcResourceDeletionAccessParams) => {
  const { id, vdcId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(TRANSLATION_NAMESPACE[type]);

  const { data: computeList } = useVcdDatacentreCompute({
    id,
    vdcId,
    enabled: type === 'compute',
  });
  const { data: storageList } = useVcdDatacentreStorage({
    id,
    vdcId,
    enabled: type === 'storage',
  });

  const { isDeletable, tooltipTranslationKey } = isVdcResourceDeletable({
    type,
    resourceList: type === 'compute' ? computeList : storageList,
    resource,
  } as VdcResourceDeletionParams);

  const navigateToDeletePage = () => {
    if (!isDeletable) return;
    navigate(`${resource?.id}/${DELETE_SUB_ROUTE[type]}`);
  };

  return {
    navigateToDeletePage,
    isDeletionAllowed: isDeletable,
    tooltipLabel: t(tooltipTranslationKey),
  };
};
