import { Button, Drawer, DRAWER_POSITION, DrawerBody, DrawerContent, Icon, ICON_NAME, Text, Link } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
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
    <Drawer open={isOpen}>
      <DrawerContent
        position={DRAWER_POSITION.right}
        className="contact-history-drawer"
        title={t('history_overlay_headline')}
      >
        <DrawerBody className="flex flex-col gap-4">
          <div>
            <Button
              variant="ghost"
              aria-label={t('history_overlay_close')}
              size="sm"
              color="neutral"
              className="-ml-4"
              onClick={onClose}
              >
              <Icon name={ICON_NAME.xmark} />
            </Button>
          </div>
          <Text preset="heading-4">{t('history_overlay_headline')}</Text>
          <Text>{t('history_overlay_description')}</Text>
          <Link
            as={RouterLink}
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
          </Link>

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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
