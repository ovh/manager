import { useMemo, useContext } from 'react';
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
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  GLOBAL_REGIONS_INFO_URL,
  LOCAL_ZONE_INFO_URL,
} from '@ovh-ux/manager-pci-common';

import { DeploymentMode } from '@/types';
import { isLocalDeploymentZone, isMultiDeploymentZones } from '@/helpers';

const URL_INFO = {
  GLOBAL_REGIONS: {
    DEFAULT:
      'https://www.ovhcloud.com/fr/about-us/global-infrastructure/expansion-regions-az/',
  },
  LOCAL_ZONE: LOCAL_ZONE_INFO_URL,
};

export type TFlavorLocalzoneChip = {
  flavorCompatibility: DeploymentMode;
};

export function FlavorZoneChip({
  flavorCompatibility,
}: Readonly<TFlavorLocalzoneChip>) {
  const { t } = useTranslation(['pci-flavors', 'kube']);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const getDocumentUrl = (linkType: string) =>
    URL_INFO[linkType as keyof typeof URL_INFO][ovhSubsidiary] ||
    URL_INFO[linkType as keyof typeof URL_INFO].DEFAULT;

  const isMulti = isMultiDeploymentZones(flavorCompatibility);
  const isLocal = isLocalDeploymentZone(flavorCompatibility);

  const getFlavorDisplayInfo = useMemo(() => {
    if (isMulti) {
      return {
        labelKey: 'kube:pci_project_flavors_zone_3az',
        tooltipKey: 'kube:pci_project_flavors_zone_3az_tooltip',
        chipColor: ODS_THEME_COLOR_INTENT.default,
      };
    }

    if (isLocal) {
      return {
        labelKey: 'pci_project_flavors_zone_localzone',
        tooltipKey: 'pci_project_flavors_zone_global_region',
        chipColor: ODS_THEME_COLOR_INTENT.error,
      };
    }

    return {
      labelKey: 'kube:pci_project_flavors_zone_global_region',
      tooltipKey: 'kube:pci_project_flavors_zone_globalregions_tooltip',
      chipColor: ODS_THEME_COLOR_INTENT.primary,
    };
  }, [isMulti, isLocal]);

  return (
    <OsdsPopover>
      <span slot="popover-trigger">
        <OsdsChip
          color={getFlavorDisplayInfo.chipColor}
          size={ODS_CHIP_SIZE.sm}
          onClick={(event) => event.stopPropagation()}
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.primary}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
          >
            {t(getFlavorDisplayInfo.labelKey)}
          </OsdsText>
          <OsdsIcon
            name={ODS_ICON_NAME.HELP}
            size={ODS_ICON_SIZE.xxs}
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
          {t(getFlavorDisplayInfo.tooltipKey)}
        </OsdsText>
        &nbsp;
        <Links
          tab-index="-1"
          label={t('pci_project_flavors_zone_tooltip_link')}
          type={LinkType.external}
          target={OdsHTMLAnchorElementTarget._blank}
          href={
            isLocalDeploymentZone(flavorCompatibility)
              ? getDocumentUrl('LOCAL_ZONE')
              : getDocumentUrl('GLOBAL_REGIONS')
          }
        />
      </OsdsPopoverContent>
    </OsdsPopover>
  );
}
