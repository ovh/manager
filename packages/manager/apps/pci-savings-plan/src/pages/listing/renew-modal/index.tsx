import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Errors from '@/components/Error/Error';
import RenewModal from '@/components/Modal/RenewModal';
import {
  useSavingsPlan,
  useSavingsPlanChangePeriod,
} from '@/hooks/useSavingsPlan';
import { SavingsPlanPlanedChangeStatus } from '@/types/api.type';

const RenewModalPage = () => {
  const navigate = useNavigate();
  const { savingsPlanId } = useParams();

  const { data: savingsPlan, error, isError } = useSavingsPlan();
  const { mutate: changePeriod } = useSavingsPlanChangePeriod(savingsPlanId);
  const [searchParams] = useSearchParams();

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  const currentPlan = savingsPlan?.find((plan) => plan.id === savingsPlanId);
  const periodEndAction = currentPlan?.periodEndAction === 'REACTIVATE';

  const goToPrevious = () =>
    navigate({ pathname: '..', search: searchParams.toString() });

  const onConfirm = () => {
    changePeriod({
      periodEndAction: periodEndAction
        ? SavingsPlanPlanedChangeStatus.TERMINATE
        : SavingsPlanPlanedChangeStatus.REACTIVATE,
    });
    goToPrevious();
  };

  return currentPlan ? (
    <RenewModal
      periodEndAction={currentPlan.periodEndAction}
      onClose={() => goToPrevious()}
      onConfirm={onConfirm}
    />
  ) : (
    <></>
  );
};

export default RenewModalPage;
