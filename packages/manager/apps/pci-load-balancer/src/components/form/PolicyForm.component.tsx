import { useEffect, useMemo, useState } from 'react';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  OdsSelectValueChangeEventDetail,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { QuantitySelector } from '@ovh-ux/manager-pci-common';
import { useParams } from 'react-router-dom';
import { TL7Policy } from '@/api/data/l7Policies';
import {
  ACTIONS,
  ACTIONS_LIST,
  LISTENER_POOL_PROTOCOL_COMBINATION,
  REDIRECT_HTTP_CODES,
  UNAVAILABLE_POOL_PROTOCOLS,
  URL_PATTERN,
  URL_PLACEHOLDER,
} from '@/constants';
import LabelComponent from '@/components/form/Label.component';
import { TLoadBalancerPool } from '@/api/data/pool';
import { TLoadBalancerListener } from '@/api/data/listener';

type PolicyFormProps = {
  policy: TL7Policy | null;
  pools: TLoadBalancerPool[];
  listener: TLoadBalancerListener;
  onSubmit: (policy: TL7Policy) => void;
  submitButtonText?: string;
  onCancel: () => void;
};
export default function PolicyForm({
  policy,
  pools,
  listener,
  onSubmit,
  submitButtonText,
  onCancel,
}: Readonly<PolicyFormProps>) {
  const { t } = useTranslation('l7/policy-form');
  const { t: tPciCommon } = useTranslation('pci-common');
  const { listenerId } = useParams();
  const [policyState, setPolicyState] = useState<TL7Policy>({
    listenerId,
    position: 1,
    redirectHttpCode: undefined,
    redirectPoolId: undefined,
    redirectPrefix: undefined,
    redirectUrl: undefined,
    name: '',
    action: '',
  } as TL7Policy);

  const filteredPools = useMemo(() => {
    if (pools && listener) {
      return pools?.filter(
        (pool) =>
          !UNAVAILABLE_POOL_PROTOCOLS.includes(pool.protocol) &&
          LISTENER_POOL_PROTOCOL_COMBINATION[listener?.protocol]?.includes(
            pool.protocol,
          ),
      );
    }
    return [];
  }, [pools, listener]);

  const [isTouchedName, setIsTouchedName] = useState(false);
  const [isTouchedPrefix, setIsTouchedPrefix] = useState(false);
  const [isTouchedURL, setIsTouchedURL] = useState(false);
  const [hasErrorName, setHasErrorName] = useState(false);

  useEffect(() => {
    setHasErrorName(isTouchedName && policyState.name === '');
  }, [policyState.name, isTouchedName]);

  const onActionChange = (
    event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    const action = event.detail.value as string;
    const policyUpdate = {
      action,
    } as TL7Policy;

    if ([ACTIONS.REDIRECT_TO_URL, ACTIONS.REDIRECT_PREFIX].includes(action)) {
      policyUpdate.redirectHttpCode = 302;
    } else {
      policyUpdate.redirectHttpCode = undefined;
    }
    if (action !== ACTIONS.REDIRECT_TO_URL) {
      policyUpdate.redirectUrl = undefined;
      setIsTouchedURL(false);
    }
    if (action !== ACTIONS.REDIRECT_PREFIX) {
      policyUpdate.redirectPrefix = undefined;
      setIsTouchedPrefix(false);
    }
    setPolicyState((state) => ({
      ...state,
      ...policyUpdate,
      action,
    }));
  };

  const prefixError = useMemo(() => {
    if (isTouchedPrefix) {
      if (!policyState.redirectPrefix) {
        return tPciCommon('common_field_error_required');
      }
      if (!RegExp(URL_PATTERN).test(policyState.redirectPrefix)) {
        return tPciCommon('common_field_error_pattern');
      }
    }
    return '';
  }, [isTouchedPrefix, policyState.redirectPrefix]);

  const isDisabled = useMemo(() => {
    switch (policyState.action) {
      case ACTIONS.REDIRECT_TO_URL:
        return (
          !policyState.name ||
          !RegExp(URL_PATTERN).test(policyState.redirectUrl)
        );
      case ACTIONS.REDIRECT_PREFIX:
        return (
          !policyState.name ||
          !RegExp(URL_PATTERN).test(policyState.redirectPrefix)
        );
      case ACTIONS.REJECT:
        return !policyState.name;
      case ACTIONS.REDIRECT_TO_POOL:
        return !policyState.name || !policyState.redirectPoolId;
      default:
        return true;
    }
  }, [policyState]);

  useEffect(() => {
    if (policy) {
      setPolicyState(() => policy);
    }
  }, [policy]);

  return (
    <div className="w-[20rem]">
      <OsdsFormField
        error={hasErrorName ? tPciCommon('common_field_error_required') : ''}
      >
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_policy_name')}
          hasError={hasErrorName}
        />
        <OsdsInput
          value={policyState.name}
          data-testid="policyForm-name_input"
          type={ODS_INPUT_TYPE.text}
          error={hasErrorName}
          onOdsValueChange={(event) => {
            setPolicyState((state) => ({
              ...state,
              name: event.detail.value,
            }));
          }}
          onOdsInputBlur={() => {
            setIsTouchedName(true);
          }}
        />
      </OsdsFormField>

      <QuantitySelector
        value={policyState.position}
        className="mt-8"
        min={1}
        label={t('octavia_load_balancer_create_l7_policy_position')}
        description={t(
          'octavia_load_balancer_create_l7_policy_position_description',
        )}
        onValueChange={(quantity) => {
          setPolicyState((state) => ({
            ...state,
            position: quantity,
          }));
        }}
      />

      <OsdsFormField className="mt-8">
        <LabelComponent
          text={t('octavia_load_balancer_create_l7_policy_action')}
        />
        <OsdsSelect
          onOdsValueChange={onActionChange}
          value={policyState.action}
          defaultValue={policyState.action}
        >
          <span slot="placeholder">
            {t('octavia_load_balancer_create_l7_policy_action_default')}
          </span>
          {ACTIONS_LIST.map((action) => (
            <OsdsSelectOption key={action.value} value={action.value}>
              {action.label}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
        {policyState.action && (
          <OsdsText slot="helper" color={ODS_THEME_COLOR_INTENT.text}>
            {t(
              `octavia_load_balancer_create_l7_policy_action_${policyState.action}`,
            )}
          </OsdsText>
        )}
      </OsdsFormField>
      {policyState.action === ACTIONS.REDIRECT_TO_URL && (
        <>
          <OsdsFormField
            className="mt-8"
            error={
              isTouchedURL && !policyState.redirectUrl
                ? tPciCommon('common_field_error_required')
                : ''
            }
          >
            <LabelComponent
              text={t('octavia_load_balancer_create_l7_policy_url')}
              hasError={
                isTouchedURL &&
                (!policyState.redirectUrl ||
                  !RegExp(URL_PATTERN).test(policyState.redirectUrl))
              }
            />
            <OsdsInput
              value={policyState?.redirectUrl}
              type={ODS_INPUT_TYPE.text}
              placeholder={URL_PLACEHOLDER}
              error={
                isTouchedURL &&
                (!policyState.redirectUrl ||
                  !RegExp(URL_PATTERN).test(policyState.redirectUrl))
              }
              onOdsValueChange={(event) => {
                setPolicyState((state) => ({
                  ...state,
                  redirectUrl: event.detail.value,
                }));
              }}
              onOdsInputBlur={() => {
                setIsTouchedURL(true);
              }}
            />
          </OsdsFormField>

          <OsdsFormField className="mt-8">
            <LabelComponent
              text={t('octavia_load_balancer_create_l7_policy_http_code')}
            />
            <OsdsSelect
              value={policyState?.redirectHttpCode}
              onOdsValueChange={(event) => {
                setPolicyState((state) => ({
                  ...state,
                  redirectHttpCode: event.detail.value as number,
                }));
              }}
            >
              {REDIRECT_HTTP_CODES.map((httpCode) => (
                <OsdsSelectOption key={httpCode} value={httpCode}>
                  {httpCode}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
        </>
      )}

      {policyState.action === ACTIONS.REDIRECT_PREFIX && (
        <>
          <OsdsFormField className="mt-8" error={prefixError}>
            <LabelComponent
              text={t('octavia_load_balancer_create_l7_policy_prefix')}
              hasError={
                isTouchedPrefix &&
                (!policyState.redirectPrefix ||
                  !RegExp(URL_PATTERN).test(policyState.redirectPrefix))
              }
            />
            <OsdsInput
              value={policyState?.redirectPrefix}
              type={ODS_INPUT_TYPE.text}
              placeholder={URL_PLACEHOLDER}
              error={
                isTouchedPrefix &&
                (!policyState.redirectPrefix ||
                  !RegExp(URL_PATTERN).test(policyState.redirectPrefix))
              }
              onOdsValueChange={(event) => {
                setPolicyState((state) => ({
                  ...state,
                  redirectPrefix: event.detail.value,
                }));
              }}
              onOdsInputBlur={() => {
                setIsTouchedPrefix(true);
              }}
            />
          </OsdsFormField>

          <OsdsFormField className="mt-8">
            <LabelComponent
              text={t('octavia_load_balancer_create_l7_policy_http_code')}
            />
            <OsdsSelect
              value={policyState?.redirectHttpCode}
              onOdsValueChange={(event) => {
                setPolicyState((state) => ({
                  ...state,
                  redirectHttpCode: event.detail.value as number,
                }));
              }}
            >
              {REDIRECT_HTTP_CODES.map((httpCode) => (
                <OsdsSelectOption key={httpCode} value={httpCode}>
                  {httpCode}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
        </>
      )}

      {policyState.action === ACTIONS.REDIRECT_TO_POOL && (
        <OsdsFormField className="mt-8">
          <LabelComponent
            text={t('octavia_load_balancer_create_l7_policy_pool')}
          />
          <OsdsSelect
            value={policyState?.redirectPoolId}
            onOdsValueChange={(event) => {
              setPolicyState((state) => ({
                ...state,
                redirectPoolId: event.detail.value as string,
              }));
            }}
          >
            <span slot="placeholder">
              {t('octavia_load_balancer_create_l7_policy_pool_default')}
            </span>
            {filteredPools.map((pool) => (
              <OsdsSelectOption key={pool.id} value={pool.id}>
                {pool.name}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      )}

      <div className="flex mt-8">
        <OsdsButton
          className="mr-4"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
          data-testid="policyForm-cancel_button"
          onClick={onCancel}
        >
          {t('octavia_load_balancer_create_l7_policy_cancel')}
        </OsdsButton>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={isDisabled || undefined}
          data-testid="policyForm-submit_button"
          onClick={() => onSubmit(policyState)}
        >
          {submitButtonText ||
            t('octavia_load_balancer_create_l7_policy_submit')}
        </OsdsButton>
      </div>
    </div>
  );
}
