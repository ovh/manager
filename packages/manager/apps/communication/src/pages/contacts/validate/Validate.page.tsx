import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useRef, useState } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import {
  useContactMean,
  useValidateContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import ContactValidateForm from '@/components/contact/contactValidateForm/contactValidateForm.component';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

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
  const { trackPage, trackClick } = useTracking();

  const {
    mutate: validateContactMean,
    isPending: isValidatePending,
  } = useValidateContactMean({
    contactMeanId: contactMean?.id || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'enter_validation_code_success',
        subApp: TrackingSubApps.Contacts,
      });
      clearNotifications();
      addSuccess(t('add_contact_success_message'));
      navigate(urls.contact.listing);
    },
    onError: (err) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'enter_validation_code_error',
        subApp: TrackingSubApps.Contacts,
      });
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
    redirectTo: urls.contact.listing,
  });

  return (
    <Modal
      heading={t('verify_contact_modal_title')}
      isOpen={true}
      isLoading={isLoading}
      onDismiss={() => navigate(urls.contact.listing)}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['enter_validation_code', 'cancel'],
          subApp: TrackingSubApps.Contacts,
        });
        navigate(urls.contact.listing);
      }}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['enter_validation_code', 'confirm'],
          subApp: TrackingSubApps.Contacts,
        });
        return formRef.current?.submit();
      }}
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
