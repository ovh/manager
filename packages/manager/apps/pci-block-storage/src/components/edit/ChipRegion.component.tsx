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
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { URL_INFO } from '@/constants';

export type TChipRegionsProps = {
  region: string;
  localRegions: TRegion[];
};
export default function ChipRegion({
  region,
  localRegions,
}: Readonly<TChipRegionsProps>) {
  const { t } = useTranslation('flavors');
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
              ? t('pci_project_flavors_zone_localzone')
              : t('pci_project_flavors_zone_global_region')}
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
            ? t('pci_project_flavors_zone_localzone_tooltip')
            : t('pci_project_flavors_zone_globalregions_tooltip')}
        </OsdsText>
        &nbsp;
        <Links
          tab-index="-1"
          label={t('pci_project_flavors_zone_tooltip_link')}
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
