import {
  StepComponent,
  TilesInputComponent,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { clsx } from 'clsx';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { TAvailableRegion, useData } from '@/api/hooks/data';

type IState = {
  regions: TAvailableRegion[];
  region: TAvailableRegion;
  regionsLink: string;
  selectedContinent: string;
  selectedMacroName: string;
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
  const [searchParams] = useSearchParams();
  const { tracking } = useContext(ShellContext).shell;
  const store = useNewGatewayStore();

  const projectUrl = useProjectUrl('public-cloud');

  const sizes = useData(projectId);

  const [state, setState] = useState<IState>({
    region: undefined,
    regions: [],
    regionsLink: '',
    selectedContinent: undefined,
    selectedMacroName: undefined,
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

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      region: state.regions.find(
        (region) => region.name === store.form.regionName,
      ),
    }));
  }, [store.form.regionName]);

  useEffect(() => {
    const regionName = searchParams.get('region');
    if (regionName) {
      const targetRegion = state.regions.find(
        (region) => region.name === regionName,
      );
      if (targetRegion) {
        setState((prev) => ({
          ...prev,
          region: targetRegion,
        }));
        store.updateForm.regionName(targetRegion.name);
      }
    }
  }, [searchParams, state.regions]);

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
        action: store.form.regionName
          ? (id) => {
              store.updateStep.check(id as StepsEnum);
              store.updateStep.lock(id as StepsEnum);
              store.updateStep.open(StepsEnum.NETWORK);
              tracking.trackClick({
                name: 'public-gateway_add_select-region',
                type: 'action',
              });
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
          store.updateForm.regionName(region?.name);
        }}
        stack={{
          by: (region) => region?.macroName,
          label: (macroName) => macroName,
          title: () => tRegionsList('pci_project_regions_list_region'),
          onChange: (language) =>
            setState({ ...state, selectedMacroName: language }),
        }}
        group={{
          by: (region) => region.continent,
          label: (continent) => (
            <OsdsText
              breakSpaces={false}
              size={ODS_THEME_TYPOGRAPHY_SIZE._600}
              color={
                continent === state.selectedContinent
                  ? ODS_THEME_COLOR_INTENT.text
                  : ODS_THEME_COLOR_INTENT.primary
              }
            >
              <div
                className={clsx(
                  continent === state.selectedContinent && 'font-bold',
                  'whitespace-nowrap px-2 text-lg',
                )}
              >
                {undefined === continent
                  ? tRegionsList('pci_project_regions_list_continent_all')
                  : continent}
              </div>
            </OsdsText>
          ),
          showAllTab: true,
          onChange: (continent) =>
            setState({ ...state, selectedContinent: continent }),
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
