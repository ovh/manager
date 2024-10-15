import React, { useContext, useEffect, useState } from 'react';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { useFetchHubSupport } from '@/data/hooks/apiHubSupport/useHubSupport';
import { SUPPORT_URLS } from './HubSupport.constants';
import { HubSupportHelp } from './hub-support-help/HubSupportHelp.component';
import { HubSupportTable } from './hub-support-table/HubSupportTable.component';
import { Skeletons } from '../skeletons/Skeletons.component';
import TileError from '../tile-error/TileError.component';

export default function HubSupport() {
  const { t } = useTranslation('hub/support');
  const { t: tCommon } = useTranslation('hub');
  const { data, refetch, isLoading, error } = useFetchHubSupport();
  const context = useContext(ShellContext);
  const { navigation } = context.shell;
  const { environment } = context;
  const region = environment.getRegion();
  const { ovhSubsidiary } = environment.getUser();
  const isEUOrCA = ['EU', 'CA'].includes(region);

  const [urlSeeAll, setUrlSeeAll] = useState<string>('');

  useEffect(() => {
    (async () => {
      const url = isEUOrCA
        ? SUPPORT_URLS.allTickets + ovhSubsidiary
        : ((await navigation.getURL('dedicated', '#/ticket', {})) as string);
      setUrlSeeAll(url);
    })();
  }, []);

  const handlerRefetch = () => {
    refetch();
  };

  return (
    <OsdsTile className="w-full block p-4" inline>
      {isLoading ? (
        <Skeletons />
      ) : (
        <div className="flex flex-col">
          {error && (
            <TileError
              className="block p-4"
              message={t('hub_support_error')}
              refetch={handlerRefetch}
            />
          )}
          {!error && data.count <= 0 && <HubSupportHelp />}
          {!error && data.count > 0 && (
            <>
              <div className="flex mb-2 gap-4 items-center">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.primary}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  className="block"
                  size={ODS_TEXT_SIZE._400}
                >
                  {t('hub_support_title')}
                </OsdsText>
                <OsdsChip
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_CHIP_SIZE.sm}
                >
                  {data.count}
                </OsdsChip>
                <div className="ml-auto flex items-center gap-4">
                  <OsdsIcon
                    hoverable
                    data-testid="refresh-icon"
                    className="cursor-pointer"
                    onClick={handlerRefetch}
                    name={ODS_ICON_NAME.REFRESH}
                    size={ODS_ICON_SIZE.xs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                  <OsdsLink
                    href={urlSeeAll}
                    target={
                      isEUOrCA
                        ? OdsHTMLAnchorElementTarget._blank
                        : OdsHTMLAnchorElementTarget._self
                    }
                    rel={
                      isEUOrCA ? OdsHTMLAnchorElementRel.noreferrer : undefined
                    }
                    color={ODS_THEME_COLOR_INTENT.primary}
                    className="font-bold text-right"
                  >
                    {tCommon('hub_support_see_more')}
                    <span slot="end">
                      <OsdsIcon
                        hoverable
                        name={ODS_ICON_NAME.ARROW_RIGHT}
                        size={ODS_ICON_SIZE.xs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsLink>
                </div>
              </div>
              <div className="w-full">
                <HubSupportTable tickets={data.data} />
              </div>
            </>
          )}
        </div>
      )}
    </OsdsTile>
  );
}
