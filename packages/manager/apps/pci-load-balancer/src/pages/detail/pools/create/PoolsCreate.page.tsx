import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useContext, useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetApiSchema } from '@ovh-ux/manager-pci-common';
import {
  APP_COOKIE_SESSION_PERSISTENCE,
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION,
} from '@/constants';
import LabelComponent from '@/pages/detail/pools/create/Label.component';
import { TRACKING_HIT_PREFIX } from '@/pages/detail/pools/create/constants';
import { useCreatePool } from '@/api/hook/usePool';

type TState = {
  name: {
    value: string;
    isTouched: boolean;
  };
  algorithm: {
    value: string;
    isTouched: boolean;
  };
  protocol: {
    value: string;
    isTouched: boolean;
  };
  sessionType: {
    value: string;
    isTouched: boolean;
  };
  cookieName?: {
    value: string;
    isTouched: boolean;
  };
  isPermanentSession: boolean;
  algorithms: string[];
  protocols: string[];
  sessionTypes: string[];
};

export default function PoolsCreatePage() {
  const { t } = useTranslation('pools-form');
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tPools } = useTranslation('pools');

  const { tracking } = useContext(ShellContext).shell;

  const { addSuccess, addError } = useNotifications();

  const { projectId, region, loadBalancerId } = useParams();

  const navigate = useNavigate();

  const goBack = () => navigate('../list');

  const { data: schema, isPending: isSpecsPending } = useGetApiSchema();

  const getRequiredErrorMessage = (isAffirmative: boolean): string =>
    isAffirmative ? tCommon('common_field_error_required') : '';

  const [state, setState] = useState<TState>({
    name: { value: '', isTouched: false },
    algorithm: { value: '', isTouched: false },
    protocol: { value: '', isTouched: false },
    sessionType: { value: '', isTouched: false },
    cookieName: { value: '', isTouched: false },
    isPermanentSession: false,
    algorithms: [],
    protocols: [],
    sessionTypes: [],
  });

  useEffect(() => {
    if (schema) {
      const algorithms =
        schema?.models?.['cloud.loadbalancing.PoolAlgorithmEnum']?.enum || [];
      const protocols =
        schema?.models?.['cloud.loadbalancing.PoolProtocolEnum']?.enum || [];
      const sessionTypes = (
        schema?.models?.['cloud.loadbalancing.PoolSessionPersistenceTypeEnum']
          ?.enum || []
      ).filter(
        (sessionType) =>
          sessionType !== 'disabled' &&
          (!state.protocol.value ||
            PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION[
              state.protocol.value
            ].includes(sessionType)),
      );
      setState((prev) => ({
        ...prev,
        algorithm: {
          value: algorithms.includes(DEFAULT_ALGORITHM)
            ? DEFAULT_ALGORITHM
            : algorithms[0],
          isTouched: prev.algorithm.isTouched,
        },
        sessionType: {
          value: DEFAULT_SESSION_PERSISTENCE_TYPE,
          isTouched: prev.sessionType.isTouched,
        },
        algorithms,
        protocols,
        sessionTypes,
      }));
    }
  }, [schema, state.protocol]);

  // reset/set sessionType and cookieName if permanent session is disabled
  useEffect(() => {
    if (!state.isPermanentSession) {
      setState((prev) => ({
        ...prev,
        sessionType: { value: '', isTouched: false },
        cookieName: { value: '', isTouched: false },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        sessionType: {
          value: DEFAULT_SESSION_PERSISTENCE_TYPE,
          isTouched: false,
        },
      }));
    }
  }, [state.isPermanentSession]);

  // reset cookieName if sessionType is not APP_COOKIE_SESSION_PERSISTENCE
  useEffect(() => {
    if (state.sessionType.value !== APP_COOKIE_SESSION_PERSISTENCE) {
      setState((prev) => ({
        ...prev,
        cookieName: { value: '', isTouched: false },
      }));
    }
  }, [state.sessionType]);

  let isFormValid =
    state.name.value !== '' &&
    state.algorithm.value !== '' &&
    state.protocol.value !== '';

  if (state.isPermanentSession) {
    isFormValid = isFormValid && state.sessionType.value !== '';
    if (state.sessionType.value === APP_COOKIE_SESSION_PERSISTENCE) {
      isFormValid = isFormValid && state.cookieName.value !== '';
    }
  }

  const { createPool, isPending: isCreating } = useCreatePool({
    projectId,
    region,
    loadbalancerId: loadBalancerId,
    name: state.name.value,
    algorithm: state.algorithm.value,
    protocol: state.protocol.value,
    sessionPersistenceType: state.sessionType.value,
    cookieName: '',
    onSuccess: () => {
      tracking.trackClick({
        name: `${TRACKING_HIT_PREFIX}-success`,
        type: 'action',
      });
      goBack();

      addSuccess(
        <Translation ns="pools">
          {(_t) =>
            _t('octavia_load_balancer_pools_create_success', {
              pool: state.name.value,
            })
          }
        </Translation>,
        false,
      );
    },
    onError: (cause: ApiError) => {
      tracking.trackClick({
        name: `${TRACKING_HIT_PREFIX}-error`,
        type: 'action',
      });

      addError(
        <Translation ns="octavia-load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: (cause?.response?.data as { message: string })
                    ?.message,
                  requestId: cause.response?.headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
    },
  });

  const create = () => {
    tracking.trackClick({
      name: `${TRACKING_HIT_PREFIX}::confirm`,
      type: 'action',
    });
    createPool();
  };

  const cancel = () => {
    tracking.trackClick({
      name: `${TRACKING_HIT_PREFIX}::cancel`,
      type: 'action',
    });
    goBack();
  };

  const error = {
    name: state.name.isTouched && state.name.value === '',
    algorithm: state.algorithm.isTouched && state.algorithm.value === '',
    protocol: state.protocol.isTouched && state.protocol.value === '',
    sessionType: state.sessionType.isTouched && state.sessionType.value === '',
    cookieName: state.cookieName?.isTouched && state.cookieName?.value === '',
  };

  if (isSpecsPending || isCreating)
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="center" />;

  return (
    <>
      <OsdsFormField
        className="mt-4"
        inline
        error={getRequiredErrorMessage(error.name)}
      >
        <LabelComponent
          text={t('octavia_load_balancer_pools_create_name')}
          hasError={state.name.isTouched && state.name.value === ''}
          slot="label"
        />
        <OsdsInput
          value={state.name.value}
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          onOdsValueChange={(e) => {
            setState((prev) => ({
              ...prev,
              name: { value: e.detail.value, isTouched: true },
            }));
          }}
          type={ODS_INPUT_TYPE.text}
          error={state.name.isTouched && state.name.value === ''}
          className="border"
        />
      </OsdsFormField>

      <div className="my-8">
        <OsdsText
          size={ODS_TEXT_SIZE._600}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_pools_create_options')}
        </OsdsText>
      </div>

      <OsdsFormField
        className="mt-4"
        inline
        error={getRequiredErrorMessage(error.algorithm)}
      >
        <LabelComponent
          text={t('octavia_load_balancer_pools_create_algorithm')}
          helpText={t('octavia_load_balancer_pools_create_algorithm_tooltip')}
          hasError={error.algorithm}
          slot="label"
        ></LabelComponent>
        <OsdsSelect
          key={
            Date.now() /* To force update, the initial value isn't taken into account by the ods component */
          }
          className="w-[20rem]"
          value={state.algorithm.value}
          error={error.algorithm}
          onOdsBlur={() =>
            setState((prev) => ({
              ...prev,
              algorithm: {
                value: prev.algorithm.value,
                isTouched: true,
              },
            }))
          }
          onOdsValueChange={(event) => {
            setState((prev) => ({
              ...prev,
              algorithm: {
                value: event.detail.value as string,
                isTouched: true,
              },
            }));
          }}
          inline
        >
          {state.algorithms.map((algorithm) => (
            <OsdsSelectOption value={algorithm} key={algorithm}>
              {tPools(
                `octavia_load_balancer_pools_enum_algorithm_${algorithm}`,
              )}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      <OsdsFormField
        className="mt-8"
        inline
        error={getRequiredErrorMessage(error.protocol)}
      >
        <LabelComponent
          text={t('octavia_load_balancer_pools_create_protocol')}
          helpText={t('octavia_load_balancer_pools_create_protocol_tooltip')}
          slot="label"
          hasError={error.protocol}
        />
        <OsdsSelect
          className="w-[20rem] ml-4"
          value={state.protocol.value}
          error={error.protocol}
          onOdsBlur={() =>
            setState((prev) => ({
              ...prev,
              protocol: {
                value: prev.protocol.value,
                isTouched: true,
              },
            }))
          }
          onOdsValueChange={(event) =>
            setState((prev) => ({
              ...prev,
              protocol: {
                value: event.detail.value as string,
                isTouched: true,
              },
            }))
          }
          inline
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._200}
            slot="placeholder"
          >
            {t('octavia_load_balancer_pools_create_protocol_default')}
          </OsdsText>
          {state.protocols.map((protocol) => (
            <OsdsSelectOption value={protocol} key={protocol}>
              {protocol}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      <OsdsToggle
        className="mt-8"
        color={ODS_THEME_COLOR_INTENT.primary}
        checked={state.isPermanentSession || undefined}
        onClick={() =>
          setState((prev) => ({
            ...prev,
            isPermanentSession: !prev.isPermanentSession,
          }))
        }
      >
        <LabelComponent
          text={t('octavia_load_balancer_pools_create_session')}
          helpText={t('octavia_load_balancer_pools_create_session_tooltip')}
          slot="start"
          className="mr-6"
        />
      </OsdsToggle>
      {state.isPermanentSession && (
        <>
          <OsdsFormField
            className="mt-8"
            inline
            error={getRequiredErrorMessage(error.sessionType)}
          >
            <LabelComponent
              text={t('octavia_load_balancer_pools_create_persistent_session')}
              helpText={t('octavia_load_balancer_pools_create_session_tooltip')}
              slot="label"
              hasError={error.sessionType}
            />
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._200}
              slot="helper"
            >
              {t(
                `octavia_load_balancer_pools_create_persistent_session_${state.sessionType.value}`,
              )}
            </OsdsText>
            <OsdsSelect
              className="w-[20rem]"
              value={state.sessionType.value}
              error={error.algorithm}
              onOdsBlur={() =>
                setState((prev) => ({
                  ...prev,
                  sessionType: {
                    value: prev.sessionType.value,
                    isTouched: true,
                  },
                }))
              }
              onOdsValueChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  sessionType: {
                    value: event.detail.value as string,
                    isTouched: true,
                  },
                }))
              }
              inline
            >
              {state.sessionTypes.map((sessionType) => (
                <OsdsSelectOption value={sessionType} key={sessionType}>
                  {tPools(
                    `octavia_load_balancer_pools_enum_persistent_session_${sessionType}`,
                  )}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
          {state.sessionType.value === APP_COOKIE_SESSION_PERSISTENCE && (
            <OsdsFormField
              className="mt-8"
              inline
              error={getRequiredErrorMessage(error.cookieName)}
            >
              <LabelComponent
                text={t(
                  'octavia_load_balancer_pools_create_persistent_session_cookie_name',
                )}
                slot="label"
                hasError={error.cookieName}
              />
              <OsdsInput
                value={state.cookieName.value}
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                onOdsValueChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    cookieName: { value: e.detail.value, isTouched: true },
                  }));
                }}
                placeholder={t(
                  'octavia_load_balancer_pools_create_persistent_session_cookie_name',
                )}
                type={ODS_INPUT_TYPE.text}
                error={error.cookieName}
                className="border"
              />
            </OsdsFormField>
          )}
        </>
      )}
      <div className="mt-8">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.stroked}
          inline
          onClick={cancel}
        >
          {t('octavia_load_balancer_pools_create_cancel')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.flat}
          inline
          className="ml-4"
          {...(isFormValid ? {} : { disabled: true })}
          onClick={create}
        >
          {t('octavia_load_balancer_pools_create_submit')}
        </OsdsButton>
      </div>
    </>
  );
}
