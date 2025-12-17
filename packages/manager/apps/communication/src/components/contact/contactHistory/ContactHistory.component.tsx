import { Button, Icon, Text } from '@ovhcloud/ods-react';
import { Drawer } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useFormatDate } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { Contact } from '@/data/types';
import Steps from '@/components/Steps/Steps.component';
import { getCleanEmail } from '@/utils/notifications';
import { urls } from '@/routes/routes.constant';
import './contactHistory.scss';
import AuthLink from '@/components/authLink/AuthLink.component';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

type Props = {
  contacts: Array<Contact>;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function ContactHistory({ contacts, isOpen, onClose }: Props) {
  const { t } = useTranslation('detail');
  const formatDate = useFormatDate();
  const { trackPage, trackClick } = useTracking();

  useEffect(() => {
    if (isOpen) {
      trackPage({
        pageType: PageType.popup,
        pageName: 'view_history-mailings',
        subApp: TrackingSubApps.Communications,
      });
    }
  }, [isOpen]);

  return (
    <Drawer.Root
      isOpen={isOpen}
      onDismiss={() => onClose?.()}
    >
      <Drawer.Header title={t('history_overlay_headline')} />
      <Drawer.Content>
        <div className="contact-history-drawer">
          <Button
            variant="ghost"
            aria-label={t('history_overlay_close')}
            size="sm"
            color="neutral"
            className="-ml-4"
            onClick={onClose}
          >
            <Icon name="xmark" />
          </Button>
          <Text preset="heading-4">{t('history_overlay_headline')}</Text>
          <Text>{t('history_overlay_description')}</Text>
          <AuthLink
            href={urls.routing.listing}
            onClick={() => {
              trackClick({
                location: PageLocation.popup,
                buttonType: ButtonType.link,
                actionType: 'navigation',
                actions: [
                  'view_history-mailings',
                  'access_communication-parameters',
                ],
                subApp: TrackingSubApps.Communications,
              });
            }}
          >
            {t('history_overlay_settings_link')}
          </AuthLink>

          <Steps
            steps={contacts.map((contact) => ({
              isActive: true,
              children: (
                <>
                  <Text preset="paragraph">
                    {formatDate({ date: contact.sentAt, format: 'Pp' })}
                  </Text>
                  <Text preset="paragraph" className="underline">
                    {getCleanEmail(contact.to)}
                  </Text>
                </>
              ),
            }))}
          />
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
