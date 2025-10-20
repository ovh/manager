import React, { useEffect } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import FormLayout from '@/components/Form/FormLayout.component';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { RhfField } from '@/components/Fields';
import { SERVER_CONFIG_SCHEMA } from '@/schema/serverConfig.schema';
import { LABELS } from '@/utils/label.constants';
import { FORM_LABELS } from '@/constants/form.constants';
import { RhfSelectField } from '@/components/Fields/RhfSelectField.component';
import { RhfToggleField } from '@/components/Fields/RhfToggleField.component';
import {
  DeploymentForm,
  InitializationForm,
  ServerConfigForm,
} from '@/types/form.type';
import { FormAccordion } from '@/components/Form/FormAccordion.component';
import { getServerConfigFormData } from '@/utils/formStepData';
import { SERVER_CONFIG_LIMITS } from './installationStepServerConfig.constants';
import {
  DEFAULT_APPLICATION_SERVER,
  DEFAULT_HANA_SERVER,
} from '@/utils/defaultServers.constants';
import {
  createApplicationServer,
  getDefaultApplicationServers,
  isApplicationServerDeletable,
  isValidApplicationServerList,
} from '@/utils/applicationServers';
import { useServerConfigQueries } from '@/hooks/serverConfig/useServerConfigQueries';
import {
  getSelectDefaultValue,
  getSelectLatestValue,
} from '@/utils/selectValues';
import { APPLICATION_SERVER_ROLES } from '@/utils/applicationServers.constants';
import { TRACKING } from '@/tracking.constants';
import { mapFormServerConfigToStructured } from '@/mappers/stepFormMappers';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { createRegisterWithHandler } from '@/utils/createRegisterWithHandler';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

type FormData = z.output<typeof SERVER_CONFIG_SCHEMA>;

export default function InstallationStepServerConfig() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep, serviceName } = useFormSteps();
  const {
    values,
    errors,
    setValues,
    initializationState: {
      isPrefilled,
      prefilledData: {
        network: prefilledNetwork,
        thickDatastorePolicy: prefilledPolicy,
        applicationServerOva: prefilledAppOva,
        applicationServerDatastore: prefilledAppStore,
        hanaServerOva: prefilledHanaOva,
        hanaServerDatastore: prefilledHanaStore,
      },
    },
  } = useInstallationFormContext();
  const { trackClick } = useOvhTracking();
  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  const {
    datacentrePortGroupQuery: {
      data: portGroup,
      isLoading: isLoadingPortGroup,
      isError: isPortGroupError,
    },
    storagePolicyQuery: {
      data: storagePolicies,
      isLoading: isLoadingStoragePolicies,
      isError: isStoragePoliciesError,
    },
    sapCapabilitiesQuery: {
      data: sapCapabilities,
      isLoading: isLoadingSapCapabilities,
      isError: isSapCapabilitiesError,
    },
    datastoreQuery: {
      data: datastores,
      isLoading: isLoadingDatastores,
      isError: isDatastoresError,
    },
  } = useServerConfigQueries({
    serviceName,
    datacenterId: values.datacenterId?.toString(),
    clusterId: values.clusterId,
  });

  const isLoadingQueries =
    isLoadingPortGroup ||
    isLoadingStoragePolicies ||
    isLoadingSapCapabilities ||
    isLoadingDatastores;

  const networkNames = portGroup?.map((p) => p.name);
  const policyNames = storagePolicies?.map((p) => p.name);
  const datastoreNames = datastores?.map((d) => d.datastoreName);
  const ovaTemplates = sapCapabilities?.ovaTemplates;

  const defaultValues: ServerConfigForm = {
    ...getServerConfigFormData({ values, errors }).values,
    network: getSelectDefaultValue(
      getSelectLatestValue({
        isPrefilled,
        value: values.network,
        prefilledValue: prefilledNetwork,
      }),
      networkNames,
    ),
    thickDatastorePolicy: getSelectDefaultValue(
      getSelectLatestValue({
        isPrefilled,
        value: values.thickDatastorePolicy,
        prefilledValue: prefilledPolicy,
      }),
      policyNames,
    ),
    applicationServerDatastore: getSelectDefaultValue(
      getSelectLatestValue({
        isPrefilled,
        value: values.applicationServerDatastore,
        prefilledValue: prefilledAppStore,
      }),
      datastoreNames,
    ),
    applicationServerOva: getSelectDefaultValue(
      getSelectLatestValue({
        isPrefilled,
        value: values.applicationServerOva,
        prefilledValue: prefilledAppOva,
      }),
      ovaTemplates,
    ),
    hanaServerDatastore: getSelectDefaultValue(
      getSelectLatestValue({
        isPrefilled,
        value: values.hanaServerDatastore,
        prefilledValue: prefilledHanaStore,
      }),
      datastoreNames,
    ),
    hanaServerOva: getSelectDefaultValue(
      getSelectLatestValue({
        isPrefilled,
        value: values.hanaServerOva,
        prefilledValue: prefilledHanaOva,
      }),
      ovaTemplates,
    ),
    hanaServers: values.hanaServers?.length
      ? values.hanaServers
      : [DEFAULT_HANA_SERVER],
    applicationServers: isValidApplicationServerList({
      applicationServers: values.applicationServers,
      deploymentType: values.deploymentType,
    })
      ? values.applicationServers
      : getDefaultApplicationServers(values.deploymentType),
  };

  const {
    register: baseRegister,
    control,
    getValues,
    handleSubmit,
    formState,
    reset,
    ...restMethods
  } = useForm<FormData>({
    mode: 'onTouched',
    resolver: zodResolver(SERVER_CONFIG_SCHEMA),
    defaultValues,
  });

  const register = createRegisterWithHandler(
    baseRegister,
    clearServerErrorMessage,
  );

  const fieldWithHandler = <TFieldName extends string>(
    field: ControllerRenderProps<FieldValues, TFieldName>,
  ) => ({
    ...field,
    onChange: (...params: unknown[]) => {
      field.onChange(...params);
      clearServerErrorMessage();
    },
  });

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation({
    mapper: (
      params: ServerConfigForm &
        Pick<InitializationForm, 'datacenterId'> &
        Pick<DeploymentForm, 'deploymentType'>,
    ) => ({
      ...mapFormServerConfigToStructured(params),
      datacenterId: params.datacenterId,
      deploymentType: params.deploymentType,
    }),
    serviceName,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      setServerErrorMessage(error.response.data.message);
    },
  });

  const { fields: hanaServers } = useFieldArray({
    control,
    name: 'hanaServers',
  });

  const {
    fields: applicationServers,
    append: appendApplicationServer,
    remove: removeApplicationServer,
  } = useFieldArray({
    control,
    name: 'applicationServers',
  });

  const copyApplicationServer = (serverIndex: number) => {
    const server = getValues(`applicationServers.${serverIndex}`);
    appendApplicationServer(
      createApplicationServer({
        vcpus: server.vcpus,
        memory: server.memory,
        rootPassword: server.rootPassword,
      }),
    );
  };

  const hasReachMaximumVM =
    applicationServers.length >= SERVER_CONFIG_LIMITS.vmMax;

  const applicationServerError =
    formState.errors?.applicationServers?.root?.message;

  const saveFormOnContext = () => {
    setValues((prev) => ({ ...prev, ...getValues() }));
  };

  useEffect(() => {
    return saveFormOnContext;
  }, []);

  useEffect(() => {
    if (!isLoadingQueries) reset(defaultValues);
  }, [isLoadingQueries]);

  return (
    <FormProvider
      register={register}
      control={control}
      getValues={getValues}
      handleSubmit={handleSubmit}
      formState={formState}
      reset={reset}
      {...restMethods}
    >
      <FormLayout
        title={t('server_config_title')}
        subtitle={t('server_config_subtitle')}
        isSubmitDisabled={
          !formState.isValid || !!serverErrorMessage || isValidationPending
        }
        submitLabel={t('server_config_cta')}
        serverErrorMessage={serverErrorMessage}
        onSubmit={handleSubmit(() => {
          trackClick(TRACKING.installation.enableAdditionalFeatures);
          validate({
            ...(getValues() as ServerConfigForm),
            deploymentType: values.deploymentType,
            datacenterId: values.datacenterId,
          });
        })}
        onPrevious={previousStep}
      >
        <Controller
          name="network"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={t('server_config_input_vmware_ports')}
              placeholder={t('select_label')}
              options={portGroup}
              optionValueKey="name"
              isLoading={isLoadingQueries}
              isDisabled={isLoadingQueries || isPortGroupError}
              error={fieldState.error && t('server_config_error_vmware_ports')}
            />
          )}
        />
        <RhfField
          controllerParams={register('netmask')}
          helperMessage={t('server_config_helper_subnet_mask')}
        >
          <RhfField.Label>
            {t('server_config_input_subnet_mask')}
          </RhfField.Label>
          <RhfField.Input />
          <RhfField.HelperAuto />
        </RhfField>
        <RhfField
          controllerParams={register('gateway')}
          helperMessage={t('server_config_helper_gateway_ip')}
        >
          <RhfField.Label>{t('server_config_input_gateway_ip')}</RhfField.Label>
          <RhfField.Input />
          <RhfField.HelperAuto />
        </RhfField>
        <Controller
          control={control}
          name="encryptPassword"
          render={({ field }) => (
            <RhfToggleField
              field={fieldWithHandler(field)}
              label={t('server_config_toggle_password_encryption')}
              tooltip={t('server_config_tooltip_password_encryption')}
            />
          )}
        />
        <OdsText preset="heading-3">{LABELS.SAP_HANA}</OdsText>
        <Controller
          name="hanaServerOva"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={t('server_config_input_ova_model')}
              placeholder={t('select_label')}
              options={sapCapabilities.ovaTemplates}
              isLoading={isLoadingQueries}
              isDisabled={isLoadingQueries || isSapCapabilitiesError}
              error={fieldState.error && t('server_config_error_ova_model')}
            />
          )}
        />
        <Controller
          name="hanaServerDatastore"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={FORM_LABELS.datastore}
              placeholder={t('select_label')}
              options={datastoreNames}
              isLoading={isLoadingQueries}
              isDisabled={isLoadingQueries || isDatastoresError}
              error={fieldState.error && t('server_config_error_datastore')}
            />
          )}
        />
        <Controller
          control={control}
          name="thickDatastorePolicy"
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={field}
              label={t('server_config_input_thick_storage')}
              placeholder={t('select_label')}
              options={storagePolicies}
              optionValueKey="name"
              isLoading={isLoadingQueries}
              isDisabled={isLoadingQueries || isStoragePoliciesError}
              error={fieldState.error && t('server_config_error_thick_storage')}
            />
          )}
        />
        {hanaServers.map((server, index) => (
          <FormAccordion key={server.id} label={`${t('vm')} ${index + 1}`}>
            <div className="flex flex-col gap-y-4">
              <RhfField
                controllerParams={register(
                  `hanaServers.${index}.name` as const,
                )}
                helperMessage={t('server_config_helper_vm_name')}
              >
                <RhfField.Label>
                  {t('server_config_input_vm_name')}
                </RhfField.Label>
                <RhfField.Input
                  minlength={SERVER_CONFIG_LIMITS.vmNameMinLength}
                  maxlength={SERVER_CONFIG_LIMITS.vmNameMaxLength}
                />
                <RhfField.HelperAuto />
                <RhfField.VisualHintCounter
                  max={SERVER_CONFIG_LIMITS.vmNameMaxLength}
                />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `hanaServers.${index}.vcpus` as const,
                )}
                helperMessage={t('server_config_helper_vcpu_hana_vm')}
              >
                <RhfField.Label>{FORM_LABELS.vcpus}</RhfField.Label>
                <RhfField.Quantity
                  step={1}
                  min={SERVER_CONFIG_LIMITS.vmHanaMinVcpu}
                  max={SERVER_CONFIG_LIMITS.vmMaxVcpu}
                />
                <RhfField.HelperAuto />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `hanaServers.${index}.memory` as const,
                )}
                helperMessage={t('server_config_helper_ram_hana_vm')}
              >
                <RhfField.Label>{t('ram')}</RhfField.Label>
                <RhfField.Quantity
                  step={1}
                  min={SERVER_CONFIG_LIMITS.vmHanaMinRam}
                  max={SERVER_CONFIG_LIMITS.vmMaxRam}
                />
                <RhfField.HelperAuto />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `hanaServers.${index}.rootPassword` as const,
                )}
                helperMessage={t('server_config_helper_root_password')}
              >
                <RhfField.Label>
                  {t('server_config_input_root_password')}
                </RhfField.Label>
                <RhfField.Password
                  minlength={SERVER_CONFIG_LIMITS.rootPasswordMinLength}
                  maxlength={SERVER_CONFIG_LIMITS.rootPasswordMaxLength}
                />
                <RhfField.HelperAuto />
                <RhfField.VisualHintCounter
                  max={SERVER_CONFIG_LIMITS.rootPasswordMaxLength}
                />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `hanaServers.${index}.ipAddress` as const,
                )}
                helperMessage={t('server_config_helper_ipv4_address')}
              >
                <RhfField.Label>
                  {t('server_config_input_ipv4_address')}
                </RhfField.Label>
                <RhfField.Input />
                <RhfField.HelperAuto />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `hanaServers.${index}.instanceNumber` as const,
                )}
                helperMessage={t('server_config_helper_instance_number')}
              >
                <RhfField.Label>
                  {t('server_config_input_instance_number')}
                </RhfField.Label>
                <RhfField.Input
                  minlength={SERVER_CONFIG_LIMITS.instanceNumberLength}
                  maxlength={SERVER_CONFIG_LIMITS.instanceNumberLength}
                />
                <RhfField.HelperAuto />
                <RhfField.VisualHintCounter
                  max={SERVER_CONFIG_LIMITS.instanceNumberLength}
                />
              </RhfField>
            </div>
          </FormAccordion>
        ))}
        <OdsText preset="heading-3">
          {t('server_config_applications_servers')}
        </OdsText>
        <Controller
          name="applicationServerOva"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={t('server_config_input_ova_model')}
              placeholder={t('select_label')}
              options={sapCapabilities.ovaTemplates}
              isLoading={isLoadingQueries}
              isDisabled={isLoadingQueries || isSapCapabilitiesError}
              error={fieldState.error && t('server_config_error_ova_model')}
            />
          )}
        />
        <Controller
          name="applicationServerDatastore"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={FORM_LABELS.datastore}
              placeholder={t('select_label')}
              options={datastoreNames}
              isLoading={isLoadingQueries}
              isDisabled={isLoadingQueries || isDatastoresError}
              error={fieldState.error && t('server_config_error_datastore')}
            />
          )}
        />
        {applicationServers.map((server, index) => (
          <FormAccordion
            key={server.id}
            label={`${t('vm')} ${index + 1}`}
            className="flex flex-col gap-y-4 max-w-5xl"
          >
            <div className="flex flex-col gap-y-4 max-w-5xl">
              <RhfField
                controllerParams={register(
                  `applicationServers.${index}.name` as const,
                )}
                helperMessage={t('server_config_helper_vm_name')}
              >
                <RhfField.Label>
                  {t('server_config_input_vm_name')}
                </RhfField.Label>
                <RhfField.Input
                  minlength={SERVER_CONFIG_LIMITS.vmNameMinLength}
                  maxlength={SERVER_CONFIG_LIMITS.vmNameMaxLength}
                />
                <RhfField.HelperAuto />
                <RhfField.VisualHintCounter
                  max={SERVER_CONFIG_LIMITS.vmNameMaxLength}
                />
              </RhfField>
              <Controller
                name={`applicationServers.${index}.role`}
                control={control}
                render={({ field }) => (
                  <RhfSelectField
                    field={fieldWithHandler(field)}
                    label={t('role')}
                    placeholder={t('select_label')}
                    options={Array.from(APPLICATION_SERVER_ROLES)}
                    isDisabled={true}
                  />
                )}
              />
              <RhfField
                controllerParams={register(
                  `applicationServers.${index}.vcpus` as const,
                )}
                helperMessage={t('server_config_helper_vcpu_applications_vm')}
              >
                <RhfField.Label>{FORM_LABELS.vcpus}</RhfField.Label>
                <RhfField.Quantity
                  step={1}
                  min={SERVER_CONFIG_LIMITS.vmApplicationMinVcpu}
                  max={SERVER_CONFIG_LIMITS.vmMaxVcpu}
                />
                <RhfField.HelperAuto />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `applicationServers.${index}.memory` as const,
                )}
                helperMessage={t('server_config_helper_ram_applications_vm')}
              >
                <RhfField.Label>{t('ram')}</RhfField.Label>
                <RhfField.Quantity
                  step={1}
                  min={SERVER_CONFIG_LIMITS.vmApplicationMinRam}
                  max={SERVER_CONFIG_LIMITS.vmMaxRam}
                />
                <RhfField.HelperAuto />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `applicationServers.${index}.rootPassword` as const,
                )}
                helperMessage={t('server_config_helper_root_password')}
              >
                <RhfField.Label>
                  {t('server_config_input_root_password')}
                </RhfField.Label>
                <RhfField.Password
                  minlength={SERVER_CONFIG_LIMITS.rootPasswordMinLength}
                  maxlength={SERVER_CONFIG_LIMITS.rootPasswordMaxLength}
                />
                <RhfField.HelperAuto />
                <RhfField.VisualHintCounter
                  max={SERVER_CONFIG_LIMITS.rootPasswordMaxLength}
                />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `applicationServers.${index}.ipAddress` as const,
                )}
                helperMessage={t('server_config_helper_ipv4_address')}
              >
                <RhfField.Label>
                  {t('server_config_input_ipv4_address')}
                </RhfField.Label>
                <RhfField.Input />
                <RhfField.HelperAuto />
              </RhfField>
              <RhfField
                controllerParams={register(
                  `applicationServers.${index}.instanceNumber` as const,
                )}
                helperMessage={t('server_config_helper_instance_number')}
              >
                <RhfField.Label>
                  {t('server_config_input_instance_number')}
                </RhfField.Label>
                <RhfField.Input
                  minlength={SERVER_CONFIG_LIMITS.instanceNumberLength}
                  maxlength={SERVER_CONFIG_LIMITS.instanceNumberLength}
                />
                <RhfField.HelperAuto />
                <RhfField.VisualHintCounter
                  max={SERVER_CONFIG_LIMITS.instanceNumberLength}
                />
              </RhfField>
              <div className="flex gap-x-2">
                <OdsButton
                  label={t('copy_label')}
                  variant="outline"
                  onClick={() => copyApplicationServer(index)}
                  isDisabled={hasReachMaximumVM}
                />
                <OdsButton
                  label={t('delete_label')}
                  variant="outline"
                  onClick={() => removeApplicationServer(index)}
                  isDisabled={
                    !isApplicationServerDeletable({
                      serverIndex: index,
                      deploymentType: values.deploymentType,
                    })
                  }
                />
              </div>
            </div>
          </FormAccordion>
        ))}
        {applicationServerError && (
          <OdsText className="field__error">
            {t(`server_config_error_${applicationServerError}`)}
          </OdsText>
        )}
        <OdsButton
          label={t('server_config_add_vm_cta')}
          variant="outline"
          onClick={() => appendApplicationServer(DEFAULT_APPLICATION_SERVER)}
          isDisabled={hasReachMaximumVM}
        />
      </FormLayout>
    </FormProvider>
  );
}
