import React, { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsChip, OsdsIcon, OsdsLink, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { Skeletons } from '@/components/skeletons/Skeletons.component';
import { useHubSupportTickets } from '@/data/hooks/hubSupportTickets/useHubSupportTickets';

import TileError from '../tile-error/TileError.component';
import {
  DIGITAL_AGENT_URLS,
  MAX_DIGITAL_AGENT_TICKETS_TO_DISPLAY,
  MAX_TICKETS_TO_DISPLAY,
  SUPPORT_URLS,
} from './HubSupport.constants';
import { HubSupportHelp } from './hub-support-help/HubSupportHelp.component';
import { HubSupportTable } from './hub-support-table/HubSupportTable.component';

/**
 * The Digital Agent lives in the Manager V7, outside of the hub iframe, hence
 * `_top`. Help Center links stay external, V6 tickets stay in the iframe.
 */
const getSeeAllTarget = (isDigitalAgent: boolean, isEUOrCA: boolean) => {
  if (isDigitalAgent) return OdsHTMLAnchorElementTarget._top;
  return isEUOrCA ? OdsHTMLAnchorElementTarget._blank : OdsHTMLAnchorElementTarget._self;
};

export default function HubSupport() {
  const { t } = useTranslation('hub/support');
  const { t: tCommon } = useTranslation('hub');
  const { isDigitalAgent, tickets, count, refetch, isLoading, error } = useHubSupportTickets();
  const context = useContext(ShellContext);
  const { navigation } = context.shell;
  const { environment } = context;
  const region = environment.getRegion();
  const { ovhSubsidiary } = environment.getUser();
  const isEUOrCA = ['EU', 'CA'].includes(region);

  const [urlSeeAll, setUrlSeeAll] = useState<string>('');

  useEffect(() => {
    void (async () => {
      if (isDigitalAgent) {
        setUrlSeeAll(DIGITAL_AGENT_URLS.allTickets);
        return;
      }
      const url = isEUOrCA
        ? SUPPORT_URLS.allTickets + ovhSubsidiary
        : ((await navigation.getURL('dedicated', '#/ticket', {})) as string);
      setUrlSeeAll(url);
    })();
  }, []);

  return (
    <OsdsTile className="block w-full p-6" inline>
      {isLoading ? (
        <Skeletons />
      ) : (
        <div className="flex flex-col">
          {error && (
            <TileError
              className="block p-4"
              message={t('hub_support_error')}
              refetch={void refetch}
            />
          )}
          {!error && !count && <HubSupportHelp />}
          {!error && !!count && (
            <>
              <div className="mb-2 flex items-center gap-4">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.primary}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  className="block"
                  size={ODS_TEXT_SIZE._400}
                >
                  {t('hub_support_title')}
                </OsdsText>
                <OsdsChip color={ODS_THEME_COLOR_INTENT.primary} size={ODS_CHIP_SIZE.sm}>
                  {count}
                </OsdsChip>
                <div className="ml-auto flex items-center gap-4">
                  <OsdsIcon
                    hoverable
                    data-testid="refresh-icon"
                    className="cursor-pointer"
                    onClick={() => void refetch()}
                    name={ODS_ICON_NAME.REFRESH}
                    size={ODS_ICON_SIZE.xs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                  <OsdsLink
                    href={urlSeeAll}
                    target={getSeeAllTarget(isDigitalAgent, isEUOrCA)}
                    rel={
                      isEUOrCA && !isDigitalAgent ? OdsHTMLAnchorElementRel.noreferrer : undefined
                    }
                    color={ODS_THEME_COLOR_INTENT.primary}
                    className="text-right font-bold"
                  >
                    {tCommon('hub_support_see_more')}
                    {!isDigitalAgent && (
                      <span slot="end">
                        <OsdsIcon
                          hoverable
                          name={ODS_ICON_NAME.EXTERNAL_LINK}
                          size={ODS_ICON_SIZE.xs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </span>
                    )}
                  </OsdsLink>
                </div>
              </div>
              <div className="w-full">
                <HubSupportTable
                  tickets={tickets}
                  maxTickets={
                    isDigitalAgent ? MAX_DIGITAL_AGENT_TICKETS_TO_DISPLAY : MAX_TICKETS_TO_DISPLAY
                  }
                />
              </div>
            </>
          )}
        </div>
      )}
    </OsdsTile>
  );
}
