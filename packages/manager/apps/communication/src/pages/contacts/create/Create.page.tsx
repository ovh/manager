import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsMessage, OdsText, OdsLink } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ButtonType,
  PageLocation,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Button } from '@ovh-ux/muk';
import { urls } from '@/routes/routes.constant';
import ContactForm from '@/components/contact/contactForm/ContactForm.component';
import { ContactMean, CreateContactMean } from '@/data/types/contact-mean.type';
import {
  useCreateContactMean,
  useRestartValidationContactMean,
  useValidateContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { CreateContactStage } from './Create.constants';
import ContactValidateForm from '@/components/contact/contactValidateForm/contactValidateForm.component';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

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
  ]);

  // IAM tooltip is behind the modal, so we need to check authorization here
  const { isAuthorized: isAuthorizedValidate } = useAuthorization([
    'account:apiovh:notification/contactMean/validate',
  ]);

  const { addSuccess, clearNotifications } = useNotifications();
  const [statusMessage, setStatusMessage] = useState<{
    type: 'danger' | 'success';
    message: string;
  } | null>(null);
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS, 'common']);
  const navigate = useNavigate();
  const { trackPage, trackClick } = useTracking();

  const formRef = useRef<{ submit: () => void }>(null);
  const {
    mutate: createContactMean,
    isPending: isCreatePending,
  } = useCreateContactMean({
    onSuccess: (contactMean) => {
      setCreatedContactMean(contactMean);
      setCurrentStage(CreateContactStage.VALIDAION_PENDING);
    },
    onError: (err) => {
      if (err.response?.status === 429) {
        setStatusMessage({
          type: 'danger',
          message: t('error_rate_limit_message', { ns: 'common' }),
        });
      } else {
        setStatusMessage({
          type: 'danger',
          message: t('add_contact_error_message'),
        });
      }
    },
  });

  const {
    mutate: validateContactMean,
    isPending: isValidatePending,
  } = useValidateContactMean({
    contactMeanId: createdContactMean?.id || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'add_contact_success',
        subApp: TrackingSubApps.Contacts,
      });
      clearNotifications();
      addSuccess(t('add_contact_success_message'));
      navigate(urls.contact.listing);
    },
    onError: (err) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'add_contact_error',
        subApp: TrackingSubApps.Contacts,
      });
      if (err.response?.status === 429) {
        setStatusMessage({
          type: 'danger',
          message: t('error_rate_limit_message', { ns: 'common' }),
        });
      }
    },
  });

  const {
    mutate: restartValidationContactMean,
    isPending: isRestartValidationPending,
  } = useRestartValidationContactMean({
    contactMeanId: createdContactMean?.id || '',
    onError: () => {
      setStatusMessage({
        type: 'danger',
        message: t('restart_validation_contact_error_message'),
      });
    },
    onSuccess: () => {
      setStatusMessage({
        type: 'success',
        message: t('restart_validation_contact_success_message'),
      });
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
    redirectTo: urls.contact.listing,
  });

  const onCancel = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_contact', 'cancel'],
      subApp: TrackingSubApps.Contacts,
    });
    navigate(urls.contact.listing);
  };

  const modalHeading = useMemo(() => {
    switch (currentStage) {
      case CreateContactStage.CREATE:
        return t('add_contact_modal_title');
      case CreateContactStage.VALIDAION_PENDING:
        return t('validation_pending_modal_title');
      case CreateContactStage.VALIDATE:
        return t('verify_contact_modal_title');
      default:
        return t('add_contact_modal_title');
    }
  }, [currentStage, t]);

  const modalPrimaryLabel = useMemo(() => {
    switch (currentStage) {
      case CreateContactStage.CREATE:
        return t('add', { ns: NAMESPACES.ACTIONS });
      case CreateContactStage.VALIDAION_PENDING:
        return t('close', { ns: NAMESPACES.ACTIONS });
      case CreateContactStage.VALIDATE:
        return t('validate', { ns: NAMESPACES.ACTIONS });
      default:
        return t('add', { ns: NAMESPACES.ACTIONS });
    }
  }, [currentStage, t]);

  const modalSecondaryLabel = useMemo(() => {
    switch (currentStage) {
      case CreateContactStage.VALIDAION_PENDING:
        return undefined;
      default:
        return t('cancel', { ns: NAMESPACES.ACTIONS });
    }
  }, [currentStage, t]);

  const modalPrimaryButtonClick = useCallback(() => {
    switch (currentStage) {
      case CreateContactStage.CREATE:
      case CreateContactStage.VALIDATE:
        return formRef.current?.submit();
      case CreateContactStage.VALIDAION_PENDING:
        return navigate(urls.contact.listing);
      default:
        return undefined;
    }
  }, [currentStage, formRef]);

  return (
    <Modal
      heading={modalHeading}
      isOpen={true}
      isLoading={isLoadingAuthorization}
      onDismiss={onCancel}
      primaryLabel={modalPrimaryLabel}
      secondaryLabel={modalSecondaryLabel}
      onSecondaryButtonClick={onCancel}
      onPrimaryButtonClick={modalPrimaryButtonClick}
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
        {statusMessage && (
          <OdsMessage
            color={statusMessage.type as ODS_MESSAGE_COLOR}
            isDismissible={true}
            className="w-full"
            onOdsRemove={() => setStatusMessage(null)}
          >
            {statusMessage.message}
          </OdsMessage>
        )}
        {currentStage === CreateContactStage.CREATE && (
          <ContactForm
            ref={formRef}
            onSubmit={(data) => {
              trackClick({
                location: PageLocation.popup,
                buttonType: ButtonType.button,
                actionType: 'navigation',
                actions: ['add_contact', 'confirm'],
                subApp: TrackingSubApps.Contacts,
              });
              onSubmitCreate(data);
            }}
          />
        )}
        {currentStage === CreateContactStage.VALIDAION_PENDING && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <Trans
                t={t}
                i18nKey="validation_pending_contact_email_info"
                values={{
                  email: createdContactMean?.email,
                }}
              />
            </OdsText>

            <div className="flex flex-col gap-2 items-center">
              <Button
                variant="ghost"
                onClick={() => {
                  restartValidationContactMean();
                }}
              >
                {t('validation_pending_resend_validation_code_label')}
              </Button>
              {isAuthorizedValidate && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentStage(CreateContactStage.VALIDATE);
                  }}
                >
                  {t('validation_pending_validate_contact_label')}
                </Button>
              )}
            </div>
          </>
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
