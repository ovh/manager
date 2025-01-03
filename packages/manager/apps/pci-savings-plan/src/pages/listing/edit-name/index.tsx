import React, { startTransition, Suspense } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import { useSavingsPlan, useSavingsPlanEditName } from '@/hooks/useSavingsPlan';
import { REGEX } from '@/utils/savingsPlan';

const EditNameChildren = () => {
  const navigate = useNavigate();
  const { savingsPlanId } = useParams();

  const { data: savingsPlan } = useSavingsPlan();
  const { mutate: editName } = useSavingsPlanEditName(savingsPlanId);
  const [searchParams] = useSearchParams();

  const currentPlan = savingsPlan?.find((plan) => plan.id === savingsPlanId);

  const { t } = useTranslation('edit-name');
  const { t: tCreate } = useTranslation('create');

  return (
    <>
      {currentPlan ? (
        <UpdateNameModal
          isOpen
          inputLabel=""
          closeModal={() =>
            navigate({ pathname: '..', search: searchParams.toString() })
          }
          defaultValue={currentPlan?.displayName || ''}
          updateDisplayName={(displayName) => {
            startTransition(() => {
              editName({
                displayName,
              });
              navigate({ pathname: '..', search: searchParams.toString() });
            });
          }}
          headline={t('title')}
          pattern={REGEX}
          description={t('description')}
          patternMessage={tCreate('input_name_rules')}
        />
      ) : (
        <></>
      )}
    </>
  );
};
const EditNamePage = () => {
  return (
    <Suspense fallback="">
      <EditNameChildren />
    </Suspense>
  );
};

export default EditNamePage;
