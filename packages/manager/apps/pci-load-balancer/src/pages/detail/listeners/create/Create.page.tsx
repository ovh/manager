import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Translation, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  LISTENER_POOL_PROTOCOL_COMBINATION,
  PROTOCOLS,
  PROTOCOLS_PORT,
} from '@/constants';
import {
  useCreateLoadBalancer,
  useLoadBalancerPools,
} from '@/api/hook/useLoadBalancer';
import { TLoadBalancerPool } from '@/api/data/load-balancer';

type TFormState = {
  name: string;
  protocol: string;
  port: number;
  pool: TLoadBalancerPool | null;
};

export default function CreateListener() {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('octavia-load-balancer-listeners-create');

  const navigate = useNavigate();
  const { projectId, region, loadBalancerId } = useParams();
  const { addSuccess, addError } = useNotifications();

  const PORT_MIN_VALUE = 1;
  const PORT_MAX_VALUE = 65535;

  const [formState, setFormState] = useState<TFormState>({
    name: '',
    protocol: '',
    port: 1,
    pool: null,
  });

  const [filteredPools, setFilteredPools] = useState<TLoadBalancerPool[]>([]);
  const [isTouched, setIsTouched] = useState({ name: false, port: false });

  const { data: pools } = useLoadBalancerPools({
    projectId,
    region,
    loadBalancerId,
  });

  const getFilteredPools = (): TLoadBalancerPool[] =>
    pools.filter(
      ({ listenerId, protocol }) =>
        !listenerId &&
        LISTENER_POOL_PROTOCOL_COMBINATION[formState.protocol]?.includes(
          protocol,
        ),
    ) || [];

  useEffect(() => {
    if (pools) {
      setFilteredPools(formState.protocol ? getFilteredPools() : pools);
    }
  }, [pools, formState.protocol]);

  const handleProtocolChange = (event) => {
    const selectedProtocol = event.detail.value;

    setFormState((prev) => ({
      ...prev,
      protocol: selectedProtocol,
      port: PROTOCOLS_PORT[selectedProtocol] || 1,
    }));

    if (
      (formState.pool &&
        !filteredPools.find(({ id }) => id === formState.pool.id)) ||
      selectedProtocol === PROTOCOLS.PROMETHEUS
    ) {
      setFormState((prev) => ({
        ...prev,
        pool: null,
      }));
    }
  };

  const handleChange = (
    key: string,
    value: string | number | TLoadBalancerPool,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBlur = (key: 'name' | 'port') => {
    setIsTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const portError = () => {
    if (isTouched.port) {
      if (formState.port < PORT_MIN_VALUE) {
        return tCommon('common_field_error_min', { min: PORT_MIN_VALUE });
      }
      if (formState.port > PORT_MAX_VALUE) {
        return tCommon('common_field_error_max', { max: PORT_MAX_VALUE });
      }
      return '';
    }
    return '';
  };

  const isNameRequired = isTouched.name && !formState.name;
  const isFormValid = formState.name && formState.protocol && !portError();

  const {
    createListener,
    isPending: isCreationPending,
  } = useCreateLoadBalancer({
    projectId,
    region,
    loadBalancerId,
    onError(error: ApiError) {
      addError(
        <Translation ns="octavia-load-balancer-listeners-create">
          {(_t) =>
            _t('octavia_load_balancer_global_error', {
              message: error?.response?.data?.message || error?.message || null,
              requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
    onSuccess() {
      addSuccess(
        <Translation ns="octavia-load-balancer-listeners-create">
          {(_t) => _t('octavia_load_balancer_listeners_create_success')}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  if (isCreationPending) {
    return (
      <OsdsSpinner
        inline
        size={ODS_SPINNER_SIZE.md}
        data-testid="List-spinner"
      />
    );
  }

  return (
    <div className="w-1/4">
      <OsdsFormField
        className="my-8"
        error={isNameRequired ? tCommon('common_field_error_required') : ''}
      >
        <OsdsText
          level={ODS_TEXT_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={
            isNameRequired
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.text
          }
          className="font-bold"
          slot="label"
        >
          {t('octavia_load_balancer_listeners_create_name')}
        </OsdsText>
        <OsdsInput
          type={ODS_INPUT_TYPE.text}
          value={formState.name}
          color={
            isNameRequired
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          onOdsValueChange={(event) => handleChange('name', event.detail.value)}
          onOdsInputBlur={() => handleBlur('name')}
        />
      </OsdsFormField>

      <OsdsFormField className="my-8">
        <OsdsText
          level={ODS_TEXT_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
          className="font-bold"
          slot="label"
        >
          {t('octavia_load_balancer_listeners_create_protocol')}
        </OsdsText>

        <OsdsSelect
          value={formState.protocol}
          inline
          onOdsValueChange={handleProtocolChange}
        >
          <span slot="placeholder">
            {t('octavia_load_balancer_listeners_create_protocol_default')}
          </span>
          {Object.values(PROTOCOLS).map((protocol) => (
            <OsdsSelectOption key={protocol} value={protocol}>
              {protocol}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      <OsdsFormField className="my-8" error={portError()}>
        <OsdsText
          level={ODS_TEXT_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={
            portError()
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.text
          }
          className="font-bold"
          slot="label"
        >
          {t('octavia_load_balancer_listeners_create_port')}
        </OsdsText>

        <OsdsInput
          type={ODS_INPUT_TYPE.number}
          min={PORT_MIN_VALUE}
          max={PORT_MAX_VALUE}
          value={formState.port}
          color={
            portError()
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          onOdsValueChange={(event) =>
            handleChange('port', Number(event.detail.value))
          }
          onOdsInputBlur={() => handleBlur('port')}
        />
      </OsdsFormField>

      <OsdsFormField className="my-8">
        <OsdsText
          level={ODS_TEXT_LEVEL.caption}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
          className="font-bold"
          slot="label"
        >
          {t('octavia_load_balancer_listeners_create_pool')}
        </OsdsText>

        <OsdsSelect
          value={formState.pool?.id}
          inline
          disabled={!filteredPools.length || undefined}
          onOdsValueChange={(event) => {
            const selectedPool = filteredPools.find(
              ({ id }) => id === event.detail.value,
            );
            handleChange('pool', selectedPool);
          }}
        >
          <span slot="placeholder">
            {t('octavia_load_balancer_listeners_create_pool_default')}
          </span>
          {filteredPools.map((pool) => (
            <OsdsSelectOption key={pool.id} value={pool.id}>
              {pool.name}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      <div className="flex gap-4">
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => navigate('..')}
          data-testid="pciModal-button_cancel"
        >
          Cancel
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() =>
            createListener({
              name: formState.name,
              port: formState.port,
              protocol: formState.protocol,
              defaultPoolId: formState.pool?.id || undefined,
            })
          }
          disabled={!isFormValid || undefined}
          data-testid="pciModal-button_submit"
        >
          Confirm
        </OsdsButton>
      </div>
    </div>
  );
}
