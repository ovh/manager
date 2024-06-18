import {
  OsdsChip,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { Links, LinkType, TRegion } from '@ovhcloud/manager-components';
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { URL_INFO } from '@ovh-ux/manager-pci-private-network-app/src/constants';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

export type TChipRegionsProps = {
  region: string;
  localRegions: TRegion[];
};
export default function ChipRegion({
  region,
  localRegions,
}: Readonly<TChipRegionsProps>) {
  const { t: tRegions } = useTranslation('regions');
  const [isLocalZone, setIsLocalZone] = useState(false);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const getDocumentUrl = (linkType: string) =>
    URL_INFO[linkType][ovhSubsidiary] || URL_INFO[linkType].DEFAULT;

  useEffect(() => {
    setIsLocalZone(localRegions.some((r) => r.name === region));
  }, [localRegions, region]);

  return (
    <OsdsPopover>
      <span slot="popover-trigger">
        <OsdsChip
          color={
            isLocalZone
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          size={ODS_CHIP_SIZE.sm}
          onClick={(event) => event.stopPropagation()}
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
          >
            {isLocalZone
              ? tRegions('pci_project_flavors_zone_localzone')
              : tRegions('pci_project_flavors_zone_global_region')}
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
          {isLocalZone
            ? tRegions('pci_project_flavors_zone_localzone_tooltip')
            : tRegions('pci_project_flavors_zone_globalregions_tooltip')}
        </OsdsText>
        &nbsp;
        <Links
          tab-index="-1"
          label={tRegions('pci_project_flavors_zone_tooltip_link')}
          type={LinkType.external}
          target={OdsHTMLAnchorElementTarget._blank}
          href={
            isLocalZone
              ? getDocumentUrl('LOCAL_ZONE')
              : getDocumentUrl('GLOBAL_REGIONS')
          }
        />
      </OsdsPopoverContent>
    </OsdsPopover>
  );
}
