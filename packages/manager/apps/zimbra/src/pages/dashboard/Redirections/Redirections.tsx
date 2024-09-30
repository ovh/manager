import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  Notifications,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useSearchParams } from 'react-router-dom';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import ActionButtonRedirections from './ActionButtonRedirections.component';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

export type RedirectionsItem = {
  id: string;
  from: string;
  to: string;
  organization: string;
};

const items: RedirectionsItem[] = [
  {
    from: 'from@example.com',
    to: 'to@example.com',
    organization: 'Test Organization',
    id: '123-123',
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
    label: 'zimbra_redirections_organization',
  },
  {
    id: 'tooltip',
    cell: (item) => (
      <ActionButtonRedirections
        data-testid="redirection-action-btn"
        redirectionsItem={item}
      />
    ),
    label: '',
  },
];

export function Redirections() {
  const { t } = useTranslation('redirections');
  const { platformUrn } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const hrefAddRedirection = useGenerateUrl('./add', 'href');

  return (
    <div className="py-6 mt-8">
      <Notifications />
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
              color={ODS_THEME_COLOR_INTENT.primary}
              inline
              size={ODS_BUTTON_SIZE.sm}
              href={hrefAddRedirection}
              urn={platformUrn}
              iamActions={[IAM_ACTIONS.redirection.create]}
              data-testid="add-redirection-btn"
              className="mb-6"
            >
              <span slot="start">
                <OsdsIcon
                  name={ODS_ICON_NAME.PLUS}
                  size={ODS_ICON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  contrasted
                ></OsdsIcon>
              </span>
              <span slot="end">{t('zimbra_redirections_cta')}</span>
            </ManagerButton>
          </div>
          <Datagrid
            columns={columns.map((column) => ({
              ...column,
              label: t(column.label),
            }))}
            items={items}
            totalItems={items.length}
          />
        </>
      )}
    </div>
  );
}

export default Redirections;
