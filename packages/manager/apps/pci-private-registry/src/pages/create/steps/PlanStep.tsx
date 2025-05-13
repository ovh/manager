import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation, Translation } from 'react-i18next';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { StepEnum } from '@/pages/create/types';
import { useStore } from '@/pages/create/store';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';
import { PRIVATE_REGISTRY_CREATE_PLAN } from '@/pages/create/constants';
import PlanChooser from '@/components/PlanChooser.component';
import queryClient from '@/queryClient';
import { getRegistryQueryPrefix } from '@/api/hooks/useRegistry';

export default function PlanStep({
  isCreationDisabled,
}: {
  isCreationDisabled?: boolean;
}): JSX.Element {
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('common');
  const { t: tUpgrade } = useTranslation('upgrade');

  const { tracking } = useContext(ShellContext)?.shell || {};

  const { projectId } = useParams();
  const navigate = useNavigate();

  const store = useStore();

  const { addSuccess, addError } = useNotifications();

  const { data: capabilities, isPending } = useGetCapabilities(projectId);

  const createCallbacks = {
    success: () => {
      queryClient.invalidateQueries({
        queryKey: getRegistryQueryPrefix(projectId),
      });
      addSuccess(
        <Translation ns="common">
          {(_t) => (
            <OsdsText
              break-spaces="false"
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            >
              {_t('private_registry_onboarding_success', {
                registryName: store.state.name.value,
              })}
            </OsdsText>
          )}
        </Translation>,
        true,
      );
    },
    error: (e: {
      response: { data: { message: never } };
      error: { message: never };
      message: never;
    }) => {
      addError(
        <Translation ns="common">
          {(_t) => (
            <OsdsText
              break-spaces="false"
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            >
              {_t('private_registry_onboarding_error', {
                message:
                  e?.response?.data.message ||
                  e?.error?.message ||
                  e?.message ||
                  '',
              })}
            </OsdsText>
          )}
        </Translation>,
        false,
      );
    },
    end: () => {
      navigate('..');
    },
  };

  const create = () => {
    tracking?.trackClick({
      name: `${PRIVATE_REGISTRY_CREATE_PLAN}${store.state.plan.name[0]}`,
      type: 'action',
    });

    store.create(projectId, createCallbacks);
  };

  return (
    <StepComponent
      id="plan"
      isOpen={store.stepsState[StepEnum.PLAN].isOpen}
      isLocked={store.stepsState[StepEnum.PLAN].isLocked}
      isChecked={store.stepsState[StepEnum.PLAN].isChecked}
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
      {isPending && (
        <div className="mt-5">
          <OsdsSpinner inline />
        </div>
      )}
      {!isPending && store.state.region && (
        <PlanChooser
          plan={store.state.plan}
          plans={
            capabilities.find((c) => c.regionName === store.state.region.name)
              .plans
          }
          onInput={(value) => store.set.plan(value)}
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
          onClick={() => {
            if (!isCreationDisabled) create();
          }}
          disabled={isCreationDisabled || undefined}
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
              type: 'action',
            });
            navigate('..');
          }}
          className="w-fit"
        >
          {tCommon('private_registry_common_cancel')}
        </OsdsButton>
      </div>
    </StepComponent>
  );
}
