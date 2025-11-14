import {
  useVcdDatacentreCompute,
  VCDCompute,
} from '@ovh-ux/manager-module-vcd-api';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subRoutes } from '@/routes/routes.constant';
import { isComputeDeletable } from '@/utils/computeDeletion';

export const useComputeDeletionAccess = (compute: VCDCompute) => {
  const { id, vdcId } = useParams();
  const navigate = useNavigate();
  const { data: computeList } = useVcdDatacentreCompute(id, vdcId);
  const { t } = useTranslation('datacentres/compute');

  const { isDeletable, tooltipTranslationKey } = isComputeDeletable({
    computeList,
    compute,
  });

  const navigateToDeletePage = () => {
    if (!isDeletable) return;
    navigate(`${compute?.id}/${subRoutes.datacentreComputeDelete}`);
  };

  return {
    navigateToDeletePage,
    isDeletionAllowed: isDeletable,
    tooltipLabel: t(tooltipTranslationKey),
  };
};
