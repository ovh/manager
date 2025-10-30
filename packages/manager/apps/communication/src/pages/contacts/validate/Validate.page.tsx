import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useRef, useState } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';
import {
  useContactMean,
  useValidateContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import ContactValidateForm from '@/components/contactValidateForm/contactValidateForm.component';

export default function ValidateContactPage() {
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS, 'common']);
  const { contactMeanId } = useParams();
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/contactMean/validate',
  ]);

  const { addSuccess, clearNotifications } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const formRef = useRef<{ submit: () => void }>(null);
  const { data: contactMean, isLoading: isLoadingContactMean } = useContactMean(
    {
      contactMeanId,
      enabled: !!contactMeanId && isAuthorized,
    },
  );

  const {
    mutate: validateContactMean,
    isPending: isValidatePending,
  } = useValidateContactMean({
    contactMeanId: contactMean?.id || '',
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('add_contact_success_message'));
      navigate(urls.ContactsTab);
    },
    onError: (err) => {
      if (err.response?.status === 429) {
        setError(t('error_rate_limit_message', { ns: 'common' }));
      } else {
        setError(t('verify_contact_error_message'));
      }
    },
  });

  const onSubmitValidate = (data: { otp: string }) => validateContactMean(data);
  const isLoading = isLoadingContactMean || isLoadingAuthorization;

  usePendingRedirect({
    isLoading: isLoadingAuthorization,
    isAuthorized,
    condition: isAuthorized,
    redirectTo: urls.ContactsTab,
  });

  return (
    <Modal
      heading={t('verify_contact_modal_title')}
      isOpen={true}
      isLoading={isLoading}
      onDismiss={() => navigate(urls.ContactsTab)}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={() => {
        navigate(urls.ContactsTab);
      }}
      onPrimaryButtonClick={() => formRef.current?.submit()}
      isPrimaryButtonLoading={isValidatePending}
    >
      <div className="flex flex-col gap-4 my-4">
        {error && (
          <OdsMessage
            color="danger"
            isDismissible={true}
            className="w-full"
            onOdsRemove={() => setError(null)}
          >
            {error}
          </OdsMessage>
        )}
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="verify_contact_contact_email_info"
            values={{
              email: contactMean?.email,
            }}
          />
        </OdsText>
        <ContactValidateForm ref={formRef} onSubmit={onSubmitValidate} />
      </div>
    </Modal>
  );
}
