import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
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
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LISTENER_POOL_PROTOCOL_COMBINATION,
  PROTOCOLS,
  PROTOCOLS_PORT,
} from '@/constants';
import { TLoadBalancerListener, TProtocol } from '@/api/data/load-balancer';
import Popover from './Popover';
import { TLoadBalancerPool } from '@/api/data/pool';
import LabelComponent from '@/components/form/Label.component';

export type TFormState = {
  name: string;
  protocol: TProtocol;
  port: number;
  pool: TLoadBalancerPool | null;
};

export type ListenerFormProps = {
  listener?: TLoadBalancerListener | null;
  pools: TLoadBalancerPool[];
  isPending: boolean;
  isEditing?: boolean;
  onSubmit: (state: TFormState) => void;
  onCancel: () => void;
};

export default function ListenerForm({
  listener = null,
  isEditing = false,
  pools,
  isPending,
  onCancel,
  onSubmit,
}: ListenerFormProps) {
  const { t: tCommon } = useTranslation('pci-common');
  const { t } = useTranslation('octavia-load-balancer-listeners-create');
  const { t: tListeners } = useTranslation('octavia-load-balancer-listeners');

  const PORT_MIN_VALUE = 1;
  const PORT_MAX_VALUE = 65535;

  const [formState, setFormState] = useState<TFormState>({
    name: '',
    protocol: '' as TProtocol,
    port: 1,
    pool: null,
  });

  const [isTouched, setIsTouched] = useState({ name: false, port: false });

  const filteredPools = useMemo(
    () =>
      pools?.filter(
        ({ listenerId, protocol }) =>
          !listenerId &&
          LISTENER_POOL_PROTOCOL_COMBINATION[formState.protocol]?.includes(
            protocol,
          ),
      ) || [],
    [pools, formState.protocol],
  );

  useEffect(() => {
    if (isEditing && listener && pools?.length) {
      setFormState({
        name: listener.name,
        protocol: listener.protocol,
        port: listener.port,
        pool: pools.find((pool) => pool.id === listener.defaultPoolId) ?? null,
      });
    }
  }, [listener, isEditing, pools]);

  const handle = {
    protocolChange: (event) => {
      const selectedProtocol = event.detail.value as TProtocol;

      setFormState((prev) => ({
        ...prev,
        protocol: selectedProtocol,
        port: PROTOCOLS_PORT[selectedProtocol] || 1,
      }));

      if (
        (formState.pool &&
          !filteredPools.find(({ id }) => id === formState.pool.id)) ||
        selectedProtocol === 'prometheus'
      ) {
        setFormState((prev) => ({
          ...prev,
          pool: null,
        }));
      }
    },
    change: (key: string, value: string | number | TLoadBalancerPool) => {
      setFormState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    blur: (key: 'name' | 'port') => {
      setIsTouched((prev) => ({
        ...prev,
        [key]: true,
      }));
    },
  };

  const portError = useMemo(() => {
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
  }, [isTouched.port, formState.port]);

  const isNameRequired = isTouched.name && !formState.name;
  const isFormValid = formState.name && formState.protocol && !portError;

  if (isPending) {
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
        <LabelComponent
          text={t('octavia_load_balancer_listeners_create_name')}
          hasError={isNameRequired}
        />

        <OsdsInput
          type={ODS_INPUT_TYPE.text}
          value={formState.name}
          color={
            isNameRequired
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          onOdsValueChange={(event) =>
            handle.change('name', event.detail.value)
          }
          onOdsInputBlur={() => handle.blur('name')}
        />
      </OsdsFormField>

      <OsdsFormField className="my-8">
        <div slot="label" className="flex items-center gap-3">
          <LabelComponent
            text={t('octavia_load_balancer_listeners_create_protocol')}
            helpText={tListeners(
              'octavia_load_balancer_listeners_protocol_helper',
            )}
          />
        </div>

        <OsdsSelect
          value={formState.protocol}
          inline
          onOdsValueChange={handle.protocolChange}
          disabled={isEditing || undefined}
        >
          <span slot="placeholder">
            {t('octavia_load_balancer_listeners_create_protocol_default')}
          </span>
          {PROTOCOLS.map((protocol) => (
            <OsdsSelectOption key={protocol} value={protocol}>
              {protocol}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      <OsdsFormField className="my-8" error={portError}>
        <LabelComponent
          text={t('octavia_load_balancer_listeners_create_port')}
          hasError={!!portError}
        />

        <OsdsInput
          type={ODS_INPUT_TYPE.number}
          min={PORT_MIN_VALUE}
          max={PORT_MAX_VALUE}
          value={formState.port}
          color={
            portError
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          onOdsValueChange={(event) =>
            handle.change('port', Number(event.detail.value))
          }
          onOdsInputBlur={() => handle.blur('port')}
          disabled={isEditing || undefined}
        />
      </OsdsFormField>

      <OsdsFormField className="my-8">
        <LabelComponent
          text={t('octavia_load_balancer_listeners_create_pool')}
        />

        <OsdsSelect
          value={formState.pool?.id}
          inline
          disabled={!filteredPools.length || undefined}
          onOdsValueChange={(event) => {
            const selectedPool = filteredPools.find(
              ({ id }) => id === event.detail.value,
            );
            handle.change('pool', selectedPool);
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
          onClick={onCancel}
        >
          {tCommon('common_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit(formState)}
          disabled={!isFormValid || undefined}
        >
          {t(
            isEditing
              ? 'octavia_load_balancer_listeners_create_submit_edition'
              : 'octavia_load_balancer_listeners_create_submit',
          )}
        </OsdsButton>
      </div>
    </div>
  );
}
