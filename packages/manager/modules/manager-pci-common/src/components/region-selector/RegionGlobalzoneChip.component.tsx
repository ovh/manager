import { FC, useContext } from 'react';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { OdsPopover, OdsTag, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_TAG_COLOR,
  ODS_TAG_SIZE,
} from '@ovhcloud/ods-components';
import { URL_INFO } from './constants';

export type TRegionGlobalzoneChipProps = Readonly<{ id: string }>;

export const RegionGlobalzoneChip: FC<TRegionGlobalzoneChipProps> = ({
  id,
}) => {
  const { t } = useTranslation('pci-region-selector');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const getDocumentUrl = (linkType: string) =>
    URL_INFO[linkType as keyof typeof URL_INFO][ovhSubsidiary] ||
    URL_INFO[linkType as keyof typeof URL_INFO].DEFAULT;

  return (
    <>
      <div id={id}>
        <OdsTag
          className="font-bold"
          label={t('pci_project_flavors_zone_global_region')}
          icon={ODS_ICON_NAME.question}
          color={ODS_TAG_COLOR.information}
          size={ODS_TAG_SIZE.md}
          onClick={(event) => event.stopPropagation()}
        />
      </div>
      <OdsPopover triggerId={id}>
        <OdsText preset="span">
          {t('pci_project_flavors_zone_globalregions_tooltip')}
        </OdsText>
        &nbsp;
        <Links
          tab-index="-1"
          label={t('pci_project_flavors_zone_tooltip_link')}
          type={LinkType.external}
          target="_blank"
          href={getDocumentUrl('GLOBAL_REGIONS')}
        />
      </OdsPopover>
    </>
  );
};
