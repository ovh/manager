import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useManagedVcdDatacentre } from '@/data/hooks/useManagedVcdDatacentres';
import { useUpdateVdcDetails } from '@/data/hooks/useUpdateVcdDatacentre';
import { validateDescription } from '@/utils/formValidation';
import { IVcdDatacentreState } from '@/types/vcd-datacenter.interface';
import { EditDetailModal } from '@/components/modal/EditDetailModal';

export default function EditVdcDescription() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { id, vdcId } = useParams();
  const { data: vcdDatacentre } = useManagedVcdDatacentre(id, vdcId);
  const { updateDetails, error, isError } = useUpdateVdcDetails({
    id,
    vdcId,
    onSuccess: closeModal,
  });

  const currentVdcDetails: IVcdDatacentreState = vcdDatacentre.data.targetSpec;

  return (
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
    />
  );
}
