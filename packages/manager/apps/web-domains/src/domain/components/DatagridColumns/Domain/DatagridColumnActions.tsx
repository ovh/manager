import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
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
import { DOMAIN } from '@/common/constants';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { useNavigate } from 'react-router-dom';

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
  const domainDetailUrl = useGenerateUrl(urls.domainDetail, 'path', {
    serviceName,
  });

  const navigate = useNavigate();
  const { navigateTo } = useNavigation();

  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  const actions = useMemo(() => {
    const actionsList: ActionMenuItem[] = [
      {
        id: 1,
        label: t(`${NAMESPACES.ACTIONS}:see_details`),
        onClick: () => navigate(domainDetailUrl),
      },
    ];

    actionsList.push({
      id: 2,
      label: t(`${NAMESPACES.CONTACT}:manage_contacts`),
      onClick: () =>
        navigateTo('account', '/contacts/services/edit', {
          serviceName,
          category: DOMAIN,
          service: serviceName,
          categoryType: DOMAIN,
        }),
    });

    if (
      !isServiceInfoLoading &&
      serviceInfo?.billing?.renew?.current.mode ===
        ServiceInfoRenewModeEnum.Manual
    ) {
      actionsList.push({
        id: 3,
        label: t(
          'domain_tab_general_information_subscription_handle_renew_frequency',
        ),
        onClick: () =>
          navigateTo('billing', '/autorenew/services/update', {
            serviceId: serviceName,
            serviceType: DOMAIN,
          }),
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
      )
    ) {
      actionsList.push({
        id: 6,
        label: t('domain_action_terminate'),
        onClick: () =>
          navigateTo('billing', '/autorenew/services/resiliate', {
            selectedType: 'DOMAIN',
            searchText: serviceName,
            serviceId: serviceInfo?.serviceId,
          }),
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
      )
    ) {
      actionsList.push({
        id: 7,
        label: t('domain_action_cancel_terminate'),
        onClick: () =>
          navigateTo('billing', '/autorenew/services/cancel-resiliation', {
            selectedType: DOMAIN,
            searchText: serviceName,
            serviceId: serviceInfo?.serviceId,
          }),
      });
    }
    return actionsList;
  }, [serviceInfo, isServiceInfoLoading, serviceName, t]);

  return (
    <ActionMenu
      id={`domain-actions-menu-${serviceName}`}
      isCompact
      items={actions}
      isLoading={isServiceInfoLoading}
    />
  );
}
