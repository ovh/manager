import { useCallback, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { BaremetalOption } from '@/components/CommonFields/BaremetalOption/BaremetalOption.component';
import { DownloadCode } from '@/components/DownloadCode/DownloadCode.component';
import { RhfField } from '@/components/Fields/RhfField.component';
import { useBackupVSPCTenantAgentDownloadLink } from '@/data/hooks/agents/getDownloadLinkAgent';
import { useAddConfigurationVSPCTenantAgent } from '@/data/hooks/agents/postAgent';
import { useBaremetalsList } from '@/data/hooks/baremetal/useBaremetalsList';
import { useVSPCTenantsOptions } from '@/data/hooks/tenants/useVspcTenants';
import { OS_LABELS } from '@/module.constants';
import { OS } from '@/types/Os.type';
import { getProductResourceNames } from '@/utils/getProductResourceNamesSet';

const FORM_ID = 'form-link-agent-title' as const;

const ADD_CONFIGURATION_SCHEMA = z.object({
  server: z.string().min(1),
  os: z.string().min(1),
});

const AddConfigurationPage = () => {
  const { t } = useTranslation([
    BACKUP_AGENT_NAMESPACES.AGENT,
    NAMESPACES.FORM,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const [formSubmitError, setFormSubmitError] = useState<string>();
  const {
    mutate,
    isPending: isAddConfigurationPending,
    isSuccess,
  } = useAddConfigurationVSPCTenantAgent({
    onError: (apiError) => {
      setFormSubmitError(
        t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_agent_banner_api_error`, {
          errorMessage: apiError.message,
        }),
      );
    },
  });

  const { data: productNameExcluded, isPending: isProductNameExcludedPending } = useQuery({
    ...useVSPCTenantsOptions(),
    select: (data) => getProductResourceNames(data),
  });
  const { flattenData, isPending } = useBaremetalsList();

  const baremetalList =
    !isProductNameExcludedPending && !isPending
      ? flattenData.filter(({ name }) => !productNameExcluded?.has(name))
      : [];

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitted, isValid, isSubmitSuccessful },
  } = useForm<z.infer<typeof ADD_CONFIGURATION_SCHEMA>>({
    resolver: zodResolver(ADD_CONFIGURATION_SCHEMA),
    mode: 'onTouched',
    defaultValues: { server: '', os: '' },
  });
  const onSubmit = useCallback(
    (data: z.infer<typeof ADD_CONFIGURATION_SCHEMA>) => {
      const serverDetails = baremetalList.find((server) => server.name === data.server);

      if (!serverDetails) {
        return setFormSubmitError(
          t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_agent_error_resource_not_found`),
        );
      }

      mutate({
        region: serverDetails.region,
        ips: [`${serverDetails.ip}/32`],
        displayName: `agent-${serverDetails.name}`,
        productResourceName: serverDetails.name,
      });
    },
    [mutate, baremetalList, setFormSubmitError],
  );

  const os = useWatch({ name: 'os', control });

  const { data: downloadLink, isLoading: isLoadingDownloadLink } =
    useBackupVSPCTenantAgentDownloadLink({ os: os as OS | undefined });

  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitDisabled = (isSubmitted && !isValid) || isSuccess;
  const isDownloadEnabled = isSuccess && !!downloadLink;

  return (
    <Drawer
      isOpen
      heading={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_server`)}
      onDismiss={goBack}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
      onSecondaryButtonClick={goBack}
    >
      <OdsText id={FORM_ID} preset="heading-3">
        {t('link_agent_to_a_server')}
      </OdsText>

      <form
        ref={formRef}
        aria-labelledby={FORM_ID}
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      >
        <RhfField
          controllerParams={register('server')}
          helperMessage={t(`${NAMESPACES.FORM}:required_field`)}
          control={control}
          className="w-full"
        >
          <RhfField.Label>{t('select_server')}</RhfField.Label>
          <RhfField.Combobox
            placeholder={t('select_server')}
            isRequired
            isDisabled={isPending}
            allowNewElement={false}
          >
            {baremetalList?.map(({ name, ip, iam: { displayName } }) => (
              <BaremetalOption key={name} name={name} ip={ip} displayName={displayName} />
            ))}
          </RhfField.Combobox>
        </RhfField>

        <RhfField
          controllerParams={register('os')}
          helperMessage={t(`${NAMESPACES.FORM}:required_field`)}
          control={control}
          className="w-full"
        >
          <RhfField.Label>{t('select_os')}</RhfField.Label>

          <RhfField.Select placeholder={t('select_os')} isRequired>
            {Object.keys(OS_LABELS).map((osKey) => (
              <option key={osKey} value={osKey}>
                {OS_LABELS[osKey as OS]}
              </option>
            ))}
          </RhfField.Select>
        </RhfField>
        <OdsButton
          type="submit"
          label={t(`${NAMESPACES.ACTIONS}:add`)}
          isDisabled={isSubmitDisabled}
          isLoading={isAddConfigurationPending}
        />

        <section className={`mt-8 ${isSubmitSuccessful ? 'visible' : 'invisible'}`}>
          {formSubmitError && (
            <OdsMessage isDismissible={false} color="critical">
              {formSubmitError}
            </OdsMessage>
          )}
          {isSuccess && (
            <OdsMessage isDismissible={false} color="success">
              {t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_agent_banner_success`)}
            </OdsMessage>
          )}
        </section>
      </form>

      <section className="flex flex-col gap-4 mt-8 max-w-fit max-w-full">
        <OdsText id={FORM_ID} preset="heading-3">
          {t('download_agent')}
        </OdsText>
        <a href={downloadLink} download>
          <OdsButton
            type="button"
            label={t(`${NAMESPACES.ACTIONS}:download`)}
            isDisabled={!isDownloadEnabled}
            isLoading={isLoadingDownloadLink}
          />
        </a>
        {!isLoadingDownloadLink && (
          <DownloadCode
            className="break-all [&::part(tooltip)]:hidden"
            osCompatibility={(os as OS) ?? 'LINUX'}
            downloadLink={isDownloadEnabled ? downloadLink : '...'}
            canCopy={isDownloadEnabled}
          />
        )}
      </section>
    </Drawer>
  );
};

export default AddConfigurationPage;
