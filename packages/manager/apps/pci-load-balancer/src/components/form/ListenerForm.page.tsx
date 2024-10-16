import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LISTENER_POOL_PROTOCOL_COMBINATION,
  PROTOCOLS,
  PROTOCOLS_PORT,
} from '@/constants';
import LabelComponent from '@/components/form/Label.component';
import { TLoadBalancerPool } from '@/api/data/pool';
import { TProtocol } from '@/api/data/load-balancer';

export type TListenerFormState = {
  name: string;
  protocol: TProtocol;
  port: number;
  pool: TLoadBalancerPool | null;
};

export type ListenerFormProps = {
  formState: TListenerFormState;
  pools: TLoadBalancerPool[];
  isPending: boolean;
  isEditing?: boolean;
  onSubmit: (state: TListenerFormState) => void;
  onChange: (state) => void;
  onCancel: () => void;
};

export default function ListenerForm({
  formState,
  onChange,
  isEditing = false,
  pools,
  isPending,
  onCancel,
  onSubmit,
}: Readonly<ListenerFormProps>) {
  const { t: tCommon } = useTranslation('pci-common');
  const { t } = useTranslation('listeners/create');
  const { t: tListeners } = useTranslation('listeners');

  const PORT_MIN_VALUE = 1;
  const PORT_MAX_VALUE = 65535;

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

  const handle = {
    protocolChange: (event) => {
      const selectedProtocol = event.detail.value as TProtocol;

      onChange((prev) => ({
        ...prev,
        protocol: selectedProtocol,
        port: PROTOCOLS_PORT[selectedProtocol] || 1,
      }));

      if (
        (formState.pool &&
          !filteredPools.find(({ id }) => id === formState.pool.id)) ||
        selectedProtocol === 'prometheus'
      ) {
        onChange((prev) => ({
          ...prev,
          pool: null,
        }));
      }
    },
    change: (key: string, value: string | number | TLoadBalancerPool) => {
      onChange((prev) => ({
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

  const isNameRequired = isTouched.name && !formState.name.trim();
  const isFormValid = formState.name && formState.protocol && !portError;

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div className="min-w-[20rem] md:w-1/4 sm:w-1">
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
          error={isNameRequired}
          onOdsValueChange={(event) =>
            handle.change('name', event.detail.value)
          }
          onOdsInputBlur={() => handle.blur('name')}
        />
      </OsdsFormField>

      <OsdsFormField className="my-8">
        <LabelComponent
          text={t('octavia_load_balancer_listeners_create_protocol')}
          helpText={tListeners(
            'octavia_load_balancer_listeners_protocol_helper',
          )}
        />

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
          error={!!portError}
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
