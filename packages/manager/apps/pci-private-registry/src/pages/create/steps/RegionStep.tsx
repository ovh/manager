import {
  StepComponent,
  TilesInputComponent,
} from '@ovh-ux/manager-react-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectLocalisation } from '@ovh-ux/manager-pci-common';
import { PRIVATE_REGISTRY_CREATE_LOCATION_NEXT } from '@/pages/create/constants';
import { StepEnum } from '@/pages/create/types';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';
import { useStore } from '@/pages/create/store';

export default function RegionStep({
  isLocked,
}: Readonly<{
  isLocked?: boolean;
}>) {
  const { t: tCreate } = useTranslation('create');
  const { t: tCommonField } = useTranslation('common_field');

  const { tracking } = useContext(ShellContext)?.shell || {};

  const { projectId } = useParams();
  const navigate = useNavigate();

  const store = useStore();

  const { stepsHandle } = store;

  const { data: localisations, isPending } = useProjectLocalisation(projectId);
  const { data: capabilities } = useGetCapabilities(projectId);

  const regions = useMemo(() => {
    if (Array.isArray(localisations?.regions)) {
      return localisations.regions
        .filter((region) =>
          (capabilities || [])
            .map((capacity) => capacity.regionName)
            .includes(region.name),
        )
        .reverse();
    }
    return [];
  }, [localisations, capabilities]);

  useEffect(() => {
    if (
      Array.isArray(capabilities) &&
      capabilities.length &&
      store.state.region
    ) {
      const regionCapability = capabilities.find(
        (c) => c.regionName === store.state.region.name,
      );
      if (regionCapability) {
        const plan =
          regionCapability.plans.find((p) => p.name === 'MEDIUM') ||
          regionCapability.plans[0];

        if (plan) store.set.plan(plan);
      }
    }
  }, [capabilities, store.state.region]);

  return (
    <StepComponent
      isOpen={store.stepsState[StepEnum.REGION].isOpen}
      isLocked={isLocked || store.stepsState[StepEnum.REGION].isLocked}
      isChecked={store.stepsState[StepEnum.REGION].isChecked}
      order={1}
      title={tCreate('private_registry_create_region')}
      next={{
        action: () => {
          stepsHandle.check(StepEnum.REGION);
          stepsHandle.lock(StepEnum.REGION);

          stepsHandle.open(StepEnum.NAME);

          tracking?.trackClick({
            name: PRIVATE_REGISTRY_CREATE_LOCATION_NEXT,
            type: 'action',
          });
        },
        label: tCommonField('common_stepper_next_button_label'),
        isDisabled: !store.state.region,
      }}
      edit={
        !isLocked && {
          action: () => {
            stepsHandle.close(StepEnum.NAME);
            stepsHandle.uncheck(StepEnum.NAME);
            stepsHandle.unlock(StepEnum.NAME);

            stepsHandle.close(StepEnum.PLAN);
            stepsHandle.uncheck(StepEnum.PLAN);
            stepsHandle.unlock(StepEnum.PLAN);

            stepsHandle.uncheck(StepEnum.REGION);
            stepsHandle.unlock(StepEnum.REGION);
          },
          label: tCommonField('common_stepper_modify_this_step'),
        }
      }
    >
      {isPending && (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          className="block text-center"
        />
      )}
      {!isPending && (
        <TilesInputComponent
          items={regions}
          value={store.state.region}
          onInput={(region) => {
            store.set.region(region);
          }}
          label={(region) => region.microLabel}
          group={{
            by: (region) => region.continentLabel,
            label: (continent: string) => (
              <OsdsText
                break-spaces="false"
                size={ODS_TEXT_SIZE._600}
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._400}
              >
                <div className="whitespace-nowrap px-2 text-lg">
                  {continent ||
                    (localisations?.continents || []).find(
                      (c) => c.code === 'WORLD',
                    )?.name}
                </div>
              </OsdsText>
            ),
            showAllTab: true,
          }}
        />
      )}
    </StepComponent>
  );
}
