import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Errors from '@/components/Error/Error';
import EditNameModal from '@/components/Modal/EditNameModal';
import { useSavingsPlan, useSavingsPlanEditName } from '@/hooks/useSavingsPlan';

const EditNamePage = () => {
  const navigate = useNavigate();
  const { savingsPlanId } = useParams();

  const { data: savingsPlan, error, isError } = useSavingsPlan();
  const { mutate: editName } = useSavingsPlanEditName(savingsPlanId);

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  const currentPlan = savingsPlan.find((plan) => plan.id === savingsPlanId);

  return currentPlan ? (
    <EditNameModal
      oldName={currentPlan.displayName}
      onClose={() => navigate('..')}
      onConfirm={(displayName) => {
        editName({
          displayName,
        });
        navigate('..');
      }}
    />
  ) : (
    <></>
  );
};

export default EditNamePage;
