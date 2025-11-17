import { useMemo, useState, useEffect } from 'react';

import { RowSelectionState } from '@tanstack/react-table';
import { Outlet, useParams, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  ChangelogMenu,
  GuideMenu,
  Notifications,
  Datagrid,
  DatagridColumn,
} from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import TabsPanel, {
  TabItemProps,
  useComputePathMatchers,
} from '@/components/tabsPanel/TabsPanel.component';
import { useGenerateUrl, useOverridePage } from '@/hooks';
import { urls } from '@/routes/routes.constants';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { GENERAL_INFORMATION, TASKS } from '@/utils/tracking.constants';

import { useGuideItems } from './ManagedWordPressResource.constants';

import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';

export default function ManagedWordpressResourcePage() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const resolvedPath = useResolvedPath('');
  const basePath = resolvedPath?.pathname ?? '/';
  const isOverridedPage = useOverridePage();
  const guideItems = useGuideItems(t);

  console.info('ENTRE DANS CETTE CONDITION !!!');

  const tabsList: TabItemProps[] = [
    {
      name: 'general-information',
      trackingName: GENERAL_INFORMATION,
      title: t('common:web_hosting_header_my_websites'),
      to: useGenerateUrl(basePath, 'path'),
      pathMatchers: useComputePathMatchers([
        urls.managedWordpressResourceGeneralInformation,
      ]),
    },
    // {
    //   name: 'tasks',
    //   trackingName: TASKS,
    //   title: t('common:web_hosting_header_tasks'),
    //   to: useGenerateUrl(`${basePath}/tasks`, 'path'),
    //   pathMatchers: useComputePathMatchers([
    //     urls.managedWordpressResourceTasks,
    //   ]),
    // },
  ];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchAllPages,
    refetch,
    isFetching,
  } = useManagedWordpressWebsites({
    disableRefetchInterval: true,
  });

  console.info('ManagedWordpressResourcePage data : ', data);

  const columns: DatagridColumn<ManagedWordpressWebsites>[] = useMemo(
    () => [
      // {
      //   id: 'id',
      //   accessorFn: (row) => row.id,
      //   cell: ({ getValue }) => <div>{getValue<string>()}</div>,
      //   header: 'ID',
      // },
      {
        id: 'defaultFQDN',
        accessorFn: (row) => row.currentState?.defaultFQDN ?? '',
        // cell: ({ getValue }) => <div>{getValue<string>()}</div>,
        cell: ({ getValue }) => {
          const defaultFQDN = getValue<string>();
          return (
            <div>
              {!defaultFQDN
                ? t('common:web_hosting_status_creating_label')
                : defaultFQDN}
            </div>
          );
        },
        header: t('common:web_hosting_status_header_fqdn'),
      },
    ],
    [],
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: serviceName,
        guideMenu: <GuideMenu items={guideItems} />,
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
      message={<Notifications />}
      tabs={!isOverridedPage && <TabsPanel tabs={tabsList} />}
    >
      <Outlet />
      {/* <div>Toto</div>
      {data && data.length > 0 && (
        <Datagrid<ManagedWordpressWebsites>
          columns={columns}
          data={data}
          rowSelection={{ rowSelection, setRowSelection }}
        />
      )}
      {Object.keys(rowSelection)?.length > 0 && (
        <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">
            {JSON.stringify(rowSelection)}
          </div>
        </div>
      )} */}
    </BaseLayout>
  );
}
