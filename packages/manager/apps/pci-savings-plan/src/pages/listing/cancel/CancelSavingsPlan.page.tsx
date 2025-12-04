import React, { FC } from 'react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  useSavingsPlan,
  useSavingsPlanId,
  useServiceId,
  useCancelSavingsPlan,
} from '@/hooks/useSavingsPlan';

const CancelSavingsPlan: FC = () => {
  const { t } = useTranslation('actions');
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const serviceId = useServiceId();
  const savingsPlanId = useSavingsPlanId();
  const { addSuccess, addError } = useNotifications();

  const { refetch } = useSavingsPlan();
  const { mutate: cancelSavingsPlan, isPending } = useCancelSavingsPlan();

  const handleClose = () =>
    navigate({ pathname: '..', search: urlSearchParams.toString() });

  const handleCancelSavingsPlan = () => {
    cancelSavingsPlan(
      { serviceId, savingsPlanId },
      {
        onSuccess: async () => {
          await refetch();
          addSuccess(t('cancel_savings_plan_success'));
        },
        onError: (error) =>
          addError(
            t('cancel_savings_plan_error', {
              error: error?.message,
            }),
          ),
        onSettled: () => handleClose(),
      },
    );
  };

  return (
    <OdsModal onOdsClose={handleClose} isOpen>
      <OdsText preset="heading-3">
        {t('cancel_savings_plan_modal_title')}
      </OdsText>
      <div className="mt-8 flex gap-x-4" slot="actions">
        <OdsButton
          label={t('close_modal')}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={handleClose}
          role="button"
          aria-label={t('close_modal')}
        />
        <OdsButton
          isLoading={isPending}
          label={t('confirm')}
          onClick={handleCancelSavingsPlan}
          role="button"
          aria-label={t('confirm')}
        />
      </div>
    </OdsModal>
  );
};

export default CancelSavingsPlan;
