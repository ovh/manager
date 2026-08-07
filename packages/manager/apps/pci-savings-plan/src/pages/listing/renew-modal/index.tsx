import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import Errors from '@/components/Error/Error';
import RenewModal from '@/components/Modal/RenewModal';
import {
  useSavingsPlan,
  useSavingsPlanChangePeriod,
  useSavingsPlanId,
} from '@/hooks/useSavingsPlan';
import { SavingsPlanPlanedChangeStatus } from '@/types/api.type';

const RenewModalPage = () => {
  const navigate = useNavigate();
  const savingsPlanId = useSavingsPlanId();
  const { data: savingsPlan, error, isError } = useSavingsPlan();
  const { t } = useTranslation('listing');
  const { addSuccess, addError, clearNotifications } = useNotifications();

  const currentPlan = useMemo(
    () => savingsPlan?.find((p) => p.id === savingsPlanId),
    [savingsPlan, savingsPlanId],
  );

  const periodEndAction = currentPlan?.periodEndAction === 'REACTIVATE';

  const onSuccess = () => {
    addSuccess(
      t(periodEndAction ? 'banner_renew_deactivate' : 'banner_renew_activate', {
        planName: currentPlan?.displayName,
        endDate: currentPlan?.endDate,
      }),
    );
  };

  const { mutate: changePeriod, isPending } = useSavingsPlanChangePeriod({
    savingsPlanId,
    onSuccess,
  });

  const [searchParams] = useSearchParams();

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  const goToPrevious = () =>
    navigate({ pathname: '..', search: searchParams.toString() });

  const onConfirm = () => {
    clearNotifications();
    changePeriod(
      {
        periodEndAction: periodEndAction
          ? SavingsPlanPlanedChangeStatus.TERMINATE
          : SavingsPlanPlanedChangeStatus.REACTIVATE,
      },
      {
        onError: (mutationError) =>
          addError(
            t('banner_renew_error', {
              planName: currentPlan?.displayName,
              error: mutationError?.message,
            }),
          ),
        onSettled: () => goToPrevious(),
      },
    );
  };

  return currentPlan ? (
    <RenewModal
      periodEndAction={currentPlan.periodEndAction}
      onClose={() => goToPrevious()}
      onConfirm={onConfirm}
      isPending={isPending}
    />
  ) : (
    <></>
  );
};

export default RenewModalPage;
