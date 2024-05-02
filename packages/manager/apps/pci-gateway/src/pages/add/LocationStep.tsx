import {
  StepComponent,
  TileInputComponent,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { v6 } from '@ovh-ux/manager-core-api';
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
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-components';
import { useMe } from '@/api/hooks/useMe';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';

const getMacroRegion = (region: string) => {
  const localZonePattern = /^lz/i;
  let macro: RegExpExecArray;
  if (
    localZonePattern.test(
      region
        .split('-')
        ?.slice(2)
        ?.join('-'),
    )
  ) {
    // The pattern for local zone is <geo_location>-LZ-<datacenter>-<letter>
    // geo_location is EU-WEST, EU-SOUTH, maybe ASIA-WEST in the future
    // datacenter: MAD, BRU
    macro = /\D{2,3}/.exec(
      region
        .split('-')
        ?.slice(3)
        ?.join('-'),
    );
  } else {
    macro = /\D{2,3}/.exec(region);
  }
  return macro ? macro[0].replace('-', '').toUpperCase() : '';
};

type TRegion = {
  name: string;
  datacenter: string;
  continentCode: string;
  enabled: boolean;
  active: boolean;
  macroName: string;
  microName: string;
  continent: string;
};

type TPlan = {
  code: string;
  regions: TRegion[];
};

type IState = {
  regions: TRegion[];
  region: TRegion;
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
  const { t: tRegion } = useTranslation('regions');
  const { projectId } = useParams();
  const { me } = useMe();

  const store = useNewGatewayStore();

  const [state, setState] = useState<IState>({
    region: undefined,
    regions: [],
  });

  useEffect(() => {
    const planCode = 'gateway.s.hour.consumption';
    if (me) {
      v6.get<TRegion[]>(`/cloud/project/${projectId}/regionAvailable`).then(
        (res1) => {
          const inactiveRegions = res1.data;
          v6.get<{ plans: TPlan[] }>(
            `/cloud/project/${projectId}/capabilities/productAvailability?ovhSubsidiary=${me.ovhSubsidiary}&planCode=${planCode}`,
          ).then((res2) => {
            const regions = res2.data.plans
              .find((plan) => plan.code === planCode)
              .regions.map((region) => ({
                ...region,
                macroName: getMacroRegion(region.name),
                microName: tRegion(
                  `manager_components_region_${getMacroRegion(
                    region.name,
                  )}_micro`,
                  { micro: region.name },
                ),
                continent: tRegion(
                  `manager_components_region_continent_${getMacroRegion(
                    region.name,
                  )}`,
                ),
                active: !inactiveRegions.some((ir) => ir.name === region.name),
              }));

            setState({ ...state, regions });
          });
        },
      );
    }
  }, [me]);

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
      }}
      edit={{
        action: (id) => {
          store.updateStep.unlock(id as StepsEnum);
        },
        label: 'Edit this step',
      }}
    >
      <TileInputComponent<TRegion, string, string>
        value={state.region}
        items={state.regions}
        label={(region) => region.microName}
        onInput={(region) => {
          setState({ ...state, region });
          store.updateForm.regionName(region.name);
        }}
        stack={{
          by: (region) => region.macroName,
          label: (region) => region.macroName,
          title: 'tabban(todo)',
        }}
        group={{
          by: (region) => region.continent,
          label: (regions) =>
            regions.length === state.regions.length
              ? 'All(todo)'
              : regions[0]?.continent,
          showAllTab: true,
        }}
      />
    </StepComponent>
  );
};
