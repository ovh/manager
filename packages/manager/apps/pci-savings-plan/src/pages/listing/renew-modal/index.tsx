import React, { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RenewModal from '@/components/Modal/RenewModal';
import {
  useSavingsPlan,
  useSavingsPlanChangePeriod,
  useServiceId,
} from '@/hooks/useSavingsPlan';
import Errors from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import { SavingsPlanPlanedChangeStatus } from '@/types/api.type';

const RenewModalPage = () => {
  const navigate = useNavigate();
  const { savingsPlanId } = useParams();

  const { data: savingsPlan, isLoading, error, isError } = useSavingsPlan();
  const { mutate: changePeriod } = useSavingsPlanChangePeriod(savingsPlanId);

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  if (isLoading || !savingsPlan) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  const currentPlan = savingsPlan.find((plan) => plan.id === savingsPlanId);
  const periodEndAction = currentPlan.periodEndAction === 'REACTIVATE';

  return (
    <Suspense fallback={<Loading />}>
      <RenewModal
        periodEndAction={currentPlan.periodEndAction}
        onClose={() => navigate('..')}
        onConfirm={() => {
          changePeriod({
            periodEndAction: periodEndAction
              ? SavingsPlanPlanedChangeStatus.TERMINATE
              : SavingsPlanPlanedChangeStatus.REACTIVATE,
          });
          navigate('..');
        }}
      />
    </Suspense>
  );
};

export default RenewModalPage;
