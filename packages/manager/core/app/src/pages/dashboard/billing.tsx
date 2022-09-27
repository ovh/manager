import React from 'react';
import { TFunction } from 'react-i18next';
import { Badge } from '@chakra-ui/react';

import { OvhContextShellType } from '@ovh-ux/manager-react-core';
import Environment from '@ovh-ux/manager-config/types/environment';

import {
  BillingContacts,
  BillingData,
  fetchBillingData,
} from '@/api/dashboard/billing';
import { TileTypesEnum } from '@/components/Dashboard';
import {
  SERVICE_STATES,
  getRenew,
  hasDebt,
  isExpired,
  isResiliated,
  shouldHideAutorenewStatus,
} from '@/utils/billingService';
import { computeReadableStringFromDate } from '@/utils/date';

import { computeBillingActions } from './billingActions';

export function computeDashboardBilling(
  serviceName: string,
  t: TFunction<'dashboard', undefined>,
  shell: OvhContextShellType,
  environment: Environment,
  trackingPrefix: string,
): any {
  return {
    onLoad: async () => fetchBillingData(serviceName, shell),
    name: 'billing',
    heading: t('tile_billing_title'),
    type: TileTypesEnum.LIST,
    definitions: [
      {
        name: 'creation_date',
        title: t('tile_billing_item_creation'),
        description: ({ creationDate }: { creationDate: Date }): string =>
          computeReadableStringFromDate(new Date(creationDate)),
      },
      {
        name: 'next_payment_date',
        title: t('tile_billing_item_next_due_date'),
        description: (data: BillingData): JSX.Element => {
          let variant;
          const renew = getRenew(data);
          if (SERVICE_STATES.error.includes(renew)) {
            variant = 'error';
          } else if (SERVICE_STATES.warning.includes(renew)) {
            variant = 'warning';
          } else if (SERVICE_STATES.success.includes(renew)) {
            variant = 'success';
          } else if (SERVICE_STATES.info.includes(renew)) {
            variant = 'info';
          }
          return (
            <>
              <p>{computeReadableStringFromDate(data.nextBillingDate)}</p>
              {hasDebt(data) && (
                <Badge variant="error">
                  {t(`tile_billing_service_status_pending_debt`)}
                </Badge>
              )}
              {shouldHideAutorenewStatus(data) ? (
                isResiliated(data) ? (
                  <Badge variant="error">
                    {t(`tile_billing_service_status_expired`)}
                  </Badge>
                ) : (
                  <span>-</span>
                )
              ) : hasDebt(data) ? null : (
                <Badge variant={variant}>
                  {t(`tile_billing_service_status_${renew}`)}
                </Badge>
              )}
            </>
          );
        },
        actions: (data: BillingData) =>
          computeBillingActions(
            data,
            t,
            environment?.user?.nichandle,
            environment?.user?.ovhSubsidiary,
            trackingPrefix,
            true,
          ),
      },
      {
        hidden: (data: BillingData) => !data.featureContactAvailable,
        name: 'contacts',
        title: t('tile_billing_item_contacts'),
        description: ({ contacts }: { contacts: BillingContacts }) => (
          <>
            <p key={'admin'}>
              {contacts.admin} {t('tile_billing_item_contacts_admin')}
            </p>
            <p key={'tech'}>
              {contacts.tech} {t('tile_billing_item_contacts_tech')}
            </p>
            <p key={'billing'}>
              {contacts.billing} {t('tile_billing_item_contacts_billing')}
            </p>
          </>
        ),
        actions: (data: BillingData) =>
          data.featureContactManagementAvailable &&
          !isExpired(data) && [
            {
              href: data.contactManagemenLink,
              label: t('tile_billing_subscription_contacts_management'),
              trackAction: 'manage-contacts',
            },
          ],
      },
    ],
  };
}
