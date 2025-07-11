import {
  ODS_CARD_COLOR,
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import ServiceActionMenu from '@/alldoms/components/ActionMenu/ServiceActionMenu';
import { TServiceDetail } from '@/alldoms/types';
import ServiceDetailSubscribingRenewDate from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing/ServiceDetailSubscribingRenewDate';
import { ActionEnum } from '@/alldoms/enum/service.enum';
import ServiceDetailSubscribingRenewMode from './ServiceDetailSubscribingRenewMode';

interface ServiceDetailSubscribingProps {
  readonly serviceInfoDetail: TServiceDetail;
}

export default function ServiceDetailSubscribing({
  serviceInfoDetail,
}: ServiceDetailSubscribingProps) {
  const { t } = useTranslation('allDom');
  const { billing, serviceId } = serviceInfoDetail.serviceInfo;
  const formatDate = useFormatDate();
  return (
    <OdsCard color={ODS_CARD_COLOR.neutral} className="w-full p-6">
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('allDom_detail_page_subscribing_title')}
      </OdsText>

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <div className="flex items-center justify-between">
        <ServiceDetailSubscribingRenewDate
          expirationDate={serviceInfoDetail.serviceInfo.billing.expirationDate}
          renewMode={serviceInfoDetail.serviceInfo.billing.renew.current.mode}
          renewDate={
            serviceInfoDetail.serviceInfo.billing.renew.current.nextDate
          }
          serviceState={serviceInfoDetail.allDomResourceState}
        />

        <ServiceActionMenu
          serviceId={`${serviceId}-subscribe`}
          serviceName={serviceInfoDetail.allDomResource.currentState.name}
          terminateUrl={'terminate'}
          allDomResourceState={serviceInfoDetail.allDomResourceState}
          whichAction={ActionEnum.OnlyRenew}
        />
      </div>

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <ServiceDetailSubscribingRenewMode
        renewMode={serviceInfoDetail.serviceInfo.billing.renew.current.mode}
        serviceState={serviceInfoDetail.allDomResourceState}
      />

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <OdsText preset={ODS_TEXT_PRESET.heading6}>
            {t('allDom_page_detail_subscribing_contact_title')}
          </OdsText>
          <ul className="flex flex-col gap-y-2 p-0 m-0 text-[var(--ods-color-text)]">
            <li className="list-none">{`${t(
              'allDom_page_detail_subscribing_contact_admin',
              {
                t0: serviceInfoDetail.nicAdmin,
              },
            )}`}</li>
            <li className="list-none">{`${t(
              'allDom_page_detail_subscribing_contact_tech',
              {
                t0: serviceInfoDetail.nicTechnical,
              },
            )}`}</li>
            <li className="list-none">{`${t(
              'allDom_page_detail_subscribing_contact_billing',
              {
                t0: serviceInfoDetail.nicBilling,
              },
            )}`}</li>
          </ul>
        </div>
        <ServiceActionMenu
          serviceId={`${serviceId}-contact`}
          serviceName={serviceInfoDetail.allDomResource.currentState.name}
          terminateUrl={'terminate'}
          allDomResourceState={serviceInfoDetail.allDomResourceState}
          whichAction={ActionEnum.OnlyContact}
        />
      </div>

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <div className="flex flex-col gap-y-2">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('allDom_page_detail_subscribing_contact_creation_date')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {formatDate({
            date: billing.lifecycle.current.creationDate,
            format: 'PP',
          })}
        </OdsText>
      </div>
    </OdsCard>
  );
}
