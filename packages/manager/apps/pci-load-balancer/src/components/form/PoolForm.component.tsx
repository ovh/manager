import { useEffect, useState } from 'react';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  APP_COOKIE_SESSION_PERSISTENCE,
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION,
} from '@/constants';
import LabelComponent from './Label.component';

export type TPoolFormData = {
  name: string;
  algorithm: string;
  protocol: string;
  permanentSession: {
    isEnabled: boolean;
    type?: string;
    cookieName?: string;
  };
};

export type TPoolFormProps = {
  name?: string;
  algorithm?: string;
  protocol?: string;
  permanentSession?: {
    isEnabled?: boolean;
    type?: string;
    cookieName?: string;
  };
  availableAlgorithms: string[];
  availableProtocols: string[];
  availableSessionTypes: string[];
  onSubmit: (data: TPoolFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
};

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
  permanentSession: {
    isEnabled: boolean;
    type?: {
      value: string;
      isTouched: boolean;
    };
    cookieName?: {
      value: string;
      isTouched: boolean;
    };
  };
  algorithms: string[];
  protocols: string[];
  sessionTypes: string[];
};

export const PoolFormComponent = ({
  name = '',
  algorithm = '',
  protocol = '',
  permanentSession = { isEnabled: false, type: '', cookieName: '' },
  availableAlgorithms,
  availableProtocols,
  availableSessionTypes,
  onSubmit,
  onCancel,
  isEditMode = false,
}: Readonly<TPoolFormProps>): JSX.Element => {
  const { t } = useTranslation('pools-form');
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tPools } = useTranslation('pools');

  const sessionTypes = !protocol
    ? availableSessionTypes
    : availableSessionTypes.filter(
        (sType) =>
          protocol ||
          PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION[protocol].includes(
            sType,
          ),
      );

  const [state, setState] = useState<TState>({
    name: { value: name, isTouched: false },
    algorithm: {
      value:
        algorithm ||
        (availableAlgorithms.includes(DEFAULT_ALGORITHM)
          ? DEFAULT_ALGORITHM
          : availableAlgorithms[0]),
      isTouched: false,
    },
    protocol: { value: protocol, isTouched: false },
    permanentSession: {
      isEnabled: permanentSession.isEnabled,
      type: {
        value: sessionTypes.includes(permanentSession.type)
          ? permanentSession.type
          : DEFAULT_SESSION_PERSISTENCE_TYPE,
        isTouched: false,
      },
      cookieName: {
        value: permanentSession.cookieName || '',
        isTouched: false,
      },
    },
    algorithms: availableAlgorithms,
    protocols: availableProtocols,
    sessionTypes,
  });

  //
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      sessionTypes: !state.protocol.value
        ? availableSessionTypes
        : availableSessionTypes.filter((sType) =>
            PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION[
              state.protocol.value
            ].includes(sType),
          ),
    }));
  }, [state.protocol.value]);

  const error = {
    name: state.name.isTouched && state.name.value === '',
    algorithm: state.algorithm.isTouched && state.algorithm.value === '',
    protocol: state.protocol.isTouched && state.protocol.value === '',
    sessionType:
      state.permanentSession.type.isTouched &&
      state.permanentSession.type.value === '',
    cookieName:
      state.permanentSession.cookieName?.isTouched &&
      state.permanentSession.cookieName?.value === '',
  };
  useEffect(() => {}, []);

  const getRequiredErrorMessage = (isAffirmative: boolean): string =>
    isAffirmative ? tCommon('common_field_error_required') : '';

  let isFormValid =
    state.name.value !== '' &&
    state.algorithm.value !== '' &&
    state.protocol.value !== '';
  if (state.permanentSession.isEnabled) {
    isFormValid = isFormValid && state.permanentSession.type.value !== '';
    if (state.permanentSession.type.value === APP_COOKIE_SESSION_PERSISTENCE) {
      isFormValid =
        isFormValid && state.permanentSession.cookieName.value !== '';
    }
  }

  // reset/set sessionType and cookieName if permanent session is disabled
  useEffect(() => {
    if (!state.permanentSession.isEnabled) {
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
  }, [state.permanentSession.isEnabled]);

  // reset cookieName if sessionType is not APP_COOKIE_SESSION_PERSISTENCE
  useEffect(() => {
    if (state.permanentSession.type.value !== APP_COOKIE_SESSION_PERSISTENCE) {
      setState((prev) => ({
        ...prev,
        permanentSession: {
          ...prev.permanentSession,
          cookieName: { value: '', isTouched: false },
        },
      }));
    }
  }, [state.permanentSession.type.value]);

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
          onOdsInputBlur={() =>
            setState((prev) => ({
              ...prev,
              name: { ...prev.name, isTouched: true },
            }))
          }
          type={ODS_INPUT_TYPE.text}
          error={state.name.isTouched && state.name.value === ''}
          className="border w-[20rem]"
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
        />
        <OsdsSelect
          value={state.algorithm.value}
          error={error.algorithm}
          onOdsBlur={() => {
            setState((prev) => ({
              ...prev,
              algorithm: {
                value: prev.algorithm.value,
                isTouched: true,
              },
            }));
          }}
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
          className="w-[20rem]"
        >
          {state.algorithms.map((alg) => (
            <OsdsSelectOption value={alg} key={alg}>
              {tPools(`octavia_load_balancer_pools_enum_algorithm_${alg}`)}
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
          hasError={error.protocol}
        />
        <OsdsSelect
          value={state.protocol.value}
          error={error.protocol}
          onOdsBlur={() => {
            setState((prev) => ({
              ...prev,
              protocol: {
                value: prev.protocol.value,
                isTouched: true,
              },
            }));
          }}
          onOdsValueChange={(event) => {
            setState((prev) => ({
              ...prev,
              protocol: {
                value: event.detail.value as string,
                isTouched: true,
              },
            }));
          }}
          {...(!isEditMode ? {} : { disabled: true })}
          inline
          className="w-[20rem]"
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._200}
            slot="placeholder"
          >
            {t('octavia_load_balancer_pools_create_protocol_default')}
          </OsdsText>
          {state.protocols.map((proto) => (
            <OsdsSelectOption value={proto} key={proto}>
              {proto}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      <div className="flex mt-8">
        <LabelComponent
          text={t('octavia_load_balancer_pools_create_session')}
          helpText={t('octavia_load_balancer_pools_create_session_tooltip')}
          slot="start"
          className="mr-6"
        />
        <OsdsToggle
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={state.permanentSession.isEnabled || undefined}
          onClick={() =>
            setState((prev) => ({
              ...prev,
              permanentSession: {
                ...prev.permanentSession,
                isEnabled: !prev.permanentSession.isEnabled,
              },
            }))
          }
        ></OsdsToggle>
      </div>

      {state.permanentSession.isEnabled && (
        <>
          <OsdsFormField
            className="mt-8"
            inline
            error={getRequiredErrorMessage(error.sessionType)}
          >
            <LabelComponent
              text={t('octavia_load_balancer_pools_create_persistent_session')}
              hasError={error.sessionType}
            />
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.caption}
              slot="helper"
            >
              {t(
                `octavia_load_balancer_pools_create_persistent_session_${state.permanentSession.type.value}`,
              )}
            </OsdsText>
            <OsdsSelect
              value={state.permanentSession.type.value}
              error={error.algorithm}
              onOdsBlur={() =>
                setState((prev) => ({
                  ...prev,
                  permanentSession: {
                    ...prev.permanentSession,
                    type: {
                      value: prev.permanentSession.type.value,
                      isTouched: true,
                    },
                  },
                }))
              }
              onOdsValueChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  permanentSession: {
                    ...prev.permanentSession,
                    type: {
                      value: event.detail.value as string,
                      isTouched: true,
                    },
                  },
                }))
              }
              inline
              className="w-[20rem]"
            >
              {state.sessionTypes.map((sType) => (
                <OsdsSelectOption value={sType} key={sType}>
                  {tPools(
                    `octavia_load_balancer_pools_enum_persistent_session_${sType}`,
                  )}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
          {state.permanentSession.type.value ===
            APP_COOKIE_SESSION_PERSISTENCE && (
            <OsdsFormField
              className="mt-8"
              inline
              error={getRequiredErrorMessage(error.cookieName)}
            >
              <LabelComponent
                text={t(
                  'octavia_load_balancer_pools_create_persistent_session_cookie_name',
                )}
                hasError={error.cookieName}
              />
              <OsdsInput
                value={state.permanentSession.cookieName.value}
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                onOdsValueChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    permanentSession: {
                      ...prev.permanentSession,
                      cookieName: { value: e.detail.value, isTouched: true },
                    },
                  }));
                }}
                onOdsInputBlur={() => {
                  setState((prev) => ({
                    ...prev,
                    permanentSession: {
                      ...prev.permanentSession,
                      cookieName: {
                        ...prev.permanentSession.cookieName,
                        isTouched: true,
                      },
                    },
                  }));
                }}
                placeholder={t(
                  'octavia_load_balancer_pools_create_persistent_session_cookie_name',
                )}
                type={ODS_INPUT_TYPE.text}
                error={error.cookieName}
                className="border w-[20rem]"
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
          onClick={onCancel}
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
          onClick={() =>
            onSubmit({
              name: state.name.value,
              algorithm: state.algorithm.value,
              protocol: state.protocol.value,
              permanentSession: {
                isEnabled: state.permanentSession.isEnabled,
                type: state.permanentSession.type.value,
                cookieName: state.permanentSession.cookieName.value,
              },
            })
          }
        >
          {t(
            `octavia_load_balancer_pools_create_submit${
              isEditMode ? '_edition' : ''
            }`,
          )}
        </OsdsButton>
      </div>
    </>
  );
};
