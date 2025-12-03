import { type ReactElement, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { useNavigationGetUrl, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Icon, Link, Skeleton, Tile, useFormatDate } from '@ovh-ux/muk';

type ServiceInfo = {
  creation?: string;
  expiration?: string;
  renew?: {
    automatic?: boolean;
    period?: number;
  };
  status?: string;
  serviceId?: number;
  engagedUpTo?: string;
  [key: string]: unknown;
};

type BillingTileProps = {
  serviceInfo?: ServiceInfo;
  isLoading?: boolean;
  serviceName?: string;
  withEngagement?: boolean;
  trackingPrefix?: string;
  trackingPage?: string;
  trackingNameSuffix?: string;
};

export default function BillingTile({
  serviceInfo,
  isLoading,
  // serviceName, // Unused parameter
  withEngagement = false,
  trackingPrefix,
  trackingPage,
  trackingNameSuffix,
}: BillingTileProps) {
  const { t } = useTranslation(['dashboard', 'common', 'billing']);
  const formatDate = useFormatDate();
  const { trackClick } = useOvhTracking();

  // Get billing URLs
  const { data: billingUrl } = useNavigationGetUrl(['dedicated', '#/billing/history', {}]);

  const { data: commitmentUrl } = useNavigationGetUrl([
    'dedicated',
    `#/billing/autorenew/${serviceInfo?.serviceId}/commitment`,
    {},
  ]);

  const { data: autorenewUrl } = useNavigationGetUrl([
    'dedicated',
    `#/billing/autorenew/${serviceInfo?.serviceId}`,
    {},
  ]);

  // Format creation date
  const formattedCreationDate = useMemo(() => {
    if (!serviceInfo?.creation) return '-';
    return formatDate({ date: serviceInfo.creation, format: 'PP' });
  }, [serviceInfo, formatDate]);

  // Format expiration date
  const formattedExpirationDate = useMemo(() => {
    if (!serviceInfo?.expiration) return '-';
    return formatDate({ date: serviceInfo.expiration, format: 'PP' });
  }, [serviceInfo, formatDate]);

  // Get renewal status
  const renewalStatus = useMemo((): string | null => {
    if (!serviceInfo) return null;

    const isAutomatic = serviceInfo.renew?.automatic;
    const period = serviceInfo.renew?.period;

    if (isAutomatic && period) {
      return String(
        t('dashboard:billing.renewal.automatic', {
          period,
          defaultValue: `Automatic renewal every ${period} month${period > 1 ? 's' : ''}`,
        }),
      );
    }

    if (isAutomatic) {
      return String(
        t('dashboard:billing.renewal.automatic_generic', {
          defaultValue: 'Automatic renewal',
        }),
      );
    }

    return String(
      t('dashboard:billing.renewal.manual', {
        defaultValue: 'Manual renewal',
      }),
    );
  }, [serviceInfo, t]);

  // Get service status
  const serviceStatus = useMemo((): string => {
    if (!serviceInfo?.status) return '-';
    return String(serviceInfo.status);
  }, [serviceInfo]);

  // Track action
  const trackAction = (action: string, hasActionInEvent = true) => {
    if (trackingPrefix && trackingPage && trackingNameSuffix) {
      const name = hasActionInEvent
        ? `${trackingPrefix}::tile::link::${action}_${trackingNameSuffix}`
        : `${trackingPrefix}::${action}_${trackingNameSuffix}`;

      trackClick({
        actionType: 'action',
        actions: name.split('::'),
      });
    }
  };

  if (isLoading) {
    return (
      <Tile.Root title={t('dashboard:billing.title', 'Billing')}>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('dashboard:billing.creation', 'Creation date')} />
          <Tile.Item.Description>
            <Skeleton />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('dashboard:billing.status', 'Status')} />
          <Tile.Item.Description>
            <Skeleton />
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tile.Root title={t('dashboard:billing.title', 'Billing') as any}>
      {/* Creation Date */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:billing.creation', 'Creation date')} />
        <Tile.Item.Description>{formattedCreationDate}</Tile.Item.Description>
      </Tile.Item.Root>

      {/* Status */}
      {serviceStatus || renewalStatus ? (
        <Tile.Item.Root>
          <Tile.Item.Term label={String(t('dashboard:billing.status', 'Status'))} />
          <Tile.Item.Description>
            <div className="flex flex-col gap-1">
              <span>{String(serviceStatus)}</span>
              {renewalStatus ? (
                <span className="text-sm text-gray-600">{String(renewalStatus)}</span>
              ) : null}
            </div>
          </Tile.Item.Description>
        </Tile.Item.Root>
      ) : null}

      {/* Engagement */}
      {}
      {
        (withEngagement && serviceInfo ? (
          <Tile.Item.Root>
            <Tile.Item.Term
              label={String(t('billing:engagement.title', 'Engagement', { ns: 'billing' }))}
            />
            <Tile.Item.Description>
              {!serviceInfo.engagedUpTo ? (
                <span className="text-sm">
                  {String(t('billing:engagement.none', 'No engagement', { ns: 'billing' }))}
                </span>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-sm">
                    {String(
                      t('billing:engagement.active', 'Active until {{date}}', {
                        date: formatDate({
                          date: serviceInfo.engagedUpTo,
                          format: 'PP',
                        }),
                        ns: 'billing',
                      }),
                    )}
                  </span>
                  {commitmentUrl && typeof commitmentUrl === 'string' ? (
                    <Link
                      href={commitmentUrl}
                      target="_top"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                      onClick={() => trackAction('go-to-manage-commitment', false)}
                    >
                      <span className="flex items-center gap-1">
                        {String(
                          t('billing:engagement.manage', 'Manage engagement', { ns: 'billing' }),
                        )}
                        <Icon name="arrow-right" />
                      </span>
                    </Link>
                  ) : null}
                </div>
              )}
            </Tile.Item.Description>
          </Tile.Item.Root>
        ) : null) as any
      }

      {/* Autorenew Configuration */}
      {autorenewUrl &&
        typeof autorenewUrl === 'string' &&
        serviceInfo?.renew &&
        !serviceInfo.renew.automatic &&
        serviceInfo.status !== 'expired' && (
          <Tile.Item.Root>
            <Tile.Item.Term
              label={t('billing:autorenew.title', 'Automatic renewal', { ns: 'billing' })}
            />
            <Tile.Item.Description>
              <Link
                href={`${autorenewUrl}/update?serviceId=${serviceInfo.serviceId}`}
                target="_top"
                className="text-primary hover:underline"
                onClick={() => trackAction('renew', true)}
              >
                <span className="flex items-center gap-1">
                  {String(t('billing:autorenew.configure', 'Configure renewal', { ns: 'billing' }))}
                  <Icon name="arrow-right" />
                </span>
              </Link>
            </Tile.Item.Description>
          </Tile.Item.Root>
        )}

      {/* Expiration Date / Next Billing Date */}
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t(
            'dashboard:billing.expiration',
            serviceInfo?.renew?.automatic ? 'Next billing date' : 'Expiration date',
          )}
        />
        <Tile.Item.Description>{formattedExpirationDate}</Tile.Item.Description>
      </Tile.Item.Root>

      {/* Billing Link */}
      {billingUrl && (
        <Tile.Item.Root>
          <Tile.Item.Description>
            <Link
              href={billingUrl as string}
              target="_top"
              className="text-primary hover:underline"
            >
              <span>{String(t('dashboard:billing.view_billing', 'View billing'))} →</span>
            </Link>
          </Tile.Item.Description>
        </Tile.Item.Root>
      )}
    </Tile.Root>
  );
}
