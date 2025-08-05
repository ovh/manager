import {
  StepComponent,
  Subtitle,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import {
  RegionSelector,
  usePCICommonContextFactory,
  PCICommonContext,
  TDeployment,
  DeploymentTilesInput,
  TProductAvailabilityRegion,
} from '@ovh-ux/manager-pci-common';
import { Trans, useTranslation } from 'react-i18next';
import { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { RegionType } from '@/types/region';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';
import { useDeployments } from '@/api/hooks/useDeployments/useDeployments';
import { GuideLink } from '@/components/GuideLink';

const isRegionWith3AZ = (regions: TProductAvailabilityRegion[]) =>
  regions.some((region) => region.type === RegionType['3AZ']);

/**
 *
 * @constructor
 * We relay on translations for region groups
 * Not in migration scope
 * TODO : move groups(continent) from translation files
 */
export const LocationStep = ({
  regions,
}: {
  regions: TProductAvailabilityRegion[];
}) => {
  const { t } = useTranslation(['stepper', 'add', 'regions-list']);
  const { projectId } = useParams();
  const { tracking } = useContext(ShellContext).shell;
  const store = useNewGatewayStore();

  const has3AZ = useMemo(() => isRegionWith3AZ(regions), [regions]);

  const metaProps = usePCICommonContextFactory({ has3AZ });

  const [
    selectedRegionGroup,
    setSelectedRegionGroup,
  ] = useState<TDeployment | null>(null);

  const filteredRegions = useMemo(
    () =>
      selectedRegionGroup
        ? regions.filter(({ type }) => type === selectedRegionGroup.name)
        : regions,
    [regions, selectedRegionGroup],
  );

  const selectedRegionType = useMemo(
    () => regions.find((region) => store.form.regionName === region.name)?.type,
    [regions, store.form.regionName],
  );

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const deploymentModes = useDeployments(projectId);

  const deployments = useMemo<TDeployment[]>(
    () =>
      deploymentModes.map((deployment) => ({
        ...deployment,
        price: (
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('add:pci_projects_project_public_price_from', {
              price: getFormattedHourlyCatalogPrice(deployment.price),
            })}
          </OsdsText>
        ),
      })),
    [deploymentModes],
  );

  const guides = useGuideLink();

  return (
    <StepComponent
      id={StepsEnum.LOCATION}
      order={1}
      isOpen={store.steps.get(StepsEnum.LOCATION).isOpen}
      isChecked={store.steps.get(StepsEnum.LOCATION).isChecked}
      isLocked={store.steps.get(StepsEnum.LOCATION).isLocked}
      title={t('regions-list:pci_project_regions_list_region')}
      subtitle={
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('add:pci_projects_project_public_gateways_add_description3')}
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            target={OdsHTMLAnchorElementTarget._blank}
            href="https://www.ovhcloud.com/en-ie/public-cloud/regions-availability"
          >
            <OsdsIcon
              name={ODS_ICON_NAME.INFO_CIRCLE}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsLink>
        </OsdsText>
      }
      next={{
        action: (id) => {
          store.updateStep.check(id as StepsEnum);
          store.updateStep.lock(id as StepsEnum);
          store.updateStep.open(StepsEnum.SIZE);
          tracking.trackClick({
            name: 'public-gateway_add_select-region',
            type: 'action',
          });
        },
        label: t('stepper:common_stepper_next_button_label'),
        isDisabled: !store.form.regionName,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);
          store.updateStep.close(StepsEnum.SIZE);
          store.updateStep.unCheck(StepsEnum.SIZE);
          store.updateStep.unlock(StepsEnum.SIZE);

          store.updateForm.size(undefined);
          store.updateForm.network(undefined, undefined);
          store.updateStep.close(StepsEnum.NETWORK);
        },
        label: t('stepper:common_stepper_modify_this_step'),
        isDisabled: false,
      }}
    >
      <DeploymentTilesInput
        name="deployment"
        value={selectedRegionGroup}
        onChange={setSelectedRegionGroup}
        deployments={deployments}
      />
      <div className="flex flex-col gap-y-5">
        <Subtitle>
          {t('add:pci_projects_project_public_gateways_add_region_title')}
        </Subtitle>
        <PCICommonContext.Provider value={metaProps}>
          <RegionSelector
            projectId={projectId}
            onSelectRegion={(region) =>
              store.updateForm.regionName(region?.name)
            }
            regionFilter={(r) =>
              r.isMacro || filteredRegions.some(({ name }) => name === r.name)
            }
          />
        </PCICommonContext.Provider>
        {selectedRegionType === RegionType['3AZ'] && (
          <div className="mt-6">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
            >
              <Trans
                t={t}
                i18nKey="add:pci_projects_project_public_gateways_3az_guide_description"
                components={{
                  Link: <GuideLink href={guides['3AZ']} />,
                }}
              />
            </OsdsText>
          </div>
        )}
      </div>
    </StepComponent>
  );
};
