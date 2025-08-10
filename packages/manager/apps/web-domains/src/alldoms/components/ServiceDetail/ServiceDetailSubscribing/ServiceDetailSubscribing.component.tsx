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
import { AlldomService } from '@/alldoms/types';
import ServiceDetailSubscribingRenewDate from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing/ServiceDetailSubscribingRenewDate';
import { ActionEnum } from '@/alldoms/enum/service.enum';
import ServiceDetailSubscribingRenewMode from './ServiceDetailSubscribingRenewMode';
import { CANCEL_TERMINATE_URL, TERMINATE_URL } from '@/alldoms/constants';

interface ServiceDetailSubscribingProps {
  readonly alldomService: AlldomService;
}

export default function ServiceDetailSubscribing({
  alldomService,
}: ServiceDetailSubscribingProps) {
  const { t } = useTranslation('allDom');
  const {
    expirationDate,
    renewMode,
    currentState,
    lifecyclePendingActions,
    creationDate,
    nicAdmin,
    nicBilling,
    nicTechnical,
    renewalDate,
  } = alldomService;
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
          expirationDate={expirationDate}
          renewMode={renewMode}
          renewDate={renewalDate}
          lifecyclePendingActions={lifecyclePendingActions}
        />

        <ServiceActionMenu
          id={`${currentState.name}-${ActionEnum.OnlyRenew}`}
          serviceName={currentState.name}
          terminateUrl={TERMINATE_URL()}
          lifecyclePendingActions={lifecyclePendingActions}
          whichAction={ActionEnum.OnlyRenew}
          cancelTerminateUrl={CANCEL_TERMINATE_URL()}
        />
      </div>

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <ServiceDetailSubscribingRenewMode
        renewMode={renewMode}
        lifecyclePendingActions={lifecyclePendingActions}
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
                nic: nicAdmin,
              },
            )}`}</li>
            <li className="list-none">{`${t(
              'allDom_page_detail_subscribing_contact_tech',
              {
                nic: nicTechnical,
              },
            )}`}</li>
            <li className="list-none">{`${t(
              'allDom_page_detail_subscribing_contact_billing',
              {
                nic: nicBilling,
              },
            )}`}</li>
          </ul>
        </div>
        <ServiceActionMenu
          id={`${currentState.name}-${ActionEnum.OnlyContact}`}
          serviceName={currentState.name}
          terminateUrl={TERMINATE_URL()}
          lifecyclePendingActions={lifecyclePendingActions}
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
            date: creationDate,
            format: 'PP',
          })}
        </OdsText>
      </div>
    </OdsCard>
  );
}
