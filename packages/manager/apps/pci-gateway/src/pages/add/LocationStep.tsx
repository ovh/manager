import {
  StepComponent,
  TilesInputComponent,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { TAvailableRegion, useData } from '@/api/hooks/data';

type IState = {
  regions: TAvailableRegion[];
  region: TAvailableRegion;
};

/**
 *
 * @constructor
 * We relay on translations for region groups
 * Not in migration scope
 * TODO : move groups(continent) from translation files
 */
export const LocationStep = () => {
  const { t: tAdd } = useTranslation('add');
  const { t: tRegionsList } = useTranslation('regions-list');
  const { projectId } = useParams();
  const store = useNewGatewayStore();

  const sizes = useData(projectId);

  const [state, setState] = useState<IState>({
    region: undefined,
    regions: [],
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      regions:
        sizes.find((size) => size.payload === store.form.size)
          ?.availableRegions || [],
    }));
  }, [sizes, store.form.size]);

  return (
    <StepComponent
      id={StepsEnum.LOCATION}
      order={2}
      isOpen={store.steps.get(StepsEnum.LOCATION).isOpen}
      isChecked={store.steps.get(StepsEnum.LOCATION).isChecked}
      isLocked={store.steps.get(StepsEnum.LOCATION).isLocked}
      title={tAdd('pci_projects_project_public_gateways_add_region_title')}
      subtitle={
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_public_gateways_add_description3')}
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            // target={OdsHTMLAnchorElementTarget._blank}
            href="https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/"
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
        action: store.form.regionName
          ? (id) => {
              store.updateStep.check(id as StepsEnum);
              store.updateStep.lock(id as StepsEnum);
              store.updateStep.open(StepsEnum.NETWORK);
            }
          : undefined,
        label: 'Next',
        isDisabled: false,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.close(StepsEnum.NETWORK);

          store.updateForm.name(undefined);
          store.updateForm.network(undefined, undefined);
        },
        label: 'Edit this step',
        isDisabled: false,
      }}
    >
      <TilesInputComponent<TAvailableRegion, string, string>
        value={state.region}
        items={state.regions}
        label={(region) => region.microName}
        onInput={(region) => {
          setState({ ...state, region });
          store.updateForm.regionName(region?.name);
        }}
        stack={{
          by: (region) => region.macroName,
          label: (regions) => regions[0]?.macroName,
          title: tRegionsList('pci_project_regions_list_region'),
        }}
        group={{
          by: (region) => region.continent,
          label: (regions) =>
            regions.length === state.regions.length
              ? tRegionsList('pci_project_regions_list_continent_all')
              : regions[0]?.continent,
          showAllTab: true,
        }}
      />
    </StepComponent>
  );
};
