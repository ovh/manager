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
  const { addSuccess } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const { contactMeanId } = useParams();
  const { t } = useTranslation('contacts');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);

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
      addSuccess(t('edit_contact_success_message'));
      navigate(urls.ContactsTab);
    },
    onError: () => {
      setError(t('edit_contact_error_message'));
    },
  });

  const isLoading = isLoadingContactMean || isLoadingAuthorization;
  const onSubmit = (data: CreateContactMean) => mutate(data.description);

  usePendingRedirect({
    isLoading,
    isAuthorized,
    condition: !!contactMeanId,
    redirectTo: urls.ContactsTab,
  });

  return (
    <Drawer
      heading="Edit Contact"
      isOpen={true}
      onDismiss={() => navigate(urls.ContactsTab)}
      onSecondaryButtonClick={() => navigate(urls.ContactsTab)}
      onPrimaryButtonClick={() => formRef.current?.submit()}
      secondaryButtonLabel={tActions('cancel')}
      primaryButtonLabel={tActions('validate')}
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
