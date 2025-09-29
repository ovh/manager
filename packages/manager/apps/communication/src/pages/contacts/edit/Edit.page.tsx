import { Drawer, useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { urls } from '@/routes/routes.constant';
import ContactForm from '@/components/contactForm/ContactForm.component';
import { CreateContactMean } from '@/data/types/contact-mean.type';
import {
  useContactMean,
  useRenameContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';

export default function EditContactPage() {
  const navigate = useNavigate();
  const { addSuccess, clearNotifications } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const { contactMeanId } = useParams();
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS, 'common']);

  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/contactMean/edit',
  ]);

  const { data: contactMean, isLoading: isLoadingContactMean } = useContactMean(
    {
      contactMeanId,
      enabled: !!contactMeanId && isAuthorized,
    },
  );

  const formRef = useRef<{ submit: () => void }>(null);
  const { mutate, isPending: isPendingRename } = useRenameContactMean({
    contactMeanId: contactMeanId as string,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('edit_contact_success_message'));
      navigate(urls.ContactsTab);
    },
    onError: (err) => {
      if (err.response?.status === 429) {
        setError(t('error_rate_limit_message', { ns: 'common' }));
      } else {
        setError(t('edit_contact_error_message'));
      }
    },
  });

  const isLoading = isLoadingContactMean || isLoadingAuthorization;
  const onSubmit = (data: CreateContactMean) => {
    if (isPendingRename) return;
    mutate(data.description);
  };

  usePendingRedirect({
    isLoading,
    isAuthorized,
    condition: !!contactMeanId,
    redirectTo: urls.ContactsTab,
  });

  return (
    <Drawer
      heading={t('edit_contact_modal_title')}
      isOpen={true}
      onDismiss={() => navigate(urls.ContactsTab)}
      onSecondaryButtonClick={() => navigate(urls.ContactsTab)}
      onPrimaryButtonClick={() => formRef.current?.submit()}
      secondaryButtonLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      primaryButtonLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      isPrimaryButtonLoading={isPendingRename}
      isLoading={isLoading}
    >
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
      <ContactForm
        contactMean={contactMean}
        onSubmit={onSubmit}
        ref={formRef}
      />
    </Drawer>
  );
}
