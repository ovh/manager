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
  LOCAL_ZONE_INFO_URL,
  Region3AZChip,
  RegionGlobalzoneChip,
  RegionLocalzoneChip,
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
        compponent: Region3AZChip,
        tooltipKey: 'kube:pci_project_flavors_zone_3az_tooltip',
      };
    }

    if (isLocal) {
      return {
        component: RegionLocalzoneChip,
        tooltipKey: 'pci_project_flavors_zone_global_region',
      };
    }

    return {
      component: RegionGlobalzoneChip,
      tooltipKey: 'kube:pci_project_flavors_zone_globalregions_tooltip',
    };
  }, [isMulti, isLocal]);

  const Component = getFlavorDisplayInfo.component;

  return <Component showTooltip />;
}
