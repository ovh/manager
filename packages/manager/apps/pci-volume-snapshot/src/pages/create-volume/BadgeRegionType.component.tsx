import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsButton,
  OdsLink,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { TRegion } from '@ovh-ux/manager-react-components';
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
  const { ovhSubsidiary } = context.environment.getUser();
  // FIXME: use useId once OdsPopover fix it's issue with the generated id format.
  const triggerId = 'badge-region-type_trigger';

  const regionValues: TRegionValues = {
    localzone: {
      label: t('pci_project_flavors_zone_localzone'),
      tooltipText: t('pci_project_flavors_zone_localzone_tooltip'),
      tooltipLink:
        URL_INFO.LOCAL_ZONE[ovhSubsidiary] || URL_INFO.LOCAL_ZONE.DEFAULT,
    },
    region: {
      label: t('pci_project_flavors_zone_global_region'),
      tooltipText: are3azRegionAvailable
        ? t('pci_project_flavors_zone_globalregions_tooltip')
        : t('pci_project_flavors_zone_globalregions_tooltip_2'),
      tooltipLink:
        URL_INFO.GLOBAL_REGIONS[ovhSubsidiary] ||
        URL_INFO.GLOBAL_REGIONS.DEFAULT,
    },
    'region-3-az': {
      label: t('pci_project_flavors_zone_3az_region'),
      tooltipText: t('pci_project_flavors_zone_3az_tooltip'),
      tooltipLink:
        URL_INFO.GLOBAL_REGIONS[ovhSubsidiary] ||
        URL_INFO.GLOBAL_REGIONS.DEFAULT,
    },
  };
  const { label, tooltipText, tooltipLink } = regionValues[regionType];

  return (
    <>
      <div id={triggerId}>
        <OdsButton
          className="badge-region-type"
          icon="circle-question"
          size="sm"
          variant="ghost"
          label={label}
        />
      </div>
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
