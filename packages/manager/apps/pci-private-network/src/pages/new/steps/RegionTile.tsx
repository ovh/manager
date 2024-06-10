import { Links, LinkType } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsChip,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { URL_INFO } from '@/constants';
import { TMappedRegion } from './LocalizationStep';
import { useNewNetworkStore } from '@/pages/new/store';

type TRegionTile = {
  region: TMappedRegion;
  stack?: boolean;
};

export const RegionTile = ({
  region,
  stack = false,
}: Readonly<TRegionTile>) => {
  const { t: tRegions } = useTranslation('regions');

  const store = useNewNetworkStore();

  const { ovhSubsidiary } = useEnvironment().getUser();

  const getDocumentUrl = (linkType: string) =>
    URL_INFO[linkType][ovhSubsidiary] || URL_INFO[linkType].DEFAULT;

  if (!region) {
    return null;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={
            region === store.form?.region
              ? ODS_TEXT_SIZE._500
              : ODS_TEXT_SIZE._400
          }
        >
          {stack ? region?.macroName : region?.microName}
        </OsdsText>
      </div>
      <hr className="w-full border-solid border-0 border-b border-b-[#85d9fd]" />
      <div>
        {region?.isLocalZone ? (
          <OsdsPopover>
            <span slot="popover-trigger">
              <OsdsChip
                color={ODS_THEME_COLOR_INTENT.error}
                size={ODS_CHIP_SIZE.sm}
                onClick={(event) => event.stopPropagation()}
              >
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.primary}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._500}
                >
                  {tRegions('pci_project_flavors_zone_localzone')}
                </OsdsText>
                <OsdsIcon
                  name={ODS_ICON_NAME.HELP}
                  size={ODS_ICON_SIZE.xs}
                  className="ml-2"
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsChip>
            </span>
            <OsdsPopoverContent>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {tRegions('pci_project_flavors_zone_localzone_tooltip')}
              </OsdsText>
              <Links
                tab-index="-1"
                label={tRegions('pci_project_flavors_zone_tooltip_link')}
                type={LinkType.external}
                href={getDocumentUrl('LOCAL_ZONE')}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        ) : (
          <OsdsPopover>
            <span slot="popover-trigger">
              <OsdsChip
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_CHIP_SIZE.sm}
                onClick={(event) => event.stopPropagation()}
              >
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.primary}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._500}
                >
                  {tRegions('pci_project_flavors_zone_global_region')}
                </OsdsText>
                <OsdsIcon
                  name={ODS_ICON_NAME.HELP}
                  size={ODS_ICON_SIZE.xs}
                  className="ml-2"
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsChip>
            </span>
            <OsdsPopoverContent>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
              >
                {tRegions('pci_project_flavors_zone_globalregions_tooltip')}
              </OsdsText>
              <Links
                tab-index="-1"
                label={tRegions('pci_project_flavors_zone_tooltip_link')}
                type={LinkType.external}
                href={getDocumentUrl('GLOBAL_REGIONS')}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        )}
      </div>
    </div>
  );
};
