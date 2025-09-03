import { useContext, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';
import { Badge, TRegion } from '@ovh-ux/manager-react-components';
import { URL_INFO } from '@/constants';

export type BadgeRegionTypeProps = {
  regionType: TRegion['type'];
  are3azRegionAvailable?: boolean;
};

export type TRegionValues = {
  [key: string]: {
    label: string;
    tooltipText: string;
    tooltipLink: string;
  };
};

export default function BadgeRegionType({
  regionType,
  are3azRegionAvailable,
}: Readonly<BadgeRegionTypeProps>) {
  const { t } = useTranslation('volume-edit');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment?.getUser() || {};
  const triggerId = useId();

  const regionValues: TRegionValues = {
    localzone: {
      label: t('pci_project_flavors_zone_localzone'),
      tooltipText: t('pci_project_flavors_zone_localzone_tooltip'),
      tooltipLink:
        URL_INFO.LOCAL_ZONE[ovhSubsidiary || ''] || URL_INFO.LOCAL_ZONE.DEFAULT,
    },
    region: {
      label: t('pci_project_flavors_zone_global_region'),
      tooltipText: are3azRegionAvailable
        ? t('pci_project_flavors_zone_globalregions_tooltip')
        : t('pci_project_flavors_zone_globalregions_tooltip_2'),
      tooltipLink:
        URL_INFO.GLOBAL_REGIONS[ovhSubsidiary || ''] ||
        URL_INFO.GLOBAL_REGIONS.DEFAULT,
    },
    'region-3-az': {
      label: t('pci_project_flavors_zone_3az_region'),
      tooltipText: t('pci_project_flavors_zone_3az_tooltip'),
      tooltipLink:
        URL_INFO.GLOBAL_REGIONS[ovhSubsidiary || ''] ||
        URL_INFO.GLOBAL_REGIONS.DEFAULT,
    },
  };
  const { label, tooltipText, tooltipLink } = regionValues[regionType];

  return (
    <>
      <Badge
        id={triggerId}
        label={label}
        icon="circle-info"
        iconAlignment="right"
        tabIndex={1}
      />
      <OdsPopover triggerId={triggerId} position="right" withArrow>
        <div className="max-w-[18rem] region-tooltip-content">
          <OdsText className="inline" preset="span">
            {tooltipText}
          </OdsText>
          &nbsp;
          <OdsLink
            className="text-sm"
            href={tooltipLink}
            icon="external-link"
            target="_blank"
            label={t('pci_project_flavors_zone_tooltip_link')}
          />
        </div>
      </OdsPopover>
    </>
  );
}
