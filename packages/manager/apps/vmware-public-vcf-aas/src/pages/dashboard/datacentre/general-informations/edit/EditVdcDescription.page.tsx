import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  isStatusTerminated,
  useUpdateVdcDetails,
  useVcdDatacentre,
  VCDDatacentreTargetSpec,
} from '@ovh-ux/manager-module-vcd-api';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { validateDescription } from '@/utils/formValidation';
import { EditDetailModal } from '@/components/modal/EditDetailModal';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';

export default function EditVdcDescription() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const { id, vdcId } = useParams();
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const { updateDetails, error, isError, isPending } = useUpdateVdcDetails({
    id,
    vdcId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_dashboard_edit_description_modal_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
  });

  const currentVdcDetails: VCDDatacentreTargetSpec =
    vcdDatacentre.data.targetSpec;

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={isStatusTerminated(vcdDatacentre?.data?.resourceStatus)}
      route={'..'}
    >
      <EditDetailModal
        detailValue={vcdDatacentre?.data?.currentState?.description}
        headline={t('managed_vcd_dashboard_edit_description_modal_title')}
        inputLabel={t('managed_vcd_dashboard_edit_description_modal_label')}
        errorHelper={t(
          'managed_vcd_dashboard_edit_description_modal_helper_error',
        )}
        validateDetail={validateDescription}
        onCloseModal={closeModal}
        onEdit={(description) =>
          updateDetails({
            id,
            vdcId,
            details: { ...currentVdcDetails, description },
          })
        }
        error={isError ? error : null}
        isLoading={isPending}
      />
    </RedirectionGuard>
  );
}
