import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { TInstance, useInstances } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  LISTENER_PROTOCOL_LIST,
  MAX_INSTANCES_BY_LISTENER,
  MAX_LISTENER,
  PORT_RANGE,
  PROTOCOLS,
} from './constants';
import { TRACKING_PREFIX } from '@/constants';

export interface ListenerConfiguration {
  protocol: string;
  port: number;
  healthMonitor: string;
  instances: {
    instance: TInstance;
    port: number;
  }[];
}

export interface InstanceTableProps {
  projectId: string;
  region: string;
  onChange: (config: ListenerConfiguration[]) => void;
  className: string;
}

interface ListenerForm {
  uid: number;
  protocol: string;
  port: number;
  healthMonitor: string;
  instances: {
    uid: number;
    id: string;
    port: number;
  }[];
}

export function InstanceTable({
  projectId,
  region,
  onChange,
  className,
}: Readonly<InstanceTableProps>) {
  const { t } = useTranslation('instances-table');
  const [listeners, setListeners] = useState<ListenerForm[]>([]);
  const { data: instances, isPending } = useInstances(projectId, region);
  const { tracking } = useContext(ShellContext).shell;

  useEffect(() => {
    // cleanup form data before passing it to the onChange callback
    onChange(
      listeners
        .map((listener) => ({
          protocol: listener.protocol,
          port: listener.port,
          healthMonitor: listener.healthMonitor,
          instances: listener.instances
            .map(({ id, port }) => ({
              instance: instances.find(
                ({ id: instanceId }) => instanceId === id,
              ),
              port,
            }))
            .filter(({ instance }) => instance),
        }))
        .filter(({ healthMonitor }) => healthMonitor !== 'none'),
    );
  }, [listeners]);

  return (
    <div className={className}>
      <OsdsButton
        className="mb-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        disabled={isPending || listeners.length >= MAX_LISTENER || undefined}
        inline
        size={ODS_BUTTON_SIZE.sm}
        onClick={() => {
          setListeners((state) => [
            ...state,
            {
              uid: Date.now(),
              protocol: 'http',
              port: 80,
              healthMonitor: 'none',
              instances: [
                {
                  uid: Date.now(),
                  id: 'none',
                  port: 80,
                },
              ],
            },
          ]);
          tracking?.trackClick({
            name: `${TRACKING_PREFIX}::add-listener`,
            type: 'action',
          });
        }}
      >
        {t('octavia_load_balancer_add_listener')}
      </OsdsButton>
      {isPending && (
        <OsdsSpinner className="block" inline size={ODS_SPINNER_SIZE.md} />
      )}
      {!isPending && listeners.length === 0 && (
        <div className="flex border border-solid border-[--ods-color-blue-200] p-4">
          <div className="min-w-[23rem]">
            <OsdsText
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('octavia_load_balancer_instances_table_listener')}
            </OsdsText>
          </div>

          <div>
            <OsdsText
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('octavia_load_balancer_instances_table_pools')}
              <OsdsTooltip>
                <OsdsIcon
                  className="ml-3"
                  name={ODS_ICON_NAME.HELP_CIRCLE}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
                <OsdsTooltipContent slot="tooltip-content">
                  {t('octavia_load_balancer_instances_table_pools_tooltip')}
                </OsdsTooltipContent>
              </OsdsTooltip>
            </OsdsText>
          </div>
        </div>
      )}
      {listeners.map((listener, index) => (
        <div
          className={clsx(
            'flex min-w-[55rem] border border-solid border-[--ods-color-blue-200] p-4',
            index > 0 && 'border-t-0',
          )}
          key={listener.uid}
        >
          <div className="min-w-[23rem]">
            {index === 0 && (
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {t('octavia_load_balancer_instances_table_listener')}
              </OsdsText>
            )}
            <div className="flex items-end">
              <OsdsFormField>
                <OsdsText
                  slot="label"
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                >
                  {t('octavia_load_balancer_instances_table_protocol_label')}
                  <OsdsTooltip>
                    <OsdsIcon
                      className="ml-3"
                      name={ODS_ICON_NAME.HELP_CIRCLE}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                    <OsdsTooltipContent slot="tooltip-content">
                      {t(
                        'octavia_load_balancer_instances_table_protocol_tooltip',
                      )}
                    </OsdsTooltipContent>
                  </OsdsTooltip>
                </OsdsText>
                <OsdsSelect
                  value={listener.protocol}
                  onOdsValueChange={(event) => {
                    const newListeners = [...listeners];
                    const toUpdate = listener;
                    toUpdate.protocol = `${event?.detail?.value}`;
                    const availableHealthMonitors = LISTENER_PROTOCOL_LIST.find(
                      (item) => item.value === toUpdate.protocol,
                    )?.healthMonitors;
                    toUpdate.healthMonitor = availableHealthMonitors?.some(
                      ({ value }) => value === toUpdate.healthMonitor,
                    )
                      ? toUpdate.healthMonitor
                      : 'none';
                    if (toUpdate.protocol === PROTOCOLS.PROMETHEUS) {
                      toUpdate.instances = [
                        {
                          uid: Date.now(),
                          id: 'none',
                          port: 80,
                        },
                      ];
                    }
                    toUpdate.port =
                      toUpdate.protocol === PROTOCOLS.HTTPS ? 443 : 80;
                    setListeners(newListeners);
                  }}
                  inline
                >
                  {Object.keys(PROTOCOLS).map((protocol) => (
                    <OsdsSelectOption
                      value={PROTOCOLS[protocol]}
                      key={protocol}
                    >
                      {protocol.toUpperCase()}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              </OsdsFormField>
              <OsdsFormField className="ml-4">
                <OsdsText
                  slot="label"
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                >
                  {t('octavia_load_balancer_instances_table_port_label')}
                  <OsdsTooltip>
                    <OsdsIcon
                      className="ml-3"
                      name={ODS_ICON_NAME.HELP_CIRCLE}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                    <OsdsTooltipContent slot="tooltip-content">
                      {t('octavia_load_balancer_instances_table_port_tooltip')}
                    </OsdsTooltipContent>
                  </OsdsTooltip>
                </OsdsText>
                <OsdsInput
                  color={ODS_THEME_COLOR_INTENT.primary}
                  type={ODS_INPUT_TYPE.number}
                  error={undefined}
                  onOdsInputBlur={() => {
                    const port = Math.max(
                      Math.min(listener.port, PORT_RANGE.MAX),
                      PORT_RANGE.MIN,
                    );
                    const newListeners = [...listeners];
                    const toUpdate = listener;
                    toUpdate.port = port;
                    setListeners(newListeners);
                  }}
                  min={PORT_RANGE.MIN}
                  max={PORT_RANGE.MAX}
                  value={listener.port}
                  onOdsValueChange={(event) => {
                    const newListeners = [...listeners];
                    const toUpdate = listener;
                    toUpdate.port = Number(event?.detail?.value);
                    setListeners(newListeners);
                  }}
                  inline
                />
              </OsdsFormField>
              <OsdsTooltip>
                <OsdsButton
                  className="ml-4"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.ghost}
                  inline
                  size={ODS_BUTTON_SIZE.sm}
                  onClick={() => {
                    setListeners(
                      listeners.filter((l) => l.uid !== listener.uid),
                    );
                    tracking?.trackClick({
                      name: `${TRACKING_PREFIX}::delete-listener`,
                      type: 'action',
                    });
                  }}
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.TRASH}
                    size={ODS_ICON_SIZE.xs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </OsdsButton>
                <OsdsTooltipContent slot="tooltip-content">
                  {t('octavia_load_balancer_instances_table_listener_delete')}
                </OsdsTooltipContent>
              </OsdsTooltip>
              <OsdsIcon
                className="mb-[0.5rem]"
                name={ODS_ICON_NAME.ARROW_RIGHT}
                size={ODS_ICON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </div>
          </div>
          <div className="min-w-[30rem]">
            {index === 0 && (
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {t('octavia_load_balancer_instances_table_pools')}
                <OsdsTooltip>
                  <OsdsIcon
                    className="ml-3"
                    name={ODS_ICON_NAME.HELP_CIRCLE}
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                  <OsdsTooltipContent slot="tooltip-content">
                    {t('octavia_load_balancer_instances_table_pools_tooltip')}
                  </OsdsTooltipContent>
                </OsdsTooltip>
              </OsdsText>
            )}
            <div>
              <OsdsFormField className="w-[20rem]">
                <OsdsText
                  slot="label"
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                >
                  {t(
                    'octavia_load_balancer_instances_table_health_monitor_label',
                  )}
                  <OsdsTooltip>
                    <OsdsIcon
                      className="ml-3"
                      name={ODS_ICON_NAME.HELP_CIRCLE}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                    <OsdsTooltipContent slot="tooltip-content">
                      {t(
                        'octavia_load_balancer_instances_table_health_monitor_tooltip',
                      )}
                    </OsdsTooltipContent>
                  </OsdsTooltip>
                </OsdsText>
                <OsdsSelect
                  value={listener.healthMonitor}
                  onOdsValueChange={(event) => {
                    const newListeners = [...listeners];
                    const toUpdate = listener;
                    toUpdate.healthMonitor = `${event?.detail?.value}`;
                    setListeners(newListeners);
                  }}
                  disabled={
                    listener.protocol === PROTOCOLS.PROMETHEUS || undefined
                  }
                  inline
                >
                  <OsdsSelectOption value="none" key="none">
                    {t(
                      'octavia_load_balancer_instances_table_health_monitor_empty',
                    )}
                  </OsdsSelectOption>
                  {LISTENER_PROTOCOL_LIST.find(
                    (list) => list.value === listener.protocol,
                  )?.healthMonitors?.map(({ name, value }) => (
                    <OsdsSelectOption value={value} key={name}>
                      {name}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              </OsdsFormField>
              {listener.instances.map((instance, idx) => (
                <div className="mt-4 flex items-end" key={instance.uid}>
                  <OsdsSelect
                    className="w-[20rem] mr-4"
                    value={instance.id}
                    onOdsValueChange={(event) => {
                      const newListeners = [...listeners];
                      const toUpdate = instance;
                      toUpdate.id = `${event?.detail?.value}`;
                      setListeners(newListeners);
                    }}
                    disabled={
                      listener.protocol === PROTOCOLS.PROMETHEUS || undefined
                    }
                    inline
                  >
                    {instance.id === 'none' && (
                      <OsdsSelectOption value="none" key="none">
                        {t(
                          'octavia_load_balancer_instances_table_pools_search_instance',
                        )}
                      </OsdsSelectOption>
                    )}
                    {instances?.map(({ name, id, ipAddresses }) => (
                      <OsdsSelectOption value={id} key={name}>
                        {name}
                        {ipAddresses?.length && ` (${ipAddresses[0].ip})`}
                      </OsdsSelectOption>
                    ))}
                  </OsdsSelect>
                  <OsdsInput
                    color={ODS_THEME_COLOR_INTENT.primary}
                    type={ODS_INPUT_TYPE.number}
                    error={undefined}
                    onOdsInputBlur={() => {
                      const port = Math.max(
                        Math.min(instance.port, PORT_RANGE.MAX),
                        PORT_RANGE.MIN,
                      );
                      const newListeners = [...listeners];
                      const toUpdate = instance;
                      toUpdate.port = port;
                      setListeners(newListeners);
                    }}
                    min={PORT_RANGE.MIN}
                    max={PORT_RANGE.MAX}
                    value={instance.port}
                    onOdsValueChange={(event) => {
                      const newListeners = [...listeners];
                      const toUpdate = instance;
                      toUpdate.port = Number(event?.detail?.value);
                      setListeners(newListeners);
                    }}
                    disabled={
                      listener.protocol === PROTOCOLS.PROMETHEUS || undefined
                    }
                    inline
                  />
                  {idx > 0 && (
                    <OsdsTooltip>
                      <OsdsButton
                        className="ml-4"
                        color={ODS_THEME_COLOR_INTENT.primary}
                        variant={ODS_BUTTON_VARIANT.ghost}
                        inline
                        size={ODS_BUTTON_SIZE.sm}
                        disabled={
                          listener.protocol === PROTOCOLS.PROMETHEUS ||
                          undefined
                        }
                        onClick={() => {
                          const newListeners = [...listeners];
                          const toUpdate = listener;
                          toUpdate.instances = listener.instances.filter(
                            ({ uid }) => uid !== instance.uid,
                          );
                          setListeners(newListeners);
                          tracking?.trackClick({
                            name: `${TRACKING_PREFIX}::delete-instance`,
                            type: 'action',
                          });
                        }}
                      >
                        <OsdsIcon
                          name={ODS_ICON_NAME.TRASH}
                          size={ODS_ICON_SIZE.xs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </OsdsButton>
                      <OsdsTooltipContent slot="tooltip-content">
                        {t(
                          'octavia_load_balancer_instances_table_instance_delete',
                        )}
                      </OsdsTooltipContent>
                    </OsdsTooltip>
                  )}
                  {idx === listener.instances.length - 1 && (
                    <OsdsTooltip>
                      <OsdsButton
                        className="ml-4"
                        color={ODS_THEME_COLOR_INTENT.primary}
                        variant={ODS_BUTTON_VARIANT.ghost}
                        inline
                        size={ODS_BUTTON_SIZE.sm}
                        disabled={
                          instance.id === 'none' ||
                          idx + 1 >= MAX_INSTANCES_BY_LISTENER ||
                          listener.protocol === PROTOCOLS.PROMETHEUS ||
                          undefined
                        }
                        onClick={() => {
                          const newListeners = [...listeners];
                          listener.instances.push({
                            uid: Date.now(),
                            id: 'none',
                            port: 80,
                          });
                          setListeners(newListeners);
                          tracking?.trackClick({
                            name: `${TRACKING_PREFIX}::add-instance`,
                            type: 'action',
                          });
                        }}
                      >
                        <OsdsIcon
                          name={ODS_ICON_NAME.ADD}
                          size={ODS_ICON_SIZE.xs}
                          color={ODS_THEME_COLOR_INTENT.primary}
                        />
                      </OsdsButton>
                      <OsdsTooltipContent slot="tooltip-content">
                        {t(
                          'octavia_load_balancer_instances_table_instance_add',
                        )}
                      </OsdsTooltipContent>
                    </OsdsTooltip>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
