import {
  StepComponent,
  TilesInputComponent,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { clsx } from 'clsx';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { TAvailableRegion, useData } from '@/api/hooks/data';
import { useProjectUrl } from '@/hooks/project-url';

type IState = {
  regions: TAvailableRegion[];
  region: TAvailableRegion;
  regionsLink: string;
};

/**
 *
 * @constructor
 * We relay on translations for region groups
 * Not in migration scope
 * TODO : move groups(continent) from translation files
 */
export const LocationStep = () => {
  const { t: tStepper } = useTranslation('stepper');
  const { t: tAdd } = useTranslation('add');
  const { t: tRegionsList } = useTranslation('regions-list');
  const { projectId } = useParams();
  const store = useNewGatewayStore();

  const projectUrl = useProjectUrl('public-cloud');

  const sizes = useData(projectId);

  const [state, setState] = useState<IState>({
    region: undefined,
    regions: [],
    regionsLink: '',
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      regions:
        sizes.find((size) => size.payload === store.form.size)
          ?.availableRegions || [],
    }));
  }, [sizes, store.form.size]);

  useEffect(() => {
    setState((prev) => ({ ...prev, regionsLink: `${projectId}/regions` }));
  }, [projectId]);

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
            target={OdsHTMLAnchorElementTarget._blank}
            href={
              'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability'
            }
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
        label: tStepper('Next'),
        isDisabled: state.region && !state.region.active,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.close(StepsEnum.NETWORK);

          store.updateForm.name(undefined);
          store.updateForm.network(undefined, undefined);
        },
        label: tStepper('common_stepper_modify_this_step'),
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
          label: (regions, selected: boolean) => (
            <OsdsText
              breakSpaces={false}
              size={ODS_THEME_TYPOGRAPHY_SIZE._600}
              color={
                selected
                  ? ODS_THEME_COLOR_INTENT.text
                  : ODS_THEME_COLOR_INTENT.primary
              }
            >
              <div
                className={clsx(
                  selected && 'font-bold',
                  'whitespace-nowrap px-2 text-lg',
                )}
              >
                {regions?.length === state.regions?.length
                  ? tRegionsList('pci_project_regions_list_continent_all')
                  : regions?.[0]?.continent}
              </div>
            </OsdsText>
          ),
          showAllTab: true,
        }}
      />
      {state.region && !state.region.active && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.warning}
          icon={ODS_ICON_NAME.WARNING}
          className="mt-6"
        >
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tAdd(
              'pci_projects_project_public_gateways_add_region_activate_line1',
            )}

            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              href={`${projectUrl}/regions`}
              className="mx-3"
            >
              {tAdd(
                'pci_projects_project_public_gateways_add_region_activate_line2',
              )}
            </OsdsLink>

            {tAdd(
              'pci_projects_project_public_gateways_add_region_activate_line3',
            )}
          </OsdsText>
        </OsdsMessage>
      )}
    </StepComponent>
  );
};
