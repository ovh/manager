import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Tile, Link } from '@ovh-ux/muk';
import { useFormatDate, useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

type ServiceInfo = {
  creation?: string;
  expiration?: string;
  renew?: {
    automatic?: boolean;
    period?: number;
  };
  status?: string;
  serviceId?: number;
  [key: string]: unknown;
};

type BillingTileProps = {
  serviceInfo?: ServiceInfo;
  isLoading?: boolean;
  serviceName?: string;
};

export default function BillingTile({ serviceInfo, isLoading, serviceName }: BillingTileProps) {
  const { t } = useTranslation(['dashboard', 'common']);
  const formatDate = useFormatDate();

  // Get billing URL
  const { data: billingUrl } = useNavigationGetUrl([
    'dedicated',
    '#/billing/history',
    {},
  ]);

  // Format creation date
  const formattedCreationDate = useMemo(() => {
    if (!serviceInfo?.creation) return '-';
    return formatDate({ date: serviceInfo.creation, format: 'PP' });
  }, [serviceInfo?.creation, formatDate]);

  // Format expiration date
  const formattedExpirationDate = useMemo(() => {
    if (!serviceInfo?.expiration) return '-';
    return formatDate({ date: serviceInfo.expiration, format: 'PP' });
  }, [serviceInfo?.expiration, formatDate]);

  // Get renewal status
  const renewalStatus = useMemo(() => {
    if (!serviceInfo) return null;

    const isAutomatic = serviceInfo.renew?.automatic;
    const period = serviceInfo.renew?.period;

    if (isAutomatic && period) {
      return t('dashboard:billing.renewal.automatic', {
        period,
        defaultValue: `Automatic renewal every ${period} month${period > 1 ? 's' : ''}`,
      });
    }

    if (isAutomatic) {
      return t('dashboard:billing.renewal.automatic_generic', {
        defaultValue: 'Automatic renewal',
      });
    }

    return t('dashboard:billing.renewal.manual', {
      defaultValue: 'Manual renewal',
    });
  }, [serviceInfo, t]);

  // Get service status
  const serviceStatus = useMemo(() => {
    if (!serviceInfo?.status) return '-';
    return serviceInfo.status;
  }, [serviceInfo?.status]);

  if (isLoading) {
    return (
      <Tile.Root title={t('dashboard:billing.title', 'Billing')}>
        <Tile.Item.Root>
          <Tile.Item.Description>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
    );
  }

  return (
    <Tile.Root title={t('dashboard:billing.title', 'Billing')}>
      {/* Creation Date */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:billing.creation', 'Creation date')} />
        <Tile.Item.Description>{formattedCreationDate}</Tile.Item.Description>
      </Tile.Item.Root>

      {/* Status */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:billing.status', 'Status')} />
        <Tile.Item.Description>
          <div className="flex flex-col gap-1">
            <span>{serviceStatus}</span>
            {renewalStatus && (
              <span className="text-sm text-gray-600">{renewalStatus}</span>
            )}
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>

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
              {t('dashboard:billing.view_billing', 'View billing')} →
            </Link>
          </Tile.Item.Description>
        </Tile.Item.Root>
      )}
    </Tile.Root>
  );
}

