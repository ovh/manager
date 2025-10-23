import React, { useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
  ManagerText,
} from '@ovh-ux/manager-react-components';

import { BadgeStatus } from '@/components';
import { MAX_REDIRECTIONS_QUOTA } from '@/constants';
import { useOrganizations, usePlatform, useRedirections } from '@/data/hooks';
import { useDebouncedValue, useGenerateUrl } from '@/hooks';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import ActionButton from './ActionButton.component';
import { RedirectionItem } from './Redirections.types';

const columns: DatagridColumn<RedirectionItem>[] = [
  {
    id: 'from',
    cell: (item) => <div>{item.from}</div>,
    label: 'zimbra_redirections_from',
    isSearchable: true,
  },
  {
    id: 'to',
    cell: (item) => <div>{item.to}</div>,
    label: 'zimbra_redirections_to',
    isSearchable: true,
  },
  {
    id: 'organization',
    cell: (item) => <div>{item.organization}</div>,
    label: 'common:organization',
  },
  {
    id: 'status',
    cell: (item) => <BadgeStatus status={item.status} />,
    label: `${NAMESPACES.STATUS}:status`,
  },
  {
    id: 'tooltip',
    cell: (item) => <ActionButton data-testid="add-redirection-btn" item={item} />,
    label: '',
  },
];

export const Redirections = () => {
  const { t } = useTranslation(['redirections', 'common', NAMESPACES.STATUS]);
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const { accountId } = useParams();
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');
  const hrefAddRedirection = useGenerateUrl('./add', 'path');
  const { data: organizations } = useOrganizations();
  const {
    data: redirections,
    isLoading,
    hasNextPage,
    fetchNextPage,
    fetchAllPages,
  } = useRedirections({
    redirection: debouncedSearchInput,
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });

  const handleAddEmailRedirectionClick = () => {
    navigate(hrefAddRedirection);
  };

  const items = useMemo(() => {
    return (
      redirections?.map((redirection) => ({
        id: redirection.id,
        from: redirection.currentState.source,
        to: redirection.currentState.destination,
        status: redirection.resourceStatus,
        organization: organizations?.find((o) => o.id === redirection?.currentState?.organizationId)
          ?.currentState?.name,
      })) ?? []
    );
  }, [redirections, organizations]);

  return (
    <div>
      <Outlet />
      {accountId && (
        <div className="mb-6">
          <OdsText preset="heading-3">{t('zimbra_redirections_account_title')}</OdsText>
        </div>
      )}
      <ManagerText
        className="flex gap-8 mb-6"
        data-testid="account-offers"
        urn={platformUrn}
        iamActions={[IAM_ACTIONS.account.get]}
      >
        <div className="flex gap-8">
          <span>
            <OdsText preset={ODS_TEXT_PRESET.heading6} className="mr-4">
              {t('zimbra_redirections_account_quota')}
            </OdsText>
            <span>{`${redirections?.length} / ${MAX_REDIRECTIONS_QUOTA}`}</span>
          </span>
        </div>
      </ManagerText>
      <Datagrid
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
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
        totalItems={items?.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
      />
    </div>
  );
};

export default Redirections;
