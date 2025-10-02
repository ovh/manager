import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import {
  Card,
  CARD_COLOR,
  Divider,
  DIVIDER_COLOR,
  DIVIDER_SPACING,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
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
    pendingActions,
    creationDate,
    nicAdmin,
    nicBilling,
    nicTechnical,
    renewalDate,
  } = alldomService;
  const formatDate = useFormatDate();
  return (
    <Card color={CARD_COLOR.neutral} className="w-full p-6">
      <Text preset={TEXT_PRESET.heading4}>
        {t('allDom_detail_page_subscribing_title')}
      </Text>

      <Divider color={DIVIDER_COLOR.primary} spacing={DIVIDER_SPACING._24} />

      <div className="flex items-center justify-between">
        <ServiceDetailSubscribingRenewDate
          expirationDate={expirationDate}
          renewMode={renewMode}
          renewDate={renewalDate}
          pendingActions={pendingActions}
        />

        <ServiceActionMenu
          id={`${currentState.name}-${ActionEnum.OnlyRenew}`}
          serviceName={currentState.name}
          terminateUrl={TERMINATE_URL()}
          pendingActions={pendingActions}
          whichAction={ActionEnum.OnlyRenew}
          cancelTerminateUrl={CANCEL_TERMINATE_URL()}
        />
      </div>

      <Divider color={DIVIDER_COLOR.primary} spacing={DIVIDER_SPACING._24} />

      <ServiceDetailSubscribingRenewMode
        renewMode={renewMode}
        pendingActions={pendingActions}
      />

      <Divider color={DIVIDER_COLOR.primary} spacing={DIVIDER_SPACING._24} />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Text preset={TEXT_PRESET.heading6}>
            {t('allDom_page_detail_subscribing_contact_title')}
          </Text>
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
          pendingActions={pendingActions}
          whichAction={ActionEnum.OnlyContact}
        />
      </div>

      <Divider color={DIVIDER_COLOR.primary} spacing={DIVIDER_SPACING._24} />

      <div className="flex flex-col gap-y-2">
        <Text preset={TEXT_PRESET.heading6}>
          {t('allDom_page_detail_subscribing_contact_creation_date')}
        </Text>
        <Text preset={TEXT_PRESET.span}>
          {formatDate({
            date: creationDate,
            format: 'PP',
          })}
        </Text>
      </div>
    </Card>
  );
}
