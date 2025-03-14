import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  RegionSelector,
  usePCICommonContextFactory,
  PCICommonContext,
} from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { TAvailableRegion, useData } from '@/api/hooks/data';
import { RegionType } from '@/types/region';

type IState = {
  regions: TAvailableRegion[];
  region: TAvailableRegion;
  regionsLink: string;
};

const isRegionWith3AZ = (regions: TAvailableRegion[]) =>
  regions.some((region) => region.type === RegionType['3AZ']);

/**
 *
 * @constructor
 * We relay on translations for region groups
 * Not in migration scope
 * TODO : move groups(continent) from translation files
 */
export const LocationStep = () => {
  const { t } = useTranslation(['stepper', 'add']);
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { tracking } = useContext(ShellContext).shell;
  const store = useNewGatewayStore();

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

  const has3AZ = useMemo(() => isRegionWith3AZ(state.regions), [state.regions]);

  const metaProps = usePCICommonContextFactory({ has3AZ });

  return (
    <StepComponent
      id={StepsEnum.LOCATION}
      order={2}
      isOpen={store.steps.get(StepsEnum.LOCATION).isOpen}
      isChecked={store.steps.get(StepsEnum.LOCATION).isChecked}
      isLocked={store.steps.get(StepsEnum.LOCATION).isLocked}
      title={t('add:pci_projects_project_public_gateways_add_region_title')}
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
        label: t('stepper:Next'),
        isDisabled: !state.region?.enabled,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.close(StepsEnum.NETWORK);

          store.updateForm.name(undefined);
          store.updateForm.network(undefined, undefined);
        },
        label: t('stepper:common_stepper_modify_this_step'),
        isDisabled: false,
      }}
    >
      <PCICommonContext.Provider value={metaProps}>
        <RegionSelector
          projectId={projectId}
          onSelectRegion={(region) => store.updateForm.regionName(region?.name)}
          regionFilter={(r) =>
            r.isMacro || state.regions.some(({ name }) => name === r.name)
          }
        />
      </PCICommonContext.Provider>
    </StepComponent>
  );
};
