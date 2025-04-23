import {
  OsdsButton,
  OsdsChip,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_CHIP_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  Links,
  LinkType,
  TilesInputComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';

import { Trans, useTranslation } from 'react-i18next';
import { FC, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslateBytes } from '@/pages/new/hooks/useTranslateBytes';
import { StepState } from '@/pages/new/hooks/useStep';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { TVolumeAddon } from '@/api/data/catalog';
import { TRegion } from '@/api/data/regions';
import { MULTI_ATTACH_INFO_URL } from '@/constants';

const BETA_TAG = 'is_new';

function VolumeTypeTile({
  volumeType,
  is3AZRegionSelected,
}: Readonly<{ volumeType: TVolumeAddon; is3AZRegionSelected: boolean }>) {
  const { t } = useTranslation(['add', 'common']);
  const tBytes = useTranslateBytes();
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const pricing = volumeType.pricings[0];

  const isNew = useMemo(() => volumeType.tags.includes(BETA_TAG), [volumeType]);

  const iopsType = useMemo(() => {
    if (pricing.specs.volume.iops.guaranteed) {
      return 'guaranteed';
    }
    if (pricing.areIOPSDynamic) {
      return 'dynamic';
    }
    return 'not_guaranteed';
  }, [pricing]);

  return (
    <div className="w-full">
      <div className="border-solid border-0 border-b border-b-[#85d9fd] py-3 d-flex">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._300}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {volumeType.name === 'classic-multiattach' && is3AZRegionSelected
            ? 'Classic 3-AZ'
            : volumeType.name}
        </OsdsText>
        {isNew && (
          <OsdsChip
            className="ms-3"
            color={ODS_THEME_COLOR_INTENT.success}
            size={ODS_CHIP_SIZE.sm}
            inline
          >
            {t('common:pci_projects_project_storages_blocks_new')}
          </OsdsChip>
        )}
      </div>
      {is3AZRegionSelected && (
        <div className="py-3">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t(
              'pci_projects_project_storages_blocks_add_type_availability_zone',
              { count: pricing.showAvailabilityZones ? 1 : 3 },
            )}
          </OsdsText>
        </div>
      )}
      <div className="py-3">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_storages_blocks_add_type_addon_iops', {
            context: iopsType,
            ...pricing.specs.volume.iops,
            iops: pricing.specs.volume.iops.level,
            separator: ',',
          })}
          {t(
            'pci_projects_project_storages_blocks_add_type_addon_capacity_max',
            {
              capacity: tBytes(
                pricing.specs.volume.capacity.max,
                0,
                false,
                'GB',
                false,
              ),
            },
          )}{' '}
          <br />
          {t('pci_projects_project_storages_blocks_add_type_addon_price', {
            price: getFormattedCatalogPrice(volumeType.pricings[0]?.price),
          })}
        </OsdsText>
      </div>
    </div>
  );
}

const GuideLink: FC<PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => (
  <Links
    label={children}
    href={href}
    target={OdsHTMLAnchorElementTarget._blank}
    type={LinkType.external}
  />
);

export interface VolumeTypeStepProps {
  projectId: string;
  region: TRegion;
  step: StepState;
  onSubmit: (volumeType: TVolumeAddon) => void;
}

export function VolumeTypeStep({
  projectId,
  region,
  step,
  onSubmit,
}: Readonly<VolumeTypeStepProps>) {
  const { t } = useTranslation(['stepper', 'add']);
  const { data } = useVolumeCatalog(projectId);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const [volumeType, setVolumeType] = useState<TVolumeAddon>(undefined);

  const volumeTypes = useMemo(
    () =>
      data?.models
        .map((m) => ({
          ...m,
          pricings: m.pricings.filter((p) => p.regions.includes(region.name)),
        }))
        .filter((m) => m.pricings.length > 0) || [],
    [data, region],
  );

  const displayedTypes =
    volumeType && step.isLocked ? [volumeType] : volumeTypes;

  const attachGuideLink =
    MULTI_ATTACH_INFO_URL[ovhSubsidiary] || MULTI_ATTACH_INFO_URL.DEFAULT;

  return (
    <>
      <TilesInputComponent<TVolumeAddon>
        value={volumeType}
        items={displayedTypes || []}
        label={(vType: TVolumeAddon) => (
          <VolumeTypeTile
            volumeType={vType}
            is3AZRegionSelected={region.type === 'region-3-az'}
          />
        )}
        onInput={setVolumeType}
      />
      {volumeType?.name === 'classic-multiattach' && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.warning}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            hue={ODS_TEXT_COLOR_HUE._700}
          >
            <Trans
              t={t}
              i18nKey="add:pci_projects_project_storages_blocks_add_type_multi_attach_banner"
              components={{
                Link: <GuideLink href={attachGuideLink} />,
              }}
            />
          </OsdsText>
        </OsdsMessage>
      )}
      {volumeType && !step.isLocked && (
        <div className="mt-6">
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => onSubmit(volumeType)}
            className="w-fit"
          >
            {t('common_stepper_next_button_label')}
          </OsdsButton>
        </div>
      )}
    </>
  );
}
