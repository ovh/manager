import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import ActionButtonRedirections from './ActionButtonRedirections.component';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import Loading from '@/components/Loading/Loading';
import { BadgeStatus } from '@/components/BadgeStatus';

export type RedirectionsItem = {
  id: string;
  from: string;
  to: string;
  organization: string;
  status: ResourceStatus;
};

const items: RedirectionsItem[] = [
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

const columns: DatagridColumn<RedirectionsItem>[] = [
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
      <ActionButtonRedirections
        data-testid="add-redirection-btn"
        redirectionsItem={item}
      />
    ),
    label: '',
  },
];

export function Redirections() {
  const { t } = useTranslation(['redirections', 'common']);
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const hrefAddRedirection = useGenerateUrl('./add', 'path', params);

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
          {editEmailAccountId && (
            <div className="mb-8">
              <Subtitle>{t('zimbra_redirections_account_title')}</Subtitle>
            </div>
          )}
          <div className="flex items-center justify-between">
            <ManagerButton
              color={ODS_BUTTON_COLOR.primary}
              inline-block
              size={ODS_BUTTON_SIZE.sm}
              onClick={handleAddEmailRedirectionClick}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.redirection.create]}
              data-testid="add-redirection-btn"
              id="add-redirection-btn"
              className="mb-6"
              icon={ODS_ICON_NAME.plus}
              label={t('common:add_redirection')}
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <Datagrid
              columns={columns.map((column) => ({
                ...column,
                label: t(column.label),
              }))}
              items={items}
              totalItems={items.length}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Redirections;
