import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItemProps } from '@ovh-ux/muk';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
  ServiceRoutes,
  Universe,
} from '@/common/enum/common.enum';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { useNavigate } from 'react-router-dom';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { goToUpdateRenewFrequencyParams } from '@/domain/utils/helpers';
import { BUTTON_COLOR } from '@ovhcloud/ods-react';

interface DatagridColumnActionsProps {
  readonly serviceName: string;
  readonly mainState: DomainStateEnum;
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

  const billingUrl = goToUpdateRenewFrequencyParams(
    serviceName,
    Universe.DOMAIN,
  );

  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  const actions = useMemo(() => {
    const actionsList: ActionMenuItemProps[] = [
      {
        id: 1,
        'data-testid': 'action-details',
        label: t(`${NAMESPACES.ACTIONS}:see_details`),
        onClick: () => navigate(domainDetailUrl),
      },
    ];

    actionsList.push({
      id: 2,
      'data-testid': 'action-manage-contacts',
      label: t(`${NAMESPACES.CONTACT}:manage_contacts`),
      onClick: () =>
        navigateTo('account', '/contacts/services/edit', {
          serviceName,
          category: Universe.DOMAIN,
          service: serviceName,
          categoryType: Universe.DOMAIN,
        }),
    });

    if (
      !isServiceInfoLoading &&
      serviceInfo?.billing?.renew?.current.mode ===
        ServiceInfoRenewModeEnum.Manual
    ) {
      actionsList.push({
        id: 3,
        'data-testid': 'action-manage-renew-frequency',
        label: t(
          'domain_tab_general_information_subscription_handle_renew_frequency',
        ),
        onClick: () =>
          navigateTo(billingUrl.scope, billingUrl.target, billingUrl.params),
      });
    }

    if (mainState === DomainStateEnum.RESTORABLE) {
      actionsList.push({
        id: 4,
        'data-testid': 'action-restore',
        label: t('domain_action_restore'),
        onClick: () => openModal([serviceName]),
      });
    }

    if (
      !isServiceInfoLoading &&
      !serviceInfo?.billing?.lifecycle?.current?.pendingActions.includes(
        LifecycleCapacitiesEnum.EarlyRenewal,
      ) &&
      mainState !== DomainStateEnum.RESTORABLE
    ) {
      actionsList.push({
        id: 5,
        'data-testid': 'action-renew',
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
        'data-testid': 'action-terminate',
        label: t('domain_action_terminate'),
        color: BUTTON_COLOR.critical,
        onClick: () =>
          navigateTo('billing', '/autorenew/services/resiliate', {
            selectedType: Universe.DOMAIN,
            searchText: serviceName,
            serviceId: serviceInfo?.serviceId,
          }),
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
        'data-testid': 'action-cancel-terminate',
        label: t('domain_action_cancel_terminate'),
        onClick: () =>
          navigateTo('billing', '/autorenew/services/cancel-resiliation', {
            selectedType: Universe.DOMAIN,
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
