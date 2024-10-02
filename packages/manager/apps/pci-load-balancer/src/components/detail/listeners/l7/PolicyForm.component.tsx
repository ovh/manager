import { useEffect, useMemo, useState } from 'react';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
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
import { useListener } from '@/api/hook/useListener';
import { useAllLoadBalancerPools } from '@/api/hook/usePool';
import LabelComponent from '@/components/form/Label.component';

type PolicyFormProps = {
  policy: TL7Policy;
  isPendingAction: boolean;
  onChange: (policy: TL7Policy) => void;
  onSubmit: () => void;
  onCancel: () => void;
};
export default function PolicyForm({
  policy,
  onChange,
  onSubmit,
  isPendingAction,
  onCancel,
}: PolicyFormProps) {
  const { projectId, loadBalancerId, region, listenerId } = useParams();
  const { t } = useTranslation('octavia-load-balancer-l7-policy-form');
  const { t: tPciCommon } = useTranslation('pci-common');
  const [policyState, setPolicyState] = useState<TL7Policy>(policy);
  const { data: listener, isPending: isPendingListener } = useListener({
    projectId,
    region,
    loadBalancerId,
    listenerId,
  });
  const { data: pools, isPending: isPendingPools } = useAllLoadBalancerPools({
    projectId,
    region,
    loadBalancerId,
  });

  const filteredPools = useMemo(() => {
    if (pools && listener) {
      return pools?.filter(
        (pool) =>
          !UNAVAILABLE_POOL_PROTOCOLS.includes(pool.protocol) &&
          LISTENER_POOL_PROTOCOL_COMBINATION[listener?.protocol].includes(
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

  const isPending = isPendingListener || isPendingPools || isPendingAction;

  const onActionChange = (
    event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    const action = event.detail.value as string;
    const policyUpdate = {
      ...policyState,
      action,
    };
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
    setPolicyState(policyUpdate);
    onChange(policyUpdate);
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

  return (
    <>
      {isPending && <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />}
      {!isPending && (
        <div>
          <OsdsFormField
            error={
              hasErrorName ? tPciCommon('common_field_error_required') : ''
            }
          >
            <LabelComponent
              text={t('octavia_load_balancer_create_l7_policy_name')}
              hasError={hasErrorName}
              slot="label"
            />
            <OsdsInput
              value={policyState?.name}
              type={ODS_INPUT_TYPE.text}
              className={
                hasErrorName
                  ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                  : 'border-color-[var(--ods-color-default-200)] bg-white'
              }
              onOdsValueChange={(event) => {
                const policyUpdate = {
                  ...policyState,
                  name: event.detail.value,
                };
                setPolicyState(() => policyUpdate);
                onChange(policyUpdate);
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
              const policyUpdate = {
                ...policyState,
                position: quantity,
              };
              setPolicyState(() => policyUpdate);
              onChange(policyUpdate);
            }}
          />
          <OsdsFormField className="mt-8">
            <LabelComponent
              text={t('octavia_load_balancer_create_l7_policy_action')}
              slot="label"
            />
            <OsdsSelect onOdsValueChange={onActionChange}>
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
                  slot="label"
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
                  className={
                    isTouchedURL &&
                    (!policyState.redirectUrl ||
                      !RegExp(URL_PATTERN).test(policyState.redirectUrl))
                      ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                      : 'border-color-[var(--ods-color-default-200)] bg-white'
                  }
                  onOdsValueChange={(event) => {
                    const policyUpdate = {
                      ...policyState,
                      redirectUrl: event.detail.value,
                    };
                    setPolicyState(() => policyUpdate);
                    onChange(policyUpdate);
                  }}
                  onOdsInputBlur={() => {
                    setIsTouchedURL(true);
                  }}
                />
              </OsdsFormField>
              <OsdsFormField className="mt-8">
                <LabelComponent
                  text={t('octavia_load_balancer_create_l7_policy_http_code')}
                  slot="label"
                />
                <OsdsSelect
                  value={policyState?.redirectHttpCode}
                  onOdsValueChange={(event) => {
                    const policyUpdate = {
                      ...policyState,
                      redirectHttpCode: event.detail.value as number,
                    };
                    setPolicyState(() => policyUpdate);
                    onChange(policyUpdate);
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
                  slot="label"
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
                  className={
                    isTouchedPrefix &&
                    (!policyState.redirectPrefix ||
                      !RegExp(URL_PATTERN).test(policyState.redirectPrefix))
                      ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                      : 'border-color-[var(--ods-color-default-200)] bg-white'
                  }
                  onOdsValueChange={(event) => {
                    const policyUpdate = {
                      ...policyState,
                      redirectPrefix: event.detail.value,
                    };
                    setPolicyState(() => policyUpdate);
                    onChange(policyUpdate);
                  }}
                  onOdsInputBlur={() => {
                    setIsTouchedPrefix(true);
                  }}
                />
              </OsdsFormField>
              <OsdsFormField className="mt-8">
                <LabelComponent
                  text={t('octavia_load_balancer_create_l7_policy_http_code')}
                  slot="label"
                />
                <OsdsSelect
                  value={policyState?.redirectHttpCode}
                  onOdsValueChange={(event) => {
                    const policyUpdate = {
                      ...policyState,
                      redirectHttpCode: event.detail.value as number,
                    };
                    setPolicyState(() => policyUpdate);
                    onChange(policyUpdate);
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
                slot="label"
              />
              <OsdsSelect
                value={policyState?.redirectPoolId}
                onOdsValueChange={(event) => {
                  const policyUpdate = {
                    ...policyState,
                    redirectPoolId: event.detail.value as string,
                  };
                  setPolicyState(() => policyUpdate);
                  onChange(policyUpdate);
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
              onClick={onCancel}
            >
              {t('octavia_load_balancer_create_l7_policy_cancel')}
            </OsdsButton>
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              disabled={isDisabled || undefined}
              onClick={onSubmit}
            >
              {t('octavia_load_balancer_create_l7_policy_submit')}
            </OsdsButton>
          </div>
        </div>
      )}
    </>
  );
}
