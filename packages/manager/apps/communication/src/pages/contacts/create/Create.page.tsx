import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsMessage, OdsText, OdsLink } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useRef, useState } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';
import ContactForm from '@/components/contactForm/ContactForm.component';
import { ContactMean, CreateContactMean } from '@/data/types/contact-mean.type';
import {
  useCreateContactMean,
  useRestartValidationContactMean,
  useValidateContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { CreateContactStage } from './Create.constants';
import ContactValidateForm from '@/components/contactValidateForm/contactValidateForm.component';

export default function CreateContactPage() {
  const [currentStage, setCurrentStage] = useState<CreateContactStage>(
    CreateContactStage.CREATE,
  );
  const [
    createdContactMean,
    setCreatedContactMean,
  ] = useState<ContactMean | null>(null);

  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/contactMean/create',
    'account:apiovh:notification/contactMean/validate',
  ]);

  const { addSuccess } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('contacts');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();

  const formRef = useRef<{ submit: () => void }>(null);
  const {
    mutate: createContactMean,
    isPending: isCreatePending,
  } = useCreateContactMean({
    onSuccess: (contactMean) => {
      setCreatedContactMean(contactMean);
      setCurrentStage(CreateContactStage.VALIDATE);
    },
    onError: () => {
      setError(t('add_contact_error_message'));
    },
  });

  const {
    mutate: validateContactMean,
    isPending: isValidatePending,
  } = useValidateContactMean({
    contactMeanId: createdContactMean?.id || '',
    onSuccess: () => {
      addSuccess(t('add_contact_success_message'));
      navigate(urls.ContactsTab);
    },
  });

  const {
    mutate: restartValidationContactMean,
    isPending: isRestartValidationPending,
  } = useRestartValidationContactMean({
    contactMeanId: createdContactMean?.id || '',
    onError: () => {
      setError(t('restart_validation_contact_error_message'));
    },
  });

  const onSubmitCreate = (data: CreateContactMean) => createContactMean(data);
  const onSubmitValidate = (data: { otp: string }) => validateContactMean(data);

  const isPending =
    isCreatePending || isValidatePending || isRestartValidationPending;

  usePendingRedirect({
    isLoading: isLoadingAuthorization,
    isAuthorized,
    condition: isAuthorized,
    redirectTo: urls.ContactsTab,
  });

  return (
    <Modal
      heading={
        currentStage === CreateContactStage.CREATE
          ? t('add_contact_modal_title')
          : t('verify_contact_modal_title')
      }
      isOpen={true}
      isLoading={isLoadingAuthorization}
      onDismiss={() => navigate(urls.ContactsTab)}
      primaryLabel={
        currentStage === CreateContactStage.CREATE
          ? tActions('add')
          : tActions('validate')
      }
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={() => {
        navigate(urls.ContactsTab);
      }}
      onPrimaryButtonClick={() => formRef.current?.submit()}
      isPrimaryButtonLoading={isPending}
    >
      <div className="flex flex-col gap-4 my-4">
        {currentStage === CreateContactStage.CREATE && (
          <OdsMessage
            color="information"
            isDismissible={false}
            className="w-full"
          >
            {t('add_contact_modal_info')}
          </OdsMessage>
        )}
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
        {currentStage === CreateContactStage.CREATE && (
          <ContactForm ref={formRef} onSubmit={onSubmitCreate} />
        )}
        {currentStage === CreateContactStage.VALIDATE && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <Trans
                t={t}
                i18nKey="verify_contact_contact_email_info"
                values={{
                  email: createdContactMean?.email,
                }}
              />
            </OdsText>
            <ContactValidateForm ref={formRef} onSubmit={onSubmitValidate} />
            <div className="flex flex-row justify-center my-4">
              <OdsLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  restartValidationContactMean();
                  return false;
                }}
                label={t('verify_contact_link_label')}
              />
            </div>
            <OdsMessage
              color="information"
              isDismissible={false}
              className="w-full"
            >
              {t('verify_contact_info')}
            </OdsMessage>
          </>
        )}
      </div>
    </Modal>
  );
}
