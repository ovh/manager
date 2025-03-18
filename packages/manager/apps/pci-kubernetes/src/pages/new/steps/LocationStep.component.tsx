import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Region3AZChip,
  RegionGlobalzoneChip,
  TLocalisation,
} from '@ovh-ux/manager-pci-common';
import {
  OsdsButton,
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import {
  Links,
  LinkType,
  Subtitle,
  TRegion,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { KubeRegionSelector } from '@/components/region-selector/KubeRegionSelector.component';
import { StepState } from '../useStep';
import { KubeDeploymentTile } from '@/components/region-selector/KubeDeploymentTile';
import { DEPLOYMENT_URL } from '@/constants';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { mockAvailabilityWith3az } from '@/mocks/mockAvaibility';

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
  const [region, setRegion] = useState<TLocalisation>();
  const [selectedDeployment, setSelectedDeployment] = useState<TRegion['type']>(
    undefined,
  );
  const featureFlipping3az = use3AZPlanAvailable();

  // FIXME
  // const { data: availability } = useProductAvailability(projectId, {
  //   product: 'kubernetes',
  // });

  const product = mockAvailabilityWith3az?.products.find(
    ({ name }) => name === 'kubernetes',
  );
  const uniqueRegions = [
    ...new Set(
      product?.regions?.map((deploymentRegion) => deploymentRegion.type),
    ),
  ].sort((a, b) => {
    if (a === (RegionType.Region3Az as string)) return 1;
    if (b === (RegionType.Region3Az as string)) return -1;
    return 0;
  });

  const has3AZ =
    uniqueRegions.some(
      (deploymentRegion) =>
        deploymentRegion === (RegionType.Region3Az as string),
    ) || featureFlipping3az;

  const tilesData = uniqueRegions.map((regionType: TRegion['type']) => ({
    title: t(`add:kubernetes_add_region_title_${regionType}`),
    pillLabel:
      regionType === RegionType.Region3Az ? (
        <Region3AZChip showTooltip={false} />
      ) : (
        <RegionGlobalzoneChip showTooltip={false} />
      ),
    description: t(`add:kubernetes_add_region_description_${regionType}`),
    regionType,
  }));

  return (
    <>
      <div className={clsx(step.isLocked && 'hidden')}>
        {has3AZ && (
          <>
            <Subtitle>{t('add:kubernetes_add_deployment_mode_title')}</Subtitle>
            <div>
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('add:kubernetes_add_deployment_mode_description')}
              </OsdsText>{' '}
              <Links
                href={DEPLOYMENT_URL[ovhSubsidiary] ?? DEPLOYMENT_URL.DEFAULT}
                label={t('add:kubernetes_add_find_out_more')}
                type={LinkType.next}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 my-5">
              {tilesData.map(
                ({ title, pillLabel, description, regionType }) => (
                  <KubeDeploymentTile
                    key={regionType}
                    title={title}
                    description={description}
                    pillLabel={pillLabel}
                    setSelectedDeployment={() =>
                      setSelectedDeployment(regionType)
                    }
                    isSelected={regionType === selectedDeployment}
                  />
                ),
              )}
            </div>
            <Subtitle className="mb-6">
              {t('add:kubernetes_add_region_title')}
            </Subtitle>
          </>
        )}
        <KubeRegionSelector
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
