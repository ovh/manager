import { TPoolMember } from '@/api/data/pool-member';
import {
  useCreatePoolMembers,
  useGetAllPoolMembers,
} from '@/api/hook/usePoolMember';
import LabelComponent from '@/components/form/Label.component';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TInstance, useInstances } from '@ovh-ux/manager-pci-common';
import {
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

type TMappedInstance = {
  uuid: string;
  label: string;
  name: string;
  address: string;
  protocolPort: number;
  checked: boolean;
};

type TFormState = {
  isDuplicatePort: boolean;
  searchTerm: string;
};

type TState = {
  instances: TMappedInstance[];
  steps: {
    addIPStep: {
      isOpen: boolean;
      isLocked: boolean;
      isChecked: boolean;
    };
    editIPStep: {
      isOpen: boolean;
      isLocked: boolean;
      isChecked: boolean;
    };
  };
};

const mapInstances = (instances: TInstance[]): TMappedInstance[] =>
  instances?.flatMap((instance) =>
    instance.ipAddresses
      .filter((ip) => ip.version === 4)
      .map<TMappedInstance>((ipAddress) => ({
        uuid: uuidV4(),
        label: `${instance.name} (${ipAddress.ip})`,
        name: instance.name,
        address: ipAddress.ip,
        protocolPort: 80,
        checked: false,
      })),
  ) || [];

const PORT_MIN_VALUE = 1;
const PORT_MAX_VALUE = 65535;

export default function AddIpInstancePage() {
  const { t } = useTranslation('pools/members/add-ip-instance');
  const { t: tMembers } = useTranslation('pools/members');
  const { t: tPoolDetail } = useTranslation('pools/detail');
  const { t: tCommon } = useTranslation('pci-common');

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const [formState, setFormState] = useState<TFormState>({
    isDuplicatePort: true,
    searchTerm: '',
  });

  const [state, setState] = useState<TState>({
    instances: [],
    steps: {
      addIPStep: {
        isOpen: true,
        isLocked: false,
        isChecked: false,
      },
      editIPStep: {
        isOpen: false,
        isLocked: false,
        isChecked: false,
      },
    },
  });

  const filteredInstances = state.instances.filter((instance) =>
    instance.label.toLowerCase().includes(formState.searchTerm.toLowerCase()),
  );

  const checkedInstances = state.instances.filter(
    (instance) => instance.checked,
  );

  const { projectId, region, poolId } = useParams();
  const { data } = useInstances(projectId);
  const { data: members } = useGetAllPoolMembers(projectId, poolId, region);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      instances: mapInstances(data),
    }));
  }, [data]);

  const isIpAlreadyAssociatedWithPort = (instance: TMappedInstance): boolean =>
    members?.find(
      ({ address, protocolPort }) =>
        address === instance.address && protocolPort === instance.protocolPort,
    ) !== undefined;

  const protocolPortError = (instance: TMappedInstance) => {
    if (Number.isNaN(instance.protocolPort)) {
      return tCommon('common_field_error_required');
    }

    if (instance.protocolPort < PORT_MIN_VALUE) {
      return tCommon('common_field_error_min', { min: PORT_MIN_VALUE });
    }

    if (instance.protocolPort > PORT_MAX_VALUE) {
      return tCommon('common_field_error_max', { max: PORT_MAX_VALUE });
    }

    if (isIpAlreadyAssociatedWithPort(instance)) {
      return t(
        'octavia_load_balancer_pools_detail_members_protocol_port_existing',
      );
    }

    return '';
  };

  const isFormValid = () =>
    useMemo(() => {
      const errors = checkedInstances
        .map((instance) => protocolPortError(instance))
        .filter((error) => error !== '');

      return errors.length === 0;
    }, [checkedInstances]);

  const { createPoolMembers } = useCreatePoolMembers({
    projectId,
    region,
    poolId,
    onError(error: ApiError) {
      navigate('..');
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: (error?.response?.data as { message: string })
                    ?.message,
                  requestId: error.response?.headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
    },
    onSuccess() {
      navigate('..');
      addSuccess(
        <Translation ns="pools/members">
          {(_t) =>
            _t(
              'octavia_load_balancer_pools_detail_members_add_ip_instance_create_success',
            )
          }
        </Translation>,
        true,
      );
    },
  });

  const onSubmit = () => {
    const memberToPersist = checkedInstances.map((instance) => ({
      name: instance.name,
      protocolPort: instance.protocolPort,
      address: instance.address,
    }));

    createPoolMembers(memberToPersist as TPoolMember[]);

    setState((prevState) => ({
      ...prevState,
      steps: {
        ...prevState.steps,
        editIPStep: { isOpen: true, isLocked: true, isChecked: true },
      },
    }));
  };

  return (
    <div>
      <StepComponent
        title={tPoolDetail(
          'octavia_load_balancer_pools_detail_add_ips_instances',
        )}
        subtitle={t(
          'octavia_load_balancer_pools_detail_members_add_ip_instance_description',
        )}
        isOpen={state.steps.addIPStep.isOpen}
        isChecked={state.steps.addIPStep.isChecked}
        isLocked={state.steps.addIPStep.isLocked}
        order={1}
        next={{
          action: () =>
            setState((prevState) => ({
              ...prevState,
              steps: {
                addIPStep: { isOpen: true, isLocked: true, isChecked: true },
                editIPStep: { isOpen: true, isLocked: false, isChecked: false },
              },
            })),
          label: t(
            'octavia_load_balancer_pools_detail_members_add_ip_instance_action',
          ),
          isDisabled:
            state.instances.filter((instance) => instance.checked).length === 0,
        }}
        edit={{
          action: () => {
            setState((prevState) => ({
              ...prevState,
              steps: {
                addIPStep: { isOpen: true, isLocked: false, isChecked: false },
                editIPStep: {
                  isOpen: false,
                  isLocked: false,
                  isChecked: false,
                },
              },
            }));
          },
          label: tCommon('common_stepper_modify_this_step'),
        }}
      >
        {state.instances.length ? (
          <div className="md:w-2/3 sm:w-1">
            <OsdsMessage
              className="my-5"
              type={ODS_MESSAGE_TYPE.warning}
              color={ODS_THEME_COLOR_INTENT.warning}
            >
              {t(
                'octavia_load_balancer_pools_detail_members_add_ip_instance_banner',
              )}
            </OsdsMessage>

            <OsdsFormField className="min-w-[20rem] md:w-1/2 sm:w-1">
              <OsdsInput
                type={ODS_INPUT_TYPE.text}
                value={formState.searchTerm}
                placeholder={t(
                  'octavia_load_balancer_pools_detail_members_add_ip_instance_search_placeholder',
                )}
                onOdsValueChange={(event) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    searchTerm: event.detail.value,
                  }))
                }
              />
            </OsdsFormField>

            <div className="border-solid border-sky-300 border rounded-lg p-5 my-5 overflow-auto max-h-[50dvh]">
              {filteredInstances.length === 0 ? (
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                >
                  {t(
                    'octavia_load_balancer_pools_detail_members_add_ip_instance_search_not_found',
                  )}
                </OsdsText>
              ) : (
                <>
                  {filteredInstances.map((instance) => (
                    <OsdsCheckbox
                      key={instance.uuid}
                      name={instance.label}
                      onOdsCheckedChange={(event) => {
                        instance.checked = event.detail.checked;
                        setState((prevState) => ({ ...prevState }));
                      }}
                    >
                      <OsdsCheckboxButton
                        size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      >
                        <OsdsText
                          className={
                            instance.checked ? 'font-bold' : 'font-normal'
                          }
                          color={ODS_THEME_COLOR_INTENT.text}
                          size={ODS_TEXT_SIZE._400}
                          level={ODS_TEXT_LEVEL.body}
                          slot="end"
                        >
                          {instance.label}
                        </OsdsText>
                      </OsdsCheckboxButton>
                    </OsdsCheckbox>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        )}
      </StepComponent>
      <StepComponent
        title={t(
          'octavia_load_balancer_pools_detail_members_add_ip_instance_port_title',
        )}
        isOpen={state.steps.editIPStep.isOpen}
        isChecked={state.steps.editIPStep.isChecked}
        isLocked={state.steps.editIPStep.isLocked}
        order={2}
        next={{
          action: () => onSubmit(),
          label: t(
            'octavia_load_balancer_pools_detail_members_add_ip_instance_add_action',
          ),
          isDisabled: !isFormValid(),
        }}
        skip={{
          action: () => navigate('..'),
          label: t(
            'octavia_load_balancer_pools_detail_members_add_ip_instance_cancel_action',
          ),
        }}
      >
        <div className="md:w-2/3 sm:w-1">
          {checkedInstances.map((instance, index) => (
            <div
              className="border-solid bg-[--ods-color-blue-050] border-sky-300 border rounded-lg p-8 my-5"
              key={instance.uuid}
            >
              <div className="flex md:gap-5">
                <OsdsFormField className="md:w-1/3">
                  <LabelComponent
                    text={t(
                      'octavia_load_balancer_pools_detail_members_add_ip_instance_name_label',
                    )}
                  />
                  <OsdsInput
                    color={ODS_THEME_COLOR_INTENT.primary}
                    type={ODS_INPUT_TYPE.text}
                    value={instance.name}
                    onOdsValueChange={(event) => {
                      instance.name = event.detail.value;
                      setState((prevState) => ({ ...prevState }));
                    }}
                  />
                </OsdsFormField>
                <OsdsFormField className="md:w-1/3">
                  <LabelComponent
                    text={t(
                      'octavia_load_balancer_pools_detail_members_add_ip_instance_ip_label',
                    )}
                  />
                  <OsdsInput
                    name={instance.address}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    type={ODS_INPUT_TYPE.text}
                    value={instance.address}
                    disabled
                  />
                </OsdsFormField>
                <OsdsFormField
                  className="md:w-1/3"
                  error={protocolPortError(instance)}
                >
                  <LabelComponent
                    text={t(
                      'octavia_load_balancer_pools_detail_members_add_ip_instance_port_label',
                    )}
                    helpText={tMembers(
                      'octavia_load_balancer_pools_detail_members_protocol_port_tooltip',
                    )}
                    hasError={!!protocolPortError(instance)}
                  />
                  <OsdsInput
                    type={ODS_INPUT_TYPE.number}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    min={PORT_MIN_VALUE}
                    max={PORT_MAX_VALUE}
                    required
                    error={!!protocolPortError(instance)}
                    value={
                      formState.isDuplicatePort
                        ? checkedInstances[0].protocolPort
                        : instance.protocolPort
                    }
                    disabled={
                      (index !== 0 && formState.isDuplicatePort) || undefined
                    }
                    onOdsValueChange={(event) => {
                      instance.protocolPort = Number(event.detail.value);
                      setState((prevState) => ({ ...prevState }));
                    }}
                  />
                </OsdsFormField>
              </div>
              {index === 0 && checkedInstances.length > 1 && (
                <OsdsCheckbox
                  className="block mt-4"
                  name="duplicatePort"
                  checked={formState.isDuplicatePort}
                  onOdsCheckedChange={(event) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      isDuplicatePort: event.detail.checked,
                    }))
                  }
                >
                  <OsdsCheckboxButton
                    size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  >
                    <OsdsText
                      className={
                        formState.isDuplicatePort ? 'font-bold' : 'font-normal'
                      }
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      slot="end"
                    >
                      {t(
                        'octavia_load_balancer_pools_detail_members_add_ip_instance_duplicate_port_label',
                      )}
                    </OsdsText>
                  </OsdsCheckboxButton>
                </OsdsCheckbox>
              )}
            </div>
          ))}
        </div>
      </StepComponent>
    </div>
  );
}
