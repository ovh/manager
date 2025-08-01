import { useParams, Link } from 'react-router-dom';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import {
  useFormatDate,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { useState } from 'react';
import { urls } from '@/routes/routes.constant';
import { useNotification } from '@/data/hooks/useNotification/useNotification';
import { getFirstCleanEmail } from '@/utils/notifications';
import NotificationPriorityChip from '@/components/notificationPriorityChip/NotificationPriorityChip.component';
import EmailDisplay from '@/components/emailDisplay/EmailDisplay.component';
import ContactHistory from '@/components/emailDisplay/contactHistory/ContactHistory.component';
import { useAuthorization } from '@/hooks/useAuthorization/useAuthorization';
import ClickLink from '@/components/clickLink/ClickLink.component';

export default function CommunicationsDetailPage() {
  const { notificationId } = useParams();
  const formatDate = useFormatDate();
  const { t } = useTranslation('detail');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/history/get',
  ]);

  const {
    data: notification,
    isLoading: isLoadingNotification,
  } = useNotification({
    notificationId,
    enabled: isAuthorized,
  });

  const isLoading = isLoadingNotification || isLoadingAuthorization;

  return (
    <RedirectionGuard
      route={urls.CommunicationsTab}
      isLoading={isLoading}
      condition={!isAuthorized || notification === undefined}
    >
      {notification !== undefined && (
        <>
          <div className="flex flex-col gap-8 max-w-5xl relative overflow-hidden">
            <div className="flex flex-row justify-start">
              <Link to={urls.CommunicationsTab}>
                <OdsButton
                  variant="ghost"
                  icon="arrow-left"
                  label={t('button_go_back')}
                />
              </Link>
            </div>
            <OdsMessage color="information" isDismissible={false}>
              <OdsText preset="paragraph">
                <Trans
                  i18nKey="history_banner"
                  t={t}
                  components={{
                    anchor: (
                      <ClickLink
                        onClick={() => setShowHistoryDrawer(true)}
                      ></ClickLink>
                    ),
                  }}
                  values={{
                    date: formatDate({
                      date: notification.createdAt,
                      format: 'P',
                    }),
                    email: getFirstCleanEmail(notification.contacts) ?? '...',
                  }}
                />
              </OdsText>
            </OdsMessage>

            <OdsText preset="heading-1">{notification.title}</OdsText>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-6 items-center">
                <OdsText preset="span">
                  Date:{' '}
                  {formatDate({ date: notification.createdAt, format: 'Pp' })}
                </OdsText>
                <NotificationPriorityChip priority={notification.priority} />
              </div>
              {Boolean(notification.categories?.length) && (
                <OdsText preset="paragraph">
                  {notification.categories.join(', ')}
                </OdsText>
              )}
            </div>
            <EmailDisplay
              header={
                notification.attachments.length ? (
                  <OdsButton
                    variant="outline"
                    size="sm"
                    label={t('button_download_attachment')}
                    icon="download"
                  />
                ) : (
                  undefined
                )
              }
              notification={notification}
            />
          </div>
          <ContactHistory
            contacts={notification.contacts}
            isOpen={showHistoryDrawer}
            onClose={() => setShowHistoryDrawer(false)}
          />
        </>
      )}
    </RedirectionGuard>
  );
}
