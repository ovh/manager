import React from 'react';
import { ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';
import {
  Icon,
  ICON_NAME,
  Skeleton,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useGetDomainContact,
  useGetDomainResource,
  useGetServiceInformation,
} from '@/domain/hooks/data/query';
import Contacts from './Contacts';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { domainIsPremium } from '@/domain/constants/susbcriptions';
import CreationDate from './CreationDate';
import RenewFrequency from './RenewFrequency';

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
    serviceName,
    ServiceRoutes.Domain,
  );

  const { domainContact, isFetchingDomainContact } = useGetDomainContact(
    domainResource?.currentState?.contactsConfiguration.contactOwner.id,
  );

  const formatDate = useFormatDate();

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
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
              </TooltipTrigger>
              <TooltipContent>
                {t('domain_tab_general_information_tooltip_domain_state')}
              </TooltipContent>
            </Tooltip>
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
      <CreationDate
        domainResources={domainResource}
        isFetchingDomainResources={isFetchingDomainResource}
        serviceName={serviceName}
      />
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_tab_general_information_subscription_expiration_date')}
        </ManagerTile.Item.Label>
        <Text>{formatDate({ date: serviceInfo.billing?.expirationDate })}</Text>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <RenewFrequency serviceInfo={serviceInfo} serviceName={serviceName} />
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
                </TooltipTrigger>
                <TooltipContent>
                  {t(
                    'domain_tab_general_information_subscription_premium_tooltip',
                  )}
                </TooltipContent>
              </Tooltip>
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
