import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE, ODS_TABS_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabPanel,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { EXTERNAL_LINKS, ROADMAP_CHANGELOG_PAGES } from '@/changelog.constants';
import { useRoadmapChangelog } from '@/data/hooks/roadmapChangelog/useRoadmapChangelog';
import useRoadmapChangelogData from '@/hooks/roadmapChangelog/useRoadmapChangelogData';

import styles from './style.module.scss';

const RoadmapChangelogDatagrids = () => {
  const { data: roadmapChangelogItems, isLoading: isLoadingItems } = useRoadmapChangelog();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('changelog');
  const { environment } = useContext(ShellContext);
  const isRegionUS = environment.getRegion() === 'US';

  const { emptyRoadmapChangelogItems, columns } = useRoadmapChangelogData(isLoadingItems);

  return (
    <div className="max-w-[100%] overflow-auto">
      <OsdsTabs panel="roadmap-changelog-datagrid-tab-cloud" size={ODS_TABS_SIZE.md}>
        <OsdsTabBar>
          <OsdsTabBarItem panel="roadmap-changelog-datagrid-tab-cloud">
            {t('datagrid_tab_title_cloud')}
          </OsdsTabBarItem>
          {!isRegionUS && (
            <OsdsTabBarItem panel="roadmap-changelog-datagrid-tab-hosting-collab">
              {t('datagrid_tab_title_hosting')}
            </OsdsTabBarItem>
          )}
        </OsdsTabBar>
        <OsdsTabPanel name="roadmap-changelog-datagrid-tab-cloud">
          <Datagrid
            items={isLoadingItems ? emptyRoadmapChangelogItems : roadmapChangelogItems?.cloud || []}
            columns={columns}
            hasNextPage={false}
            totalItems={ROADMAP_CHANGELOG_PAGES}
            className={styles['roadmap-changelog-datagrid']}
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
                  aria-hidden="true"
                />
              </span>
            </OsdsLink>
          </div>
        </OsdsTabPanel>
        {!isRegionUS && (
          <OsdsTabPanel name="roadmap-changelog-datagrid-tab-hosting-collab">
            <Datagrid
              items={
                isLoadingItems
                  ? emptyRoadmapChangelogItems
                  : roadmapChangelogItems?.hostingCollab || []
              }
              columns={columns}
              hasNextPage={false}
              totalItems={ROADMAP_CHANGELOG_PAGES}
              contentAlignLeft
              className={styles['roadmap-changelog-datagrid']}
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
                    aria-hidden="true"
                  />
                </span>
              </OsdsLink>
            </div>
          </OsdsTabPanel>
        )}
      </OsdsTabs>
    </div>
  );
};

export default RoadmapChangelogDatagrids;
