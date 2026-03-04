import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { Icon, Link, Skeleton, ICON_NAME } from '@ovhcloud/ods-react';
import { Tile, useFormatDate, Text, TEXT_PRESET } from '@ovh-ux/muk';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@/hooks/shell/useNavigationGetUrl';
import { subRoutes, urls } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constant';

const BillingInformationsTile = ({ serviceName }: { serviceName: string }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation([
    'hycu/dashboard',
    NAMESPACES.BILLING,
    NAMESPACES.CONTACT,
    NAMESPACES.DASHBOARD,
  ]);
  const navigate = useNavigate();

  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceName,
  });
  const formatDate = useFormatDate();

  const { data: renewUrl, isLoading: isRenewUrlLoading } = useNavigationGetUrl([
    'dedicated',
    '#/billing/autorenew',
    { searchText: serviceName },
  ]);

  const openTerminateModal = () =>
    navigate(
      urls.dashboard_terminate.replace(subRoutes.serviceName, serviceName),
    );

  return (
    <Tile.Root title={t(`${NAMESPACES.BILLING}:subscription`)}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.BILLING}:automatic_renew`)} />
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Link
              href={(renewUrl as string) ?? '#'}
              className={isRenewUrlLoading ? 'cursor-wait' : ''}
              onClick={() => {
                trackClick(
                  TRACKING.dashboard.autorenewClick(
                    serviceDetails?.data.billing.plan.code,
                  ),
                );
              }}
            >
              {formatDate({
                date: serviceDetails?.data.billing.nextBillingDate,
                format: 'dd MMM yyyy',
              })}
            </Link>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:creation_date`)} />
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text preset={TEXT_PRESET.paragraph} className="block">
              {formatDate({
                date:
                  serviceDetails?.data.billing.lifecycle.current.creationDate,
                format: 'dd MMM yyyy',
              })}
            </Text>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Description>
          <Link
            onClick={() => {
              trackClick(
                TRACKING.dashboard.resiliateClick(
                  serviceDetails?.data.billing.plan.code,
                ),
              );
              openTerminateModal();
            }}
            disabled={serviceDetails?.data.resource.state === 'suspended'}
          >
            <div className="flex items-center">
              <div>{t('hycu_dashboard_link_terminate')}</div>
              <Icon name={ICON_NAME.chevronRight} aria-hidden="true"></Icon>
            </div>
          </Link>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.CONTACT}:contacts`)} />
        <Tile.Item.Description divider={false}>
          <div className="flex flex-col gap-4">
            <div>
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} />
                  ))
                : serviceDetails?.data.customer.contacts.map((contact) => (
                    <Text
                      preset={TEXT_PRESET.span}
                      className="block"
                      key={contact.type}
                    >{`${contact.customerCode} ${t(
                      `${NAMESPACES.CONTACT}:${contact.type}`,
                    )}`}</Text>
                  ))}
            </div>
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default BillingInformationsTile;
