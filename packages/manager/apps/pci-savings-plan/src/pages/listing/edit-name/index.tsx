import React, { startTransition, Suspense } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UpdateNameModal,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useSavingsPlan, useSavingsPlanEditName } from '@/hooks/useSavingsPlan';
import { REGEX } from '@/utils/savingsPlan';

const EditNameChildren = () => {
  const { t } = useTranslation(['edit-name', 'listing', 'create']);

  const navigate = useNavigate();
  const { savingsPlanId } = useParams();
  const { addSuccess } = useNotifications();

  const { data: savingsPlan } = useSavingsPlan();
  const { mutate: editName } = useSavingsPlanEditName({
    savingsPlanId,
    onSuccess: () => {
      addSuccess(t('listing:banner_edit_name'));
    },
  });
  const [searchParams] = useSearchParams();

  const currentPlan = savingsPlan?.find((plan) => plan.id === savingsPlanId);

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
          headline={t('edit-name:title')}
          pattern={REGEX}
          description={t('edit-name:description')}
          patternMessage={t('create:input_name_rules')}
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
