import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { DomainServiceStateEnum } from '@/domain/types/domainResource';

interface DatagridColumnActionsProps {
  readonly serviceName: string;
  readonly mainState: DomainServiceStateEnum;
  readonly openModal: (serviceNames: string[]) => void;
}

export default function DatagridColumnActions({
  serviceName,
  mainState,
  openModal,
}: DatagridColumnActionsProps) {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.ACTIONS,
    NAMESPACES.CONTACT,
  ]);

  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  const { data: contactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services/edit',
    {
      serviceName,
      category: 'DOMAIN',
      service: serviceName,
      categoryType: 'DOMAIN',
    },
  ]);

  const { data: renewFrequencyUrl } = useNavigationGetUrl([
    'billing',
    '/autorenew/services/update',
    { serviceId: serviceName, serviceType: 'DOMAIN' },
  ]);

  const { data: terminateUrl } = useNavigationGetUrl([
    'billing',
    '/autorenew/services/resiliate',
    {
      selectedType: 'DOMAIN',
      searchText: serviceName,
      serviceId: serviceInfo?.serviceId,
    },
  ]);

  const { data: cancelTerminateUrl } = useNavigationGetUrl([
    'billing',
    '/autorenew/services/cancel-resiliation',
    {
      selectedType: 'DOMAIN',
      searchText: serviceName,
      serviceId: serviceInfo?.serviceId,
    },
  ]);

  const actions = useMemo(() => {
    const actionsList: ActionMenuItem[] = [
      {
        id: 1,
        label: t(`${NAMESPACES.ACTIONS}:see_details`),
        href: `/domain/${serviceName}/information`,
      },
    ];

    if (contactUrl) {
      actionsList.push({
        id: 2,
        label: t(`${NAMESPACES.CONTACT}:manage_contacts`),
        href: contactUrl as string,
      });
    }

    if (
      !isServiceInfoLoading &&
      serviceInfo?.billing?.renew?.current.mode ===
        ServiceInfoRenewModeEnum.Manual &&
      renewFrequencyUrl
    ) {
      actionsList.push({
        id: 3,
        label: t(
          'domain_tab_general_information_subscription_handle_renew_frequency',
        ),
        href: renewFrequencyUrl as string,
      });
    }

    if (mainState === DomainServiceStateEnum.RESTORABLE) {
      actionsList.push({
        id: 4,
        label: t('domain_action_restore'),
        onClick: () => openModal([serviceName]),
      });
    }

    if (
      !isServiceInfoLoading &&
      !serviceInfo?.billing?.lifecycle?.current?.pendingActions.includes(
        LifecycleCapacitiesEnum.EarlyRenewal,
      ) &&
      mainState !== DomainServiceStateEnum.RESTORABLE
    ) {
      actionsList.push({
        id: 5,
        label: t('domain_action_early_renewal'),
        onClick: () => openModal([serviceName]),
      });
    }
    if (
      !isServiceInfoLoading &&
      !serviceInfo?.billing?.lifecycle?.current?.pendingActions?.some(
        (action) =>
          [
            LifecycleCapacitiesEnum.Terminate,
            LifecycleCapacitiesEnum.TerminateAtEngagementDate,
            LifecycleCapacitiesEnum.TerminateAtExpirationDate,
          ].includes(action),
      ) &&
      terminateUrl
    ) {
      actionsList.push({
        id: 6,
        label: t('domain_action_terminate'),
        href: terminateUrl as string,
        color: ODS_BUTTON_COLOR.critical,
      });
    }

    if (
      !isServiceInfoLoading &&
      serviceInfo?.billing?.lifecycle?.current?.pendingActions?.some((action) =>
        [
          LifecycleCapacitiesEnum.Terminate,
          LifecycleCapacitiesEnum.TerminateAtEngagementDate,
          LifecycleCapacitiesEnum.TerminateAtExpirationDate,
        ].includes(action),
      ) &&
      cancelTerminateUrl
    ) {
      actionsList.push({
        id: 7,
        label: t('domain_action_cancel_terminate'),
        href: cancelTerminateUrl as string,
      });
    }
    return actionsList;
  }, [
    contactUrl,
    serviceInfo,
    isServiceInfoLoading,
    renewFrequencyUrl,
    terminateUrl,
    cancelTerminateUrl,
    serviceName,
    t,
  ]);

  return (
    <ActionMenu
      id={`domain-actions-menu-${serviceName}`}
      isCompact
      items={actions}
      isLoading={isServiceInfoLoading}
    />
  );
}
