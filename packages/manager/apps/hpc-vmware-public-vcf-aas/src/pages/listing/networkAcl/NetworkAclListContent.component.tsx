import {
  Datagrid,
  DataGridTextCell,
  ActionMenu,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { OdsButton, OdsBadge } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BADGE_COLOR,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { subRoutes } from '@/routes/routes.constant';
import {
  useNetworkAclContext,
  NetworkWithStatus,
  NetworkAclStatus,
} from './NetworkAcl.context';
import { useMessageContext } from '@/context/Message.context';
import TEST_IDS from '@/utils/testIds.constants';
import { DEFAULT_ACL_NETWORK } from './NetworkAcl.constant';

const STATUS2COLORS: Record<NetworkAclStatus, ODS_BADGE_COLOR> = {
  CREATING: ODS_BADGE_COLOR.warning,
  ACTIVE: ODS_BADGE_COLOR.success,
  DELETING: ODS_BADGE_COLOR.critical,
};

export default function NetworkAclListContent() {
  const { t } = useTranslation('networkAcl');
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);
  const { t: tStatus } = useTranslation(NAMESPACES.STATUS);

  const {
    networks,
    hasActiveTasks,
    organisationId: id,
    isPending,
  } = useNetworkAclContext();
  const navigate = useNavigate();
  const { addInfo, clearMessage } = useMessageContext();
  const msgUidActiveTaskRef = useRef<number | null>(null);

  const isDefaultAcl =
    networks.length === 1 && networks[0].network === DEFAULT_ACL_NETWORK;

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
                    navigate(
                      `${subRoutes.editNetworkAcl}?${params.toString()}`,
                    );
                  },
                  label: t('managed_vcd_network_acl_ip_action_modify_ip'),
                  'data-testid': `actions-modify-${row.name}`,
                  isDisabled: hasActiveTasks,
                },
                {
                  id: 2,
                  onClick: () => {
                    const params = new URLSearchParams({
                      network: row.network,
                    });
                    navigate(
                      `${subRoutes.deleteNetworkAcl}?${params.toString()}`,
                    );
                  },
                  label: t('managed_vcd_network_acl_ip_action_delete_ip'),
                  color: ODS_BUTTON_COLOR.critical,
                  'data-testid': `actions-delete-${row.name}`,
                  isDisabled: hasActiveTasks || isDefaultAcl,
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
      }) as number;
    } else if (msgUidActiveTaskRef.current !== null) {
      clearMessage(msgUidActiveTaskRef.current);
      msgUidActiveTaskRef.current = null;
    }
  }, [hasActiveTasks]);

  const onCtaClicked = () => {
    if (isDefaultAcl) {
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
        <div className="w-fit mt-4 mb-8">
          <OdsButton
            label={
              isDefaultAcl
                ? t('managed_vcd_network_acl_ip_cta_modify_ip')
                : t('managed_vcd_network_acl_ip_cta_add_ip')
            }
            onClick={onCtaClicked}
            isDisabled={hasActiveTasks}
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
