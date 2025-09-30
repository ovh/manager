import { useContext, useEffect, useState } from 'react';

import clsx from 'clsx';
import { Translation, useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import {
  LinkType,
  Links,
  Notifications,
  Subtitle,
  TRegion,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useAddProjectRegion } from '@/api/hooks/useAddRegion';
import { useRefreshProductAvailability } from '@/api/hooks/useAvailability';
import { KubeDeploymentTile } from '@/components/region-selector/KubeDeploymentTile';
import { KubeRegionSelector } from '@/components/region-selector/KubeRegionSelector.component';
import { DEPLOYMENT_URL } from '@/constants';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import useHas3AZRegions from '@/hooks/useHas3AZRegions';
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
  const [region, setRegion] = useState<TLocation | undefined>();
  const featureFlipping3az = use3AZPlanAvailable();

  const { uniqueRegions, contains3AZ } = useHas3AZRegions();
  const has3AZ = contains3AZ && featureFlipping3az;
  const [selectedDeployment, setSelectedDeployment] = useState<TRegion['type'] | undefined>(
    undefined,
  );

  const tilesData = uniqueRegions.map((regionType: TRegion['type']) => ({
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
    product: 'kubernetes',
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
    onSuccess: (data: TLocation) => {
      refreshRegionStatus();
      addSuccess(
        t('region-selector:pci_projects_project_regions_add_region_success', {
          code: data.name,
        }),
      );
      onSubmit(data);
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

  return (
    <>
      {(addRegionError || addRegionSuccess) && (
        <div className="my-4">
          <Notifications />
        </div>
      )}
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
                target={OdsHTMLAnchorElementTarget._blank}
                href={
                  DEPLOYMENT_URL[ovhSubsidiary as keyof typeof DEPLOYMENT_URL] ??
                  DEPLOYMENT_URL.DEFAULT
                }
                label={t('add:kubernetes_add_find_out_more')}
                type={LinkType.next}
              />
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
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
