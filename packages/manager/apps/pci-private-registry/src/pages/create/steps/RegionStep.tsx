import {
  StepComponent,
  TilesInputComponent,
} from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
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

export default function RegionStep() {
  const { t: tCreate } = useTranslation('create');
  const { t: tCommonField } = useTranslation('common_field');

  const { tracking } = useContext(ShellContext)?.shell || {};

  const { projectId } = useParams();
  const navigate = useNavigate();

  const store = useStore();

  const { act } = store;

  const { data: localisations } = useProjectLocalisation(projectId);
  const { data: capabilities } = useGetCapabilities(projectId);

  const regions = useMemo(() => {
    if (Array.isArray(localisations?.regions)) {
      return localisations.regions.filter((region) =>
        (capabilities || [])
          .map((capacity) => capacity.regionName)
          .includes(region.name),
      );
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
      isOpen={store.stepper[StepEnum.REGION].isOpen}
      isLocked={store.stepper[StepEnum.REGION].isLocked}
      isChecked={store.stepper[StepEnum.REGION].isChecked}
      order={1}
      title={tCreate('private_registry_create_region')}
      next={{
        action: () => {
          act.check(StepEnum.REGION);
          act.lock(StepEnum.REGION);

          act.open(StepEnum.NAME);

          tracking?.trackClick({
            name: PRIVATE_REGISTRY_CREATE_LOCATION_NEXT,
          });
        },
        label: tCommonField('common_stepper_next_button_label'),
        isDisabled: !store.state.region,
      }}
      cancel={{
        action: () => {
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_CREATE_VERSION_NEXT',
          });
          navigate('..');
        },
        label: tCommonField('common_stepper_cancel_button_label'),
      }}
      edit={{
        action: () => {
          act.close(StepEnum.NAME);
          act.uncheck(StepEnum.NAME);
          act.unlock(StepEnum.NAME);

          act.close(StepEnum.PLAN);
          act.uncheck(StepEnum.PLAN);
          act.unlock(StepEnum.PLAN);

          act.uncheck(StepEnum.REGION);
          act.unlock(StepEnum.REGION);
        },
        label: tCommonField('common_stepper_modify_this_step'),
      }}
    >
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
    </StepComponent>
  );
}
