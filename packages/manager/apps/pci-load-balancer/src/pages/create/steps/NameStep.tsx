import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  LOAD_BALANCER_CREATION_TRACKING,
  LOAD_BALANCER_NAME_REGEX,
} from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useGetFlavor } from '@/api/hook/useFlavors';
import queryClient from '@/queryClient';
import { getAllLoadBalancersQueryKey } from '@/api/hook/useLoadBalancer';

type TState = {
  isNameTouched: boolean;
};

export const NameStep = (): JSX.Element => {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tCreate } = useTranslation('create');

  const { projectId } = useParams();
  const { tracking } = useContext(ShellContext).shell;

  const store = useCreateStore();

  const [state, setState] = useState<TState>({
    isNameTouched: false,
  });

  const { data: flavor } = useGetFlavor(
    projectId,
    store.region?.name,
    store.addon,
  );

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const create = async () => {
    tracking.trackClick({
      name: LOAD_BALANCER_CREATION_TRACKING.SUBMIT,
      type: 'action',
    });

    tracking.trackClick({
      name: `${LOAD_BALANCER_CREATION_TRACKING.CONFIRM}::${store.addon.code}::${store.region.name}`,
      type: 'action',
    });

    await store.create(
      flavor,
      () => {
        tracking.trackPage({
          name: LOAD_BALANCER_CREATION_TRACKING.SUCCESS,
          type: 'navigation',
        });
        addSuccess(
          <Translation ns="create">
            {(_t) => _t('octavia_load_balancer_create_banner')}
          </Translation>,
          false,
        );
        navigate('..');
        queryClient.invalidateQueries({
          queryKey: getAllLoadBalancersQueryKey(projectId),
        });
      },
      (error: ApiError) => {
        tracking.trackPage({
          name: LOAD_BALANCER_CREATION_TRACKING.ERROR,
          type: 'navigation',
        });
        addError(
          <Translation ns="octavia-load-balancer">
            {(_t) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: _t('octavia_load_balancer_global_error', {
                    message: ((error.response as unknown) as {
                      data: { message: string };
                    }).data.message,
                    requestId: ((error.response as unknown) as {
                      headers: Record<string, unknown>;
                    }).headers['x-ovh-queryid'],
                  }),
                }}
              ></span>
            )}
          </Translation>,
          false,
        );
      },
    );
  };

  const cancel = () => {
    tracking.trackClick({
      name: LOAD_BALANCER_CREATION_TRACKING.CANCEL,
      type: 'action',
    });
    store.reset();
    navigate('..');
  };

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_name_field_label')}
      isOpen={store.steps.get(StepsEnum.NAME).isOpen}
      isChecked={store.steps.get(StepsEnum.NAME).isChecked}
      isLocked={store.steps.get(StepsEnum.NAME).isLocked}
      order={6}
    >
      <OsdsFormField
        className="mt-8"
        inline
        error={
          state.isNameTouched &&
          (!store.name.match(LOAD_BALANCER_NAME_REGEX) ||
            store.name.length > 70)
            ? tCommon('common_field_error_pattern')
            : ''
        }
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.subheading}
          slot="label"
        >
          {tCreate('octavia_load_balancer_create_name_field_label')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.subheading}
          slot="helper"
        >
          {tCreate('octavia_load_balancer_create_name_field_help')}
        </OsdsText>
        <OsdsInput
          value={store.name}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(event) =>
            store.set.name(event.target.value as string)
          }
          className={
            state.isNameTouched &&
            (!store.name.match(LOAD_BALANCER_NAME_REGEX) ||
              store.name.length > 70)
              ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
              : 'border-color-[var(--ods-color-default-200)] bg-white'
          }
          onOdsInputBlur={() => {
            setState({
              ...state,
              isNameTouched: true,
            });
          }}
        />
      </OsdsFormField>
      <div className="mt-8">
        <OsdsButton inline color={ODS_THEME_COLOR_INTENT.info} onClick={create}>
          {tCreate('octavia_load_balancer_create_title')}
        </OsdsButton>
        <OsdsButton
          inline
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.info}
          onClick={cancel}
        >
          {tCommon('common_cancel')}
        </OsdsButton>
      </div>
    </StepComponent>
  );
};
