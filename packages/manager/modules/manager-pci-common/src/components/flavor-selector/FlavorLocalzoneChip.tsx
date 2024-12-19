import { useTranslation } from 'react-i18next';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsTag, OdsText, OdsPopover } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_TAG_COLOR } from '@ovhcloud/ods-components';
import clsx from 'clsx';
import {
  GLOBAL_REGIONS_INFO_URL,
  LOCAL_ZONE_INFO_URL,
} from '../../constants/urls';

const URL_INFO = {
  GLOBAL_REGIONS: GLOBAL_REGIONS_INFO_URL,
  LOCAL_ZONE: LOCAL_ZONE_INFO_URL,
};

export type TFlavorLocalzoneChip = {
  isLocalZone: boolean;
  id: string;
};

export function FlavorLocalzoneChip({
  isLocalZone,
  id,
}: Readonly<TFlavorLocalzoneChip>) {
  const { t } = useTranslation('pci-flavors');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const getDocumentUrl = (linkType: string) =>
    URL_INFO[linkType as keyof typeof URL_INFO][ovhSubsidiary] ||
    URL_INFO[linkType as keyof typeof URL_INFO].DEFAULT;

  return (
    <>
      <div id={id}>
        <OdsTag
          className={clsx(
            'text-[--ods-color-primary-500] font-bold text-[14px]',
            isLocalZone
              ? 'bg-[--ods-color-critical-100]'
              : 'bg-[--ods-color-primary-100]',
          )}
          label={
            isLocalZone
              ? t('pci_project_flavors_zone_localzone')
              : t('pci_project_flavors_zone_global_region')
          }
          icon={ODS_ICON_NAME.question}
          color={
            isLocalZone ? ODS_TAG_COLOR.critical : ODS_TAG_COLOR.information
          }
          onClick={(event) => event.stopPropagation()}
        />
      </div>
      <OdsPopover triggerId={id}>
        <OdsText preset="span">
          {isLocalZone
            ? t('pci_project_flavors_zone_localzone_tooltip')
            : t('pci_project_flavors_zone_globalregions_tooltip')}
        </OdsText>
        &nbsp;
        <Links
          tab-index="-1"
          label={t('pci_project_flavors_zone_tooltip_link')}
          type={LinkType.external}
          target="_blank"
          href={
            isLocalZone
              ? getDocumentUrl('LOCAL_ZONE')
              : getDocumentUrl('GLOBAL_REGIONS')
          }
        />
      </OdsPopover>
    </>
  );
}
