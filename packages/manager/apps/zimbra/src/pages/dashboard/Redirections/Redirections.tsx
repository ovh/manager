import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import ActionButtonRedirection from './ActionButtonRedirection.component';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { BadgeStatus } from '@/components/BadgeStatus';

export type RedirectionItem = {
  id: string;
  from: string;
  to: string;
  organization: string;
  status: ResourceStatus;
};

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
    cell: (item) => <div>{item.from}</div>,
    label: 'zimbra_redirections_from',
  },
  {
    id: 'to',
    cell: (item) => <div>{item.to}</div>,
    label: 'zimbra_redirections_to',
  },
  {
    id: 'organization',
    cell: (item) => <div>{item.organization}</div>,
    label: 'common:organization',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
    label: 'common:status',
  },
  {
    id: 'tooltip',
    cell: (item) => (
      <ActionButtonRedirection
        data-testid="add-redirection-btn"
        redirectionItem={item}
      />
    ),
    label: '',
  },
];

export function Redirections() {
  const { t } = useTranslation(['redirections', 'common']);
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
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
      {platformUrn && (
        <>
          {accountId && (
            <div className="mb-6">
              <Subtitle>{t('zimbra_redirections_account_title')}</Subtitle>
            </div>
          )}
          <Datagrid
            topbar={
              <ManagerButton
                color={ODS_BUTTON_COLOR.primary}
                inline-block
                size={ODS_BUTTON_SIZE.sm}
                onClick={handleAddEmailRedirectionClick}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.redirection.create]}
                data-testid="add-redirection-btn"
                id="add-redirection-btn"
                icon={ODS_ICON_NAME.plus}
                label={t('common:add_redirection')}
              />
            }
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            items={items}
            totalItems={items.length}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

export default Redirections;
