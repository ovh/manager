import { useParams, Link } from 'react-router-dom';
import {
  OdsButton,
  OdsLink,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import {
  useFormatDate,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { useState } from 'react';
import { useAuthorization, useCategories, useHelpLink } from '@/hooks';
import {
  EmailDisplay,
  ClickLink,
  NotificationPriorityChip,
  ContactHistory,
} from '@/components';
import { urls } from '@/routes/routes.constant';
import { useNotification } from '@/data';
import { getFirstCleanEmail } from '@/utils/notifications';

export default function CommunicationsDetailPage() {
  const { notificationId } = useParams();
  const formatDate = useFormatDate();
  const { t } = useTranslation('detail');
  const { t: tCommon } = useTranslation('common');
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
  const helpLink = useHelpLink();

  return (
    <RedirectionGuard
      route={urls.CommunicationsTab}
      isLoading={isLoading}
      condition={!isAuthorized || notification === undefined}
    >
      {notification !== undefined && (
        <>
          <div className="flex flex-col gap-8 max-w-5xl relative overflow-hidden">
            <OdsText>
              <Trans
                i18nKey="description"
                t={tCommon}
                components={{
                  anchor: (
                    <OdsLink
                      href={helpLink}
                      target="_blank"
                      label={tCommon('assistance_link_label')}
                      icon="external-link"
                    />
                  ),
                }}
              />
            </OdsText>
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
                  {tCommon('date_label')}:{' '}
                  {formatDate({ date: notification.createdAt, format: 'Pp' })}
                </OdsText>
                <NotificationPriorityChip priority={notification.priority} />
              </div>
              {Boolean(notification.categories?.length) && (
                <OdsText
                  preset="paragraph"
                  data-testid="notification-categories"
                >
                  {useCategories(tCommon, notification.categories)}
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
