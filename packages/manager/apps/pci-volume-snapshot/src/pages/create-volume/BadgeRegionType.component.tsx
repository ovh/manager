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

export default function BadgeRegionType({
  regionType,
  are3azRegionAvailable,
}: Readonly<BadgeRegionTypeProps>) {
  const { t } = useTranslation('volume-edit');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  // FIXME: find why React's useId do not work here.
  const triggerId = 'badge-region-type_trigger';
  let label = '';
  let tooltipText = '';
  let tooltipLink = '';
  switch (regionType) {
    case 'localzone':
      label = t('pci_project_flavors_zone_localzone');
      tooltipText = t('pci_project_flavors_zone_localzone_tooltip');
      tooltipLink =
        URL_INFO.LOCAL_ZONE[ovhSubsidiary] || URL_INFO.LOCAL_ZONE.DEFAULT;
      break;
    case 'region':
      label = t('pci_project_flavors_zone_global_region');
      tooltipText = are3azRegionAvailable
        ? t('pci_project_flavors_zone_globalregions_tooltip')
        : t('pci_project_flavors_zone_globalregions_tooltip_2');
      tooltipLink =
        URL_INFO.GLOBAL_REGIONS[ovhSubsidiary] ||
        URL_INFO.GLOBAL_REGIONS.DEFAULT;
      break;
    case 'region-3-az':
      label = t('pci_project_flavors_zone_3az_region');
      tooltipText = t('pci_project_flavors_zone_3az_tooltip');
      tooltipLink =
        URL_INFO.GLOBAL_REGIONS[ovhSubsidiary] ||
        URL_INFO.GLOBAL_REGIONS.DEFAULT;
      break;
    default:
    // Noop
  }

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
      <OdsPopover triggerId={triggerId} position="bottom" withArrow>
        <div className="max-w-[30rem]">
          <OdsText className="inline" preset="span">
            {tooltipText}
          </OdsText>
          &nbsp;
          <OdsLink
            href={tooltipLink}
            icon="external-link"
            label={t('pci_project_flavors_zone_tooltip_link')}
          />
        </div>
      </OdsPopover>
    </>
  );
}
