import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Skeleton, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useGetDomainContact,
  useGetDomainResource,
} from '@/domain/hooks/data/query';
import Contacts from './Contacts';
import { ServiceRoutes, Universe } from '@/common/enum/common.enum';
import { domainIsPremium } from '@/domain/constants/susbcriptions';
import CreationDate from './CreationDate';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';
import RenewModeItemTile from '@/common/components/SubscriptionCard/RenewModeTileItem';
import RenewFrequencyTileItem from '@/common/components/SubscriptionCard/RenewFrequencyTileItem';
import ExpirationDate from './ExpirationDate';

interface SubscriptionCardsProps {
  readonly serviceName: string;
}

export default function SubscriptionCards({
  serviceName,
}: SubscriptionCardsProps) {
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );
  const { isServiceInfoLoading, serviceInfo } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  const {
    domainContact,
    isFetchingDomainContact,
  } = useGetDomainContact(
    domainResource?.currentState?.contactsConfiguration.contactOwner.id,
    { enabled: true },
  );

  const { t } = useTranslation([
    'domain',
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
    NAMESPACES.CONTACT,
  ]);

  if (isFetchingDomainResource || isServiceInfoLoading) {
    return (
      <ManagerTile>
        <ManagerTile.Title>
          {t(`${NAMESPACES.BILLING}:subscription`)}
        </ManagerTile.Title>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>
            {t(`${NAMESPACES.DASHBOARD}:creation_date`)}
          </ManagerTile.Item.Label>
          <Skeleton />
        </ManagerTile.Item>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>
            {t('domain_tab_general_information_subscription_expiration_date')}
          </ManagerTile.Item.Label>
          <Skeleton />
        </ManagerTile.Item>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>
            {t('domain_tab_general_information_subscription_renew_frequency')}
            <CircleQuestionTooltip
              translatedMessage={t(
                'domain_tab_general_information_tooltip_domain_state',
              )}
            />
          </ManagerTile.Item.Label>
          <Skeleton />
        </ManagerTile.Item>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>
            {t(`${NAMESPACES.CONTACT}:contacts`)}
          </ManagerTile.Item.Label>
          <Skeleton />
        </ManagerTile.Item>
      </ManagerTile>
    );
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t(`${NAMESPACES.BILLING}:subscription`)}
      </ManagerTile.Title>
      <ManagerTile.Divider />
      <CreationDate domainResources={domainResource} />
      <ManagerTile.Divider />
      <ExpirationDate
        date={serviceInfo.billing?.expirationDate}
        serviceName={serviceName}
        isFetchingDomainResources={isFetchingDomainResource}
      />
      <ManagerTile.Divider />
      <RenewModeItemTile
        renewMode={serviceInfo.billing.renew.current.mode}
        pendingActions={serviceInfo.billing.lifecycle.current.pendingActions}
        serviceName={serviceName}
        isDomainPage={true}
        universe={Universe.DOMAIN}
      />
      <ManagerTile.Divider />
      <RenewFrequencyTileItem
        mode={serviceInfo.billing.renew.current.mode}
        period={serviceInfo.billing.renew.current.period}
        serviceName={serviceName}
        isDomainPage={true}
        universe={Universe.DOMAIN}
      />
      <ManagerTile.Divider />
      <Contacts
        domainResource={domainResource}
        serviceName={serviceName}
        domainContact={domainContact}
        isFetchingDomainContact={isFetchingDomainContact}
      />
      {domainIsPremium(serviceInfo.billing?.pricing?.pricingMode) && (
        <>
          <ManagerTile.Divider />
          <ManagerTile.Item>
            <ManagerTile.Item.Label>
              {t('domain_tab_general_information_subscription_premium')}
              <CircleQuestionTooltip
                translatedMessage={t(
                  'domain_tab_general_information_subscription_premium_tooltip',
                )}
              />
            </ManagerTile.Item.Label>
            <Text>
              {t('domain_tab_general_information_subscription_premium_value')}
            </Text>
          </ManagerTile.Item>
        </>
      )}
    </ManagerTile>
  );
}
