import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Region3AZChip,
  RegionChipByType,
  RegionGlobalzoneChip,
  TLocalisation,
} from '@ovh-ux/manager-pci-common';
import {
  OsdsButton,
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { Links, LinkType, TRegion } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { KubeRegionSelector } from '@/components/region-selector/KubeRegionSelector.component';
import { StepState } from '../useStep';
import { KubeDeploymentTile } from '@/components/region-selector/KubeDeploymentTile';
import { DEPLOYMENT_URL } from '@/constants';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';

export interface LocationStepProps {
  projectId: string;
  onSubmit: (region: TLocalisation) => void;
  step: StepState;
}

export enum RegionType {
  Region = 'region',
  Localzone = 'localzone',
  Region3Az = 'region-3-az',
}

export function LocationStep({
  projectId,
  onSubmit,
  step,
}: Readonly<LocationStepProps>) {
  const { t } = useTranslation(['stepper', 'add']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const [region, setRegion] = useState<TLocalisation | undefined>();
  const [selectedDeployment, setSelectedDeployment] = useState<TRegion['type']>(
    undefined,
  );
  const featureFlipping3az = use3AZPlanAvailable();

  const { uniqueRegions, contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;

  const tilesData = uniqueRegions.map((regionType: TRegion['type']) => ({
    title: t(`add:kubernetes_add_region_title_${regionType}`),
    pillLabel:
      regionType === RegionType.Region3Az ? (
        <div className="flex gap-4">
          <Region3AZChip showTooltip />
        </div>
      ) : (
        <RegionChipByType type="region" showTooltip />
      ),
    description: t(`add:kubernetes_add_region_description_${regionType}`),
    regionType,
  }));

  return (
    <>
      <div className={clsx(step.isLocked && 'hidden')}>
        {has3AZ && (
          <>
            <OsdsText
              className="mb-4 font-bold block"
              color={ODS_TEXT_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
            >
              {t('add:kubernetes_add_deployment_mode_title')}
            </OsdsText>
            <div>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('add:kubernetes_add_deployment_mode_description')}
              </OsdsText>{' '}
              <Links
                target={OdsHTMLAnchorElementTarget._blank}
                href={DEPLOYMENT_URL[ovhSubsidiary] ?? DEPLOYMENT_URL.DEFAULT}
                label={t('add:kubernetes_add_find_out_more')}
                type={LinkType.next}
              />
            </div>
            <div className="grid md:grid-cols-4 gap-4 my-5">
              {tilesData.map(
                ({ title, pillLabel, description, regionType }) => (
                  <KubeDeploymentTile
                    key={regionType}
                    title={title}
                    description={description}
                    pillLabel={pillLabel}
                    onSelectedDeployment={() => {
                      setSelectedDeployment(regionType);
                      setRegion(undefined);
                    }}
                    isSelected={regionType === selectedDeployment}
                  />
                ),
              )}
            </div>
            <OsdsText
              className="mb-4 font-bold block"
              color={ODS_TEXT_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
            >
              {t('add:kubernetes_add_region_title')}
            </OsdsText>
          </>
        )}
        <KubeRegionSelector
          key={selectedDeployment}
          projectId={projectId}
          onSelectRegion={setRegion}
          selectedDeployment={selectedDeployment}
        />
      </div>
      {step.isLocked && region && (
        <OsdsTile color={ODS_THEME_COLOR_INTENT.primary} inline>
          <OsdsText
            className="block w-[20rem]"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {region.macroLabel}
          </OsdsText>
          <OsdsDivider separator />
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {region.microLabel}
          </OsdsText>
        </OsdsTile>
      )}
      {!step.isLocked && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={region ? undefined : true}
          onClick={() => region && onSubmit(region)}
        >
          {t('stepper:common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
