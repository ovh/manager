import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  VCDDatacentreTargetSpec,
  isStatusTerminated,
  useUpdateVdcDetails,
  useVcdDatacentre,
} from '@ovh-ux/manager-module-vcd-api';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';

import { EditDetailModal } from '@/components/modal/EditDetailModal';
import { DisplayStatus } from '@/components/status/DisplayStatus';
import { useMessageContext } from '@/context/Message.context';
import { useDatacentreParams } from '@/hooks/params/useSafeParams';
import { subRoutes } from '@/routes/routes.constant';
import { validateDescription } from '@/utils/formValidation';

export default function EditVdcDescription() {
  const { t } = useTranslation('dashboard');
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const { id, vdcId } = useDatacentreParams();
  const { data: vcdDatacentre, isPending, error } = useVcdDatacentre(id, vdcId);
  const {
    updateDetails,
    error: updateError,
    isPending: isUpdating,
  } = useUpdateVdcDetails({
    id,
    vdcId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_dashboard_edit_description_modal_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [subRoutes.datacentreCompute, subRoutes.datacentreStorage],
      });
      closeModal();
    },
  });

  if (isPending) return <DisplayStatus variant="loading" />;
  if (error) return <DisplayStatus variant="error" error={error} />;

  const currentVdcDetails: VCDDatacentreTargetSpec = vcdDatacentre.data.targetSpec;

  return (
    <RedirectionGuard
      isLoading={false}
      condition={isStatusTerminated(vcdDatacentre.data.resourceStatus)}
      route={'..'}
    >
      <EditDetailModal
        detailValue={vcdDatacentre.data.currentState.description}
        headline={t('managed_vcd_dashboard_edit_description_modal_title')}
        inputLabel={tDashboard('description')}
        errorHelper={t('managed_vcd_dashboard_edit_description_modal_helper_error')}
        validateDetail={validateDescription}
        onCloseModal={closeModal}
        onEdit={(description) =>
          updateDetails({
            id,
            vdcId,
            details: { ...currentVdcDetails, description },
          })
        }
        error={updateError}
        isLoading={isUpdating}
      />
    </RedirectionGuard>
  );
}
