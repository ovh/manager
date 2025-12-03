import React, { useEffect, useRef } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell, Datagrid } from '@ovh-ux/manager-react-components';

import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';

import { DEFAULT_ACL_NETWORK, SERVER_ERROR_MESSAGE } from './NetworkAcl.constant';
import { NetworkAclStatus, NetworkWithStatus, useNetworkAclContext } from './NetworkAcl.context';

const STATUS2COLORS: Record<NetworkAclStatus, ODS_BADGE_COLOR> = {
  CREATING: ODS_BADGE_COLOR.warning,
  ACTIVE: ODS_BADGE_COLOR.success,
  DELETING: ODS_BADGE_COLOR.critical,
};

export default function NetworkAclListContent() {
  const { t } = useTranslation('networkAcl');
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);
  const { t: tStatus } = useTranslation(NAMESPACES.STATUS);
  const { t: tError } = useTranslation(NAMESPACES.ERROR);

  const {
    networks,
    hasActiveTasks,
    organisationId: id,
    isPending,
    isActiveOrganisation,
    isError,
    resourceStatus,
    error,
  } = useNetworkAclContext();

  const navigate = useNavigate();
  const { addInfo, clearMessage, addCritical } = useMessageContext();
  const msgUidActiveTaskRef = useRef<number | null>(null);
  const errorShownRef = useRef<boolean | null>(null);

  const isDefaultAcl = networks.length === 1 && networks[0]?.network === DEFAULT_ACL_NETWORK;
  const hasDisabledActions =
    hasActiveTasks || !isActiveOrganisation || isError || resourceStatus === 'ERROR';

  const columns = [
    {
      id: 'ipName',
      cell: (row: NetworkWithStatus) => {
        return <DataGridTextCell>{row.network}</DataGridTextCell>;
      },
      label: t('managed_vcd_network_acl_ip_name'),
    },
    {
      id: 'authorisation',
      cell: (row: NetworkWithStatus) => {
        return (
          <OdsBadge
            label={t(`managed_vcd_network_acl_status_${row.status}`)}
            color={STATUS2COLORS[row.status]}
          />
        );
      },
      label: tStatus('status'),
    },
    {
      id: 'description',
      cell: (row: NetworkWithStatus) => {
        return <DataGridTextCell>{row.name}</DataGridTextCell>;
      },
      label: tDashboard('description'),
    },

    {
      id: 'actions',
      cell: (row: NetworkWithStatus) => {
        return (
          <div className="flex justify-end">
            <ActionMenu
              items={[
                {
                  id: 1,
                  onClick: () => {
                    const params = new URLSearchParams({
                      network: row.network,
                      description: row.name,
                    });
                    navigate(`${subRoutes.editNetworkAcl}?${params.toString()}`);
                  },
                  label: t('managed_vcd_network_acl_ip_action_modify_ip'),
                  'data-testid': `actions-modify-${row.name}`,
                  isDisabled: hasDisabledActions,
                },
                {
                  id: 2,
                  onClick: () => {
                    const params = new URLSearchParams({
                      network: row.network,
                    });
                    navigate(`${subRoutes.deleteNetworkAcl}?${params.toString()}`);
                  },
                  label: t('managed_vcd_network_acl_ip_action_delete_ip'),
                  color: ODS_BUTTON_COLOR.critical,
                  'data-testid': `actions-delete-${row.name}`,
                  isDisabled: isDefaultAcl || hasDisabledActions,
                },
              ]}
              isCompact
              variant={ODS_BUTTON_VARIANT.ghost}
              icon={ODS_ICON_NAME.ellipsisVertical}
              id={`actions-${row.network}`}
            />
          </div>
        );
      },
      label: '',
    },
  ].filter(Boolean);

  useEffect(() => {
    if (hasActiveTasks) {
      msgUidActiveTaskRef.current = addInfo({
        content: t('managed_vcd_network_acl_operation_ongoing'),
        includedSubRoutes: [id],
      });
    } else if (msgUidActiveTaskRef.current !== null) {
      clearMessage(msgUidActiveTaskRef.current);
      msgUidActiveTaskRef.current = null;
    }
  }, [addInfo, clearMessage, hasActiveTasks, id, t]);

  useEffect(() => {
    if (errorShownRef.current) return;

    if (!(isError || resourceStatus === 'ERROR')) return;

    const message = error?.response?.data?.message || error?.message || SERVER_ERROR_MESSAGE;

    addCritical({
      content: tError('error_message', { message }),
      includedSubRoutes: [`${id}/${subRoutes.networkAcl}`],
    });

    errorShownRef.current = true;
  }, [isError, resourceStatus, error, addCritical, tError, id]);

  const onCtaClicked = () => {
    if (isDefaultAcl && networks[0]) {
      const params = new URLSearchParams({
        network: networks[0].network,
        description: networks[0].name,
      });
      navigate(`${subRoutes.editNetworkAcl}?${params.toString()}`);
    } else {
      navigate(subRoutes.addNetworkAcl);
    }
  };

  return (
    <React.Suspense>
      <section className="px-10" aria-labelledby="datagrid-title">
        <div className="mb-8 mt-4 w-fit">
          <OdsButton
            label={
              isDefaultAcl
                ? t('managed_vcd_network_acl_ip_cta_modify_ip')
                : t('managed_vcd_network_acl_ip_cta_add_ip')
            }
            onClick={onCtaClicked}
            isDisabled={hasDisabledActions}
            data-testid={TEST_IDS.networkAclCta}
          />
        </div>

        <Datagrid
          columns={columns}
          items={networks}
          totalItems={1}
          manualSorting={false}
          isLoading={isPending}
        />
      </section>

      <Outlet />
    </React.Suspense>
  );
}
