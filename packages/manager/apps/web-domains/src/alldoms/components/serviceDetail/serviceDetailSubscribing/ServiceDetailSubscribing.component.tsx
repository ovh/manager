import { useTranslation } from 'react-i18next';
import { ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import ServiceActionMenu from '@/alldoms/components/actionMenu/ServiceActionMenu';
import { AlldomService } from '@/alldoms/types';
import ServiceDetailSubscribingRenewDate from '@/alldoms/components/serviceDetail/serviceDetailSubscribing/ServiceDetailSubscribingRenewDate';
import { ActionEnum } from '@/alldoms/enum/service.enum';
import { CANCEL_TERMINATE_URL, TERMINATE_URL } from '@/alldoms/constants';
import RenewModeItemTile from '@/common/components/SubscriptionCard/RenewModeTileItem';
import RenewFrequencyTileItem from '@/common/components/SubscriptionCard/RenewFrequencyTileItem';
import { Universe } from '@/common/enum/common.enum';

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
    <div>
      <ManagerTile>
        <ManagerTile.Title>
          {t('allDom_detail_page_subscribing_title')}
        </ManagerTile.Title>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>
            {t('allDom_page_detail_subscribing_contact_creation_date')}
          </ManagerTile.Item.Label>
          <Text>
            {formatDate({
              date: creationDate,
              format: 'PP',
            })}
          </Text>
        </ManagerTile.Item>
        <ManagerTile.Divider />
        <ManagerTile.Item>
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
        </ManagerTile.Item>
        <ManagerTile.Divider />
        <RenewModeItemTile
          serviceName={currentState.name}
          universe={Universe.ALL_DOM}
        />
        <ManagerTile.Divider />
        <RenewFrequencyTileItem
          serviceName={currentState.name}
          universe={Universe.ALL_DOM}
        />
        <ManagerTile.Divider />
        <ManagerTile.Item>
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
        </ManagerTile.Item>
      </ManagerTile>
    </div>
  );
}
