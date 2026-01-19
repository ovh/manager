import { useContext, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import capitalize from 'lodash.capitalize';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsMessage, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer, ErrorBoundary, useNotifications } from '@ovh-ux/manager-react-components';

import { BackupAgentContext } from '@/BackupAgent.context';
import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { RhfField } from '@/components/Fields/RhfField.component';
import { useBackupVSPCTenantAgentDetails } from '@/data/hooks/agents/getAgentDetails';
import { useEditConfigurationVSPCTenantAgent } from '@/data/hooks/agents/putAgent';
import { useBackupTenantPolicies } from '@/data/hooks/tenants/useVspcTenantBackupPolicies';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { LABELS } from '@/module.constants';

const FORM_ID = 'form-link-agent-title' as const;

const ADD_CONFIGURATION_SCHEMA = z.object({
  name: z.string().min(1),
  ip: z.string().min(1),
  serviceName: z.string().min(1),
  policy: z.string().min(1),
});

export const EditConfigurationPage = () => {
  const { addSuccess } = useNotifications();
  const [serverErrorMessage, setServerErrorMessage] = useState<undefined | string>();
  const { tenantId, agentId } = useRequiredParams('tenantId', 'agentId');
  const { t } = useTranslation([
    BACKUP_AGENT_NAMESPACES.AGENT,
    NAMESPACES.DASHBOARD,
    NAMESPACES.SYSTEM,
    NAMESPACES.FORM,
    NAMESPACES.ACTIONS,
  ]);

  const { appName } = useContext(BackupAgentContext);
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const {
    data: resourceAgent,
    isLoading,
    error,
    isSuccess,
    refetch,
  } = useBackupVSPCTenantAgentDetails({
    tenantId: tenantId,
    agentId: agentId,
  });
  const isAgentEnabled = resourceAgent?.status === 'ENABLED';

  const { data: policies, isLoading: isPoliciesLoading } = useBackupTenantPolicies({
    tenantId: tenantId,
  });

  const { mutate, isPending } = useEditConfigurationVSPCTenantAgent({
    onSuccess: () => {
      addSuccess(t('update_agent_banner_success', { agentName: resourceAgent?.currentState.name }));
      goBack();
    },
    onError: (apiError) => {
      setServerErrorMessage(apiError.message);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = useForm<z.infer<typeof ADD_CONFIGURATION_SCHEMA>>({
    resolver: zodResolver(ADD_CONFIGURATION_SCHEMA),
    defaultValues: async () => {
      const { data } = await refetch();
      return {
        name: data?.currentState?.name ?? '',
        ip: data?.currentState?.ips.join(', ') ?? '',
        serviceName: data?.currentState?.productResourceName ?? '',
        policy: data?.currentState?.policy ?? '',
      };
    },
  });
  const onSubmit = (data: z.infer<typeof ADD_CONFIGURATION_SCHEMA>) =>
    mutate({
      vspcTenantId: tenantId,
      backupAgentId: agentId,
      displayName: data.name,
      ips: resourceAgent!.currentState.ips,
      policy: data.policy,
    });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      aria-labelledby={FORM_ID}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
    >
      <Drawer
        isOpen
        heading={
          resourceAgent?.currentState.name ??
          t(`${BACKUP_AGENT_NAMESPACES.AGENT}:edit_configuration`)
        }
        onDismiss={goBack}
        primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:edit`)}
        onPrimaryButtonClick={() => formRef.current?.requestSubmit()}
        isPrimaryButtonDisabled={(isSubmitted && !isValid) || isLoading || !isAgentEnabled}
        isPrimaryButtonLoading={isPending}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
        onSecondaryButtonClick={goBack}
      >
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <OdsSpinner />
          </div>
        )}

        {!!error && (
          <ErrorBoundary isPreloaderHide={true} isRouteShellSync={true} redirectionApp={appName} />
        )}

        {isSuccess && (
          <>
            {serverErrorMessage && (
              <OdsMessage className="mb-6 w-full" color="critical" isDismissible={false}>
                {serverErrorMessage}
              </OdsMessage>
            )}

            {!isAgentEnabled && (
              <OdsMessage className="mb-6 w-full" color="warning" isDismissible={false}>
                {t('unable_edit_agent_not_enabled')}
              </OdsMessage>
            )}

            <OdsText id={FORM_ID} preset="heading-3">
              {t('service_informations')}
            </OdsText>

            <RhfField
              controllerParams={register('name')}
              helperMessage={t(`${NAMESPACES.FORM}:required_field`)}
              control={control}
              className="w-full"
            >
              <RhfField.Label>{t(`${NAMESPACES.DASHBOARD}:name`)}</RhfField.Label>
              <RhfField.Input isReadonly />
            </RhfField>
            <RhfField
              controllerParams={register('serviceName')}
              control={control}
              className="w-full"
            >
              <RhfField.Label>{t('service')}</RhfField.Label>
              <RhfField.Input isReadonly />
            </RhfField>
            <RhfField controllerParams={register('ip')} control={control} className="w-full">
              <RhfField.Label>{t(`${NAMESPACES.SYSTEM}:address_ip`)}</RhfField.Label>
              <RhfField.Input isReadonly />
            </RhfField>

            <RhfField
              controllerParams={register('policy')}
              helperMessage={t(`${NAMESPACES.FORM}:required_field`)}
              control={control}
              className="w-full"
            >
              <RhfField.Label>{LABELS.BACKUP_POLICY}</RhfField.Label>
              <RhfField.Select
                placeholder={LABELS.BACKUP_POLICY}
                isRequired
                isDisabled={isPoliciesLoading || !isAgentEnabled}
              >
                {policies?.map((policy) => (
                  <option key={policy} value={policy}>
                    {capitalize(policy)}
                  </option>
                ))}
              </RhfField.Select>
            </RhfField>
          </>
        )}
      </Drawer>
    </form>
  );
};

export default EditConfigurationPage;
