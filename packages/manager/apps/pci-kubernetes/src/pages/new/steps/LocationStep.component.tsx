import { useContext, useEffect, useState } from 'react';

import { clsx } from 'clsx';
import { Translation, useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_CHIP_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsDivider,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import { LinkType, Links, Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useAddProjectRegion } from '@/api/hooks/useAddRegion';
import { useRefreshProductAvailability } from '@/api/hooks/useAvailability';
import { KubeDeploymentTile } from '@/components/region-selector/KubeDeploymentTile';
import { KubeRegionSelector } from '@/components/region-selector/KubeRegionSelector.component';
import { DEPLOYMENT_URL, PLAN_DOC_LINKS } from '@/constants';
import { use3azAvailability } from '@/hooks/useFeatureAvailability';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';
import { DeploymentMode } from '@/types';
import { TLocation } from '@/types/region';

import { StepState } from '../hooks/useStep';
import Loader from './Loader';

export interface LocationStepProps {
  projectId: string;
  onSubmit: (region: TLocation) => void;
  step: StepState;
}

export enum RegionType {
  Region = 'region',
  Localzone = 'localzone',
  Region3Az = 'region-3-az',
}

export function LocationStep({ projectId, onSubmit, step }: Readonly<LocationStepProps>) {
  const { t } = useTranslation(['stepper', 'add', 'region-selector', 'versions']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const [region, setRegion] = useState<TLocation | null>();
  const { data: featureFlipping3az } = use3azAvailability();

  const { uniqueRegions, contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentMode | undefined>(
    undefined,
  );

  const tilesData = uniqueRegions.map((regionType: DeploymentMode) => ({
    title: t(`add:kubernetes_add_region_title_${regionType}`),
    badge: () =>
      DeploymentMode.MULTI_ZONES === regionType ? (
        <OsdsChip color={ODS_THEME_COLOR_INTENT.success} size={ODS_CHIP_SIZE.sm}>
          {t('versions:pci_project_versions_recommended_version_male')}
        </OsdsChip>
      ) : null,
    pillLabel: <RegionChipByType type={regionType} showTooltip={false} />,
    description: t(`add:kubernetes_add_region_description_${regionType}`),
    regionType,
  }));
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { refresh: refreshRegionStatus } = useRefreshProductAvailability(projectId, ovhSubsidiary, {
    addonFamily: 'mks',
  });

  useEffect(() => {
    if (!step.isLocked) {
      clearNotifications();
    }
    return clearNotifications;
  }, [clearNotifications, step.isLocked]);

  useEffect(() => {
    if (has3AZ) {
      setSelectedDeployment(DeploymentMode.MULTI_ZONES);
    }
  }, [has3AZ]);

  const {
    isPending,
    addRegion,
    error: addRegionError,
    isSuccess: addRegionSuccess,
  } = useAddProjectRegion({
    projectId,
    onSuccess: async (data: TLocation) => {
      await refreshRegionStatus();
      addSuccess(
        t('region-selector:pci_projects_project_regions_add_region_success', {
          code: data.name,
        }),
      );

      onSubmit({ ...data, codes: region?.codes });
      setRegion((reg) => reg && { ...reg, enabled: true });
    },
    onError: (error: ApiError) =>
      addError(
        <Translation ns="region-selector">
          {(_t) =>
            _t('pci_projects_project_storages_containers_add_add_region_error', {
              message: error?.response?.data?.message || error?.message || null,
              requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
            })
          }
        </Translation>,
        true,
      ),
  });

  const handleClick = () => {
    if (region) {
      return !region.enabled ? addRegion(region.name) : onSubmit(region);
    }
    return null;
  };

  const hasStandardPlanFeature = useStandardPlanAvailable();

  const planDocumentationLink =
    PLAN_DOC_LINKS[ovhSubsidiary as keyof typeof PLAN_DOC_LINKS] ?? PLAN_DOC_LINKS.DEFAULT;

  return (
    <>
      <div className={clsx(step.isLocked && 'hidden')}>
        {has3AZ && (
          <>
            <Subtitle>{t('add:kubernetes_add_deployment_mode_title')}</Subtitle>
            <div className="max-w-3xl">
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('add:kubernetes_add_deployment_mode_description')}
              </OsdsText>{' '}
              <Links
                target={OdsHTMLAnchorElementTarget._blank}
                href={
                  DEPLOYMENT_URL[ovhSubsidiary as keyof typeof DEPLOYMENT_URL] ??
                  DEPLOYMENT_URL.DEFAULT
                }
                label={t('add:kubernetes_add_find_out_more')}
                type={LinkType.next}
              />
            </div>
            {hasStandardPlanFeature && (
              <OsdsMessage
                type={ODS_MESSAGE_TYPE.info}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="my-6 block max-w-3xl"
              >
                <div className="flex flex-col gap-4">
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t('region-selector:pci_projects_project_regions_filter_plan_message')}
                  </OsdsText>

                  <Links
                    type={LinkType.external}
                    target={OdsHTMLAnchorElementTarget._blank}
                    href={planDocumentationLink}
                    label={t('region-selector:pci_projects_project_regions_filter_plan_compare')}
                  />
                </div>
              </OsdsMessage>
            )}
            <div className="my-5 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {tilesData.map(({ title, pillLabel, description, regionType, badge }) => (
                <KubeDeploymentTile
                  key={regionType}
                  title={title}
                  badge={badge}
                  description={description}
                  pillLabel={pillLabel}
                  onSelectedDeployment={() => {
                    setSelectedDeployment(regionType);
                    setRegion(undefined);
                  }}
                  isSelected={regionType === selectedDeployment}
                />
              ))}
            </div>
            <Subtitle className="mb-6">{t('add:kubernetes_add_region_title')}</Subtitle>
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
            className="block w-80"
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
      {isPending && (
        <div className="mt-4">
          <Loader />
        </div>
      )}
      {!step.isLocked && !isPending && (
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={region ? undefined : true}
          onClick={handleClick}
        >
          {t('stepper:common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
