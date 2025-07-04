import { useEffect, useState } from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import {
  OsdsTabBarItem,
  OsdsTabPanel,
  OsdsTabs,
  OsdsLink,
  OsdsIcon,
  OsdsTabBar,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TABS_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { EXTERNAL_LINKS } from '@/changelog.constants';
import {
  RoadmapChangelogItemProductCell,
  RoadmapChangelogItemTitleCell,
  RoadmapChangelogItemDescriptionCell,
  RoadmapChangelogItemReleaseDateCell,
  RoadmapChangelogItemStatusCell,
} from './cells/RoadmapChangelogCells';
import { useRoadmapChangelog } from '@/data/hooks/roadmapChangelog/useRoadmapChangelog';

const RoadmapChangelogDatagrid = () => {
  const {
    data: roadmapChangelogItems,
    isLoading: isLoadingItems,
  } = useRoadmapChangelog();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('changelog');

  useEffect(() => {
    console.log(roadmapChangelogItems);
  }, [isLoadingItems]);

  const columns: DatagridColumn<string>[] = [
    {
      id: 'product',
      label: 'Product',
      cell: (item: any) => <RoadmapChangelogItemProductCell item={item} />,
    },
    {
      id: 'changelog',
      label: 'Changelog',
      cell: (item: any) => <RoadmapChangelogItemTitleCell item={item} />,
    },
    {
      id: 'description',
      label: 'Description',
      cell: (item: any) => <RoadmapChangelogItemDescriptionCell item={item} />,
    },
    {
      id: 'realease_date',
      label: 'Realease Date',
      cell: (item: any) => <RoadmapChangelogItemReleaseDateCell item={item} />,
    },
    {
      id: 'status',
      label: 'Status',
      cell: (item: any) => <RoadmapChangelogItemStatusCell item={item} />,
    },
  ];

  return (
    !isLoadingItems &&
    roadmapChangelogItems && (
      <>
        <OsdsTabs panel="tab1" size={ODS_TABS_SIZE.md}>
          <OsdsTabBar>
            <OsdsTabBarItem panel="tab1">
              {t('datagrid_tab_title_hosting')}
            </OsdsTabBarItem>
            <OsdsTabBarItem panel="tab2">
              {t('datagrid_tab_title_cloud')}
            </OsdsTabBarItem>
          </OsdsTabBar>
          <OsdsTabPanel name="tab1">
            <Datagrid
              items={roadmapChangelogItems.hostingCollab}
              columns={columns}
              hasNextPage={false}
              totalItems={20}
            />
            <div className="mt-4">
              <OsdsLink
                role="link"
                target={OdsHTMLAnchorElementTarget._blank}
                rel={OdsHTMLAnchorElementRel.external}
                color={ODS_THEME_COLOR_INTENT.primary}
                href={EXTERNAL_LINKS.WEB_CHANGELOG.url}
                onClick={() => {
                  trackClick(EXTERNAL_LINKS.WEB_CHANGELOG.tracking);
                }}
              >
                {t(EXTERNAL_LINKS.WEB_CHANGELOG.label_key)}
                <span slot="end">
                  <OsdsIcon
                    name={ODS_ICON_NAME.EXTERNAL_LINK}
                    className="ml-1"
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </span>
              </OsdsLink>
            </div>
          </OsdsTabPanel>
          <OsdsTabPanel name="tab2">
            <Datagrid
              items={roadmapChangelogItems.cloud}
              columns={columns}
              hasNextPage={false}
              totalItems={20}
            />
            <div className="mt-4">
              <OsdsLink
                role="link"
                target={OdsHTMLAnchorElementTarget._blank}
                rel={OdsHTMLAnchorElementRel.external}
                color={ODS_THEME_COLOR_INTENT.primary}
                href={EXTERNAL_LINKS.CLOUD_CHANGELOG.url}
                data-testid="changelog-cloud-link"
                onClick={() => {
                  trackClick(EXTERNAL_LINKS.CLOUD_CHANGELOG.tracking);
                }}
              >
                {t(EXTERNAL_LINKS.CLOUD_CHANGELOG.label_key)}
                <span slot="end">
                  <OsdsIcon
                    name={ODS_ICON_NAME.EXTERNAL_LINK}
                    className="ml-1"
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </span>
              </OsdsLink>
            </div>
          </OsdsTabPanel>
        </OsdsTabs>
      </>
    )
  );
};

export default RoadmapChangelogDatagrid;
