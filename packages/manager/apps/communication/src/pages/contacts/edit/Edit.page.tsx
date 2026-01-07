import { useNotifications } from '@ovh-ux/manager-react-components';
import { Drawer } from '@ovh-ux/muk';
import { Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
import { useNavigate, useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import {
  ButtonType,
  PageLocation,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import ContactForm from '@/components/contact/contactForm/ContactForm.component';
import { CreateContactMean } from '@/data/types/contact-mean.type';
import {
  useContactMean,
  useRenameContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { useAuthorization, usePendingRedirect } from '@/hooks';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

export default function EditContactPage() {
  const navigate = useNavigate();
  const { addSuccess, clearNotifications } = useNotifications();
  const [error, setError] = useState<string | null>(null);
  const { contactMeanId } = useParams();
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS, 'common']);
  const { trackPage, trackClick } = useTracking();

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
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'rename_contact_success',
        subApp: TrackingSubApps.Contacts,
      });
      clearNotifications();
      addSuccess(t('edit_contact_success_message'));
      navigate(urls.contact.listing);
    },
    onError: (err) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'rename_contact_error',
        subApp: TrackingSubApps.Contacts,
      });
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
    redirectTo: urls.contact.listing,
  });

  return (
    <Drawer.Root
      isOpen={true}
      onDismiss={() => navigate(urls.contact.listing)}
      isLoading={isLoading}
    >
      <Drawer.Header title={t('edit_contact_modal_title')} />
      <Drawer.Content>
      {error && (
        <Message
          color="critical"
          dismissible={true}
          className="w-full"
          onRemove={() => setError(null)}
        >
          <MessageIcon name="triangle-exclamation" />
          <MessageBody>{error}</MessageBody>
        </Message>
      )}
      <ContactForm
        contactMean={contactMean}
        onSubmit={onSubmit}
        ref={formRef}
      />
      </Drawer.Content>
      <Drawer.Footer
        primaryButton={{
          label: t('validate', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['rename_contact', 'confirm'],
              subApp: TrackingSubApps.Contacts,
            });
            return formRef.current?.submit();
          },
          isLoading: isPendingRename,
        }}
        secondaryButton={{
          label: t('cancel', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['rename_contact', 'cancel'],
              subApp: TrackingSubApps.Contacts,
            });
            navigate(urls.contact.listing);
          },
        }}
      />
    </Drawer.Root>
  );
}
