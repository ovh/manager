import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button, Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';
import { LinkType, Link as ManagerLink, useFormatDate, RedirectionGuard } from '@ovh-ux/muk';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useAuthorization, useCategories, useHelpLink } from '@/hooks';
import {
  EmailDisplay,
  NotificationPriorityChip,
  ContactHistory,
} from '@/components';
import { urls } from '@/routes/routes.constant';
import { useNotification } from '@/data';
import { getFirstCleanEmail } from '@/utils/notifications';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

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
  const { trackClick } = useTracking();

  return (
    <RedirectionGuard
      route={urls.communication.listing}
      isLoading={isLoading}
      condition={!isAuthorized || notification === undefined}
    >
      {notification !== undefined && (
        <>
          <div className="flex flex-col gap-8 max-w-5xl relative overflow-hidden">
            <Text>
              <Trans
                i18nKey="description"
                t={tCommon}
                components={{
                  anchor: (
                    <ManagerLink
                      href={helpLink}
                      target="_blank"
                      children={tCommon('assistance_link_label')}
                      type={LinkType.external}
                    />
                  ),
                }}
              />
            </Text>
            <div className="flex flex-row justify-start">
              <RouterLink to={urls.communication.listing}>
                <Button
                  variant="ghost"
                  onClick={() =>
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.link,
                      actionType: 'navigation',
                      actions: ['go-back-communications-listing'],
                      subApp: TrackingSubApps.Communications,
                    })
                  }
                >
                  <Icon name="arrow-left" />
                  {t('button_go_back')}
                </Button>
              </RouterLink>
            </div>
            <Message color="information" dismissible={false}>
              <MessageIcon name="circle-info" />
              <MessageBody>
                <Trans
                  i18nKey="history_banner"
                  t={t}
                  components={{
                    anchor: (
                      <Link
                        onClick={() => {
                          trackClick({
                            location: PageLocation.page,
                            buttonType: ButtonType.link,
                            actionType: 'navigation',
                            actions: ['view_history-mailings'],
                            subApp: TrackingSubApps.Communications,
                          });
                          setShowHistoryDrawer(true);
                        }}
                      ></Link>
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
              </MessageBody>
            </Message>

            <Text preset="heading-1">{notification.title}</Text>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-6 items-center">
                <Text preset="span">
                  {tCommon('date_label')}:{' '}
                  {formatDate({ date: notification.createdAt, format: 'Pp' })}
                </Text>
                <NotificationPriorityChip priority={notification.priority} />
              </div>
              {Boolean(notification.categories?.length) && (
                <Text
                  preset="paragraph"
                  data-testid="notification-categories"
                >
                  {useCategories(tCommon, notification.categories)}
                </Text>
              )}
            </div>
            <EmailDisplay
              header={
                notification.attachments.length ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      trackClick({
                        location: PageLocation.page,
                        buttonType: ButtonType.button,
                        actionType: 'download',
                        actions: ['download_subject-file'],
                        subApp: TrackingSubApps.Communications,
                      });
                    }}
                  >
                    <Icon name="download" />
                    {t('button_download_attachment')}
                  </Button>
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
