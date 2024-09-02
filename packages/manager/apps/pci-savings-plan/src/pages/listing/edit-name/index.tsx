import React, { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import Errors from '@/components/Error/Error';
import { useSavingsPlan, useSavingsPlanEditName } from '@/hooks/useSavingsPlan';
import { REGEX } from '@/utils/savingsPlan';

const EditNamePage = () => {
  const { t } = useTranslation('edit-name');
  const { t: tCreate } = useTranslation('create');

  const navigate = useNavigate();
  const { savingsPlanId } = useParams();

  const { data: savingsPlan, error, isError } = useSavingsPlan();
  const { mutate: editName } = useSavingsPlanEditName(savingsPlanId);

  if (isError || error) {
    return <Errors error={error.message} />;
  }

  const currentPlan = savingsPlan.find((plan) => plan.id === savingsPlanId);

  if (!currentPlan) {
    return <div></div>;
  }

  return (
    <Suspense fallback="">
      <UpdateNameModal
        inputLabel=""
        closeModal={() => navigate('..')}
        defaultValue={currentPlan.displayName}
        updateDisplayName={(displayName) => {
          editName({
            displayName,
          });
          navigate('..');
        }}
        headline={t('title')}
        pattern={REGEX}
        description={t('description')}
        patternMessage={tCreate('input_name_rules')}
      />
      )
    </Suspense>
  );
};

export default EditNamePage;
