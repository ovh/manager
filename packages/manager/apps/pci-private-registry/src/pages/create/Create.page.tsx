import {
  Headers,
  Notifications,
  StepComponent,
  TilesInputComponent,
  useNotifications,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import {
  useProject,
  useProjectLocalisation,
  PciDiscoveryBanner,
  isDiscoveryProject,
} from '@ovh-ux/manager-pci-common';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';
import PlanComponent from '@/pages/create/Plan.component';
import { TStepperState, StepEnum, TState } from '@/pages/create/types';
import { createRegistry } from '@/api/data/registry';
import {
  PRIVATE_REGISTRY_CREATE_LOCATION_NEXT,
  PRIVATE_REGISTRY_CREATE_PLAN,
} from '@/pages/create/constants';

export default function CreatePage(): JSX.Element {
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('common');
  const { t: tUpgrade } = useTranslation('upgrade');
  const { t: tCommonField } = useTranslation('common_field');

  const { addError, addSuccess } = useNotifications();

  const { tracking } = useContext(ShellContext)?.shell || {};

  const { projectId } = useParams();
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const navigate = useNavigate();

  const { data: localisations } = useProjectLocalisation(projectId);
  const { data: capabilities } = useGetCapabilities(projectId);

  const [state, setState] = useState<TState>({
    name: {
      value: '',
      touched: false,
    },
    region: null,
    plan: undefined,
  });

  useEffect(() => {
    if (Array.isArray(capabilities) && capabilities.length && state.region) {
      const regionCapability = capabilities.find(
        (c) => c.regionName === state.region.name,
      );
      if (regionCapability) {
        const plan =
          regionCapability.plans.find((p) => p.name === 'MEDIUM') ||
          regionCapability.plans[0];

        if (plan) setState((prev) => ({ ...prev, plan }));
      }
    }
  }, [capabilities, state.region]);

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

  const [stepperState, setStepperState] = useState<TStepperState>({
    [StepEnum.REGION]: {
      isOpen: true,
      isLocked: false,
      isChecked: false,
    },
    [StepEnum.NAME]: {
      isOpen: false,
      isLocked: false,
      isChecked: false,
    },
    [StepEnum.PLAN]: {
      isOpen: false,
      isLocked: false,
      isChecked: false,
    },
  });

  const act = {
    open: (step: StepEnum) => {
      setStepperState((prevState) => ({
        ...prevState,
        [step]: {
          ...prevState[step],
          isOpen: true,
        },
      }));
    },
    close: (step: StepEnum) => {
      setStepperState((prevState) => ({
        ...prevState,
        [step]: {
          ...prevState[step],
          isOpen: false,
        },
      }));
    },
    check: (step: StepEnum) => {
      setStepperState((prevState) => ({
        ...prevState,
        [step]: {
          ...prevState[step],
          isChecked: true,
        },
      }));
    },
    uncheck: (step: StepEnum) => {
      setStepperState((prevState) => ({
        ...prevState,
        [step]: {
          ...prevState[step],
          isChecked: false,
        },
      }));
    },
    lock: (step: StepEnum) => {
      setStepperState((prevState) => ({
        ...prevState,
        [step]: {
          ...prevState[step],
          isLocked: true,
        },
      }));
    },
    unlock: (step: StepEnum) => {
      setStepperState((prevState) => ({
        ...prevState,
        [step]: {
          ...prevState[step],
          isLocked: false,
        },
      }));
    },
  };

  const createPrivateRegistry = async () => {
    tracking?.trackClick({
      name: `${PRIVATE_REGISTRY_CREATE_PLAN}${state.plan.name[0]}`,
    });
    const payload = {
      name: state.name.value,
      region: state.region.name,
      planID: state.plan.id,
    };

    try {
      await createRegistry(projectId, payload);
      addSuccess(
        <OsdsText
          break-spaces="false"
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          {tCommon('private_registry_onboarding_success', {
            registryName: state.name.value,
          })}
        </OsdsText>,
        true,
      );
    } catch (e) {
      addError(
        <OsdsText
          break-spaces="false"
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          {tCommon('private_registry_onboarding_error', {
            message:
              e?.response?.data.message ||
              e?.error?.message ||
              e?.message ||
              '',
          })}
        </OsdsText>,
        false,
      );
    } finally {
      navigate('..');
    }
  };

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              href: backHref,
              label: tCommon('private_registry_title'),
            },
            {
              label: tCreate('private_registry_create'),
            },
          ]}
        />
      )}
      <div className="header mt-8">
        <Headers title={tCreate('private_registry_create')} />
      </div>
      <Notifications />
      <PciDiscoveryBanner project={project} />
      {isDiscoveryProject(project) && <div className="mt-6"></div>}
      <StepComponent
        isOpen={stepperState[StepEnum.REGION].isOpen}
        isLocked={stepperState[StepEnum.REGION].isLocked}
        isChecked={stepperState[StepEnum.REGION].isChecked}
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
          isDisabled: !state.region,
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
            // TODO: add tracking
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
          value={state.region}
          onInput={(region) => {
            setState((prev) => ({ ...prev, region }));
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
      <StepComponent
        isOpen={stepperState[StepEnum.NAME].isOpen}
        isLocked={stepperState[StepEnum.NAME].isLocked}
        isChecked={stepperState[StepEnum.NAME].isChecked}
        order={2}
        title={tCreate('private_registry_create_name_cluster')}
        next={{
          action: () => {
            act.check(StepEnum.NAME);
            act.lock(StepEnum.NAME);

            act.open(StepEnum.PLAN);
          },
          label: tCommonField('common_stepper_next_button_label'),
          isDisabled: !state.name.value.length,
        }}
        edit={{
          action: () => {
            act.close(StepEnum.PLAN);
            act.uncheck(StepEnum.PLAN);
            act.unlock(StepEnum.PLAN);

            act.uncheck(StepEnum.NAME);
            act.unlock(StepEnum.NAME);
          },
          label: tCommonField('common_stepper_modify_this_step'),
        }}
      >
        <OsdsFormField
          className="mt-4"
          inline
          error={
            state.name.touched && !state.name.value.length
              ? tCommonField('common_field_error_required')
              : ''
          }
        >
          <OsdsText
            slot="label"
            color={
              state.name.touched && !state.name.value.length
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.text
            }
            className="mt-4"
            size={ODS_TEXT_SIZE._100}
          >
            {tCommon('private_registry_create_name_label')}
          </OsdsText>
          <OsdsInput
            value={state.name.value}
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            onOdsValueChange={(e) => {
              setState((prev) => ({
                ...prev,
                name: { value: e.detail.value, touched: true },
              }));
            }}
            type={ODS_INPUT_TYPE.text}
            error={state.name.touched && !state.name.value.length}
            className="border"
          />
        </OsdsFormField>
      </StepComponent>
      <StepComponent
        isOpen={stepperState[StepEnum.PLAN].isOpen}
        isLocked={stepperState[StepEnum.PLAN].isLocked}
        isChecked={stepperState[StepEnum.PLAN].isChecked}
        order={3}
        title={tCreate('private_registry_create_choose_plan')}
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {tUpgrade('private_registry_upgrade_plan_description')}
        </OsdsText>
        {state.region && (
          <TilesInputComponent
            items={
              capabilities.find((c) => c.regionName === state.region.name).plans
            }
            value={state.plan}
            onInput={(value) => {
              setState((prev) => ({ ...prev, plan: value }));
            }}
            label={(item) => <PlanComponent plan={item} />}
          />
        )}

        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          <i>{tUpgrade('private_registry_upgrade_plan_warning')}</i>
        </OsdsText>
        <div className="mt-8 flex">
          <OsdsButton
            data-testid="next-cta"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={async () => {
              await createPrivateRegistry();
            }}
            className="w-fit"
          >
            {tCommon('private_registry_common_create')}
          </OsdsButton>
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={() => {
              tracking?.trackClick({
                name: 'PRIVATEREGISTRY_CREATE_PLAN_CANCEL',
              });
              navigate('..');
            }}
            className="w-fit"
          >
            {tCommon('private_registry_common_cancel')}
          </OsdsButton>
        </div>
      </StepComponent>
    </>
  );
}
