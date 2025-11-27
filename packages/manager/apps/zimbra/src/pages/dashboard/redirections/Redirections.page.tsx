import React from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { BadgeStatus } from '@/components';
import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl, useOverridePage } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButton from './ActionButton.component';
import { RedirectionItem } from './Redirections.types';

const items: RedirectionItem[] = [
  {
    status: ResourceStatus.ERROR,
    from: 'from@example.com',
    to: 'to@example.com',
    organization: 'Test Organization',
    id: '1',
  },
  {
    status: ResourceStatus.READY,
    from: 'from@example.com',
    to: 'to2@example.com',
    organization: 'Test Organization',
    id: '2',
  },
];

const columns: DatagridColumn<RedirectionItem>[] = [
  {
    id: 'from',
    accessorKey: 'from',
    label: 'zimbra_redirections_from',
  },
  {
    id: 'to',
    accessorKey: 'to',
    label: 'zimbra_redirections_to',
  },
  {
    id: 'organization',
    accessorKey: 'organization',
    label: 'common:organization',
  },
  {
    id: 'status',
    accessorKey: 'status',
    cell: ({ getValue }) => <BadgeStatus status={getValue<keyof typeof ResourceStatus>()} />,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    cell: ({ row }) => <ActionButton data-testid="add-redirection-btn" item={row.original} />,
    label: '',
  },
];

export const Redirections = () => {
  const { t } = useTranslation(['redirections', 'common', NAMESPACES.STATUS]);
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const isOverridedPage = useOverridePage();
  const { accountId } = useParams();
  const hrefAddRedirection = useGenerateUrl('./add', 'path');

  const handleAddEmailRedirectionClick = () => {
    navigate(hrefAddRedirection);
  };
  // to update
  const isLoading = false;

  return (
    <div>
      <Outlet />
      {!isOverridedPage && (
        <>
          {accountId && (
            <div className="mb-6">
              <Text preset={TEXT_PRESET.heading3}>{t('zimbra_redirections_account_title')}</Text>
            </div>
          )}
          <Datagrid
            topbar={
              <Button
                color={BUTTON_COLOR.primary}
                size={BUTTON_SIZE.sm}
                onClick={handleAddEmailRedirectionClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.redirection.create]}
                data-testid="add-redirection-btn"
                id="add-redirection-btn"
              >
                <>
                  <Icon name={ICON_NAME.plus} />
                  {t('common:add_redirection')}
                </>
              </Button>
            }
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            data={items}
            totalCount={items.length}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default Redirections;
