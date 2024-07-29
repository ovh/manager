import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  const currentPlan = savingsPlan?.find((plan) => plan.id === savingsPlanId);
  const periodEndAction = currentPlan?.periodEndAction === 'REACTIVATE';

  const onConfirm = () => {
    changePeriod({
      periodEndAction: periodEndAction
        ? SavingsPlanPlanedChangeStatus.TERMINATE
        : SavingsPlanPlanedChangeStatus.REACTIVATE,
    });
    navigate('..');
  };

  return currentPlan ? (
    <RenewModal
      periodEndAction={currentPlan.periodEndAction}
      onClose={() => navigate('..')}
      onConfirm={onConfirm}
    />
  ) : (
    <></>
  );
};

export default RenewModalPage;
