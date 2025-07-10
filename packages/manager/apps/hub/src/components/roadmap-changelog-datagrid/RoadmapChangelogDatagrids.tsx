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
import styles from './style.module.scss';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

const RoadmapChangelogDatagrids = () => {
  const {
    data: roadmapChangelogItems,
    isLoading: isLoadingItems,
  } = useRoadmapChangelog();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('changelog');

  const columns: DatagridColumn<RoadmapChangelogItem>[] = [
    {
      id: 'product',
      label: t('datagrid_table_head_product'),
      cell: (item: RoadmapChangelogItem) => (
        <RoadmapChangelogItemProductCell item={item} />
      ),
    },
    {
      id: 'changelog',
      label: t('datagrid_table_head_changelog'),
      cell: (item: RoadmapChangelogItem) => (
        <RoadmapChangelogItemTitleCell item={item} />
      ),
    },
    {
      id: 'description',
      label: t('datagrid_table_head_description'),
      cell: (item: RoadmapChangelogItem) => (
        <RoadmapChangelogItemDescriptionCell item={item} />
      ),
    },
    {
      id: 'realease_date',
      label: t('datagrid_table_head_release_date'),
      cell: (item: RoadmapChangelogItem) => (
        <RoadmapChangelogItemReleaseDateCell item={item} />
      ),
    },
    {
      id: 'status',
      label: t('datagrid_table_head_status'),
      cell: (item: RoadmapChangelogItem) => (
        <RoadmapChangelogItemStatusCell item={item} />
      ),
    },
  ];

  return (
    !isLoadingItems &&
    roadmapChangelogItems && (
      <div className="max-w-[100vw] overflow-auto">
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
              contentAlignLeft
              className={styles.roadmapchangelogDatagrid}
            />
            <div className="mt-6">
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
              className={styles.roadmapchangelogDatagrid}
            />
            <div className="mt-6">
              <OsdsLink
                role="link"
                target={OdsHTMLAnchorElementTarget._blank}
                rel={OdsHTMLAnchorElementRel.external}
                color={ODS_THEME_COLOR_INTENT.primary}
                href={EXTERNAL_LINKS.CLOUD_CHANGELOG.url}
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
      </div>
    )
  );
};

export default RoadmapChangelogDatagrids;
