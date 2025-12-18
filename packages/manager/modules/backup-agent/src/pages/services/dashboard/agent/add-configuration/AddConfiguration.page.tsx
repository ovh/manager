import { useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { useBaremetalsList } from '@/data/hooks/baremetal/useBaremetalsList';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { OS_LABELS } from '@/module.constants';
import { OS } from '@/types/Os.type';

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
  const { tenantId } = useRequiredParams('tenantId');
  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { flattenData, isLoading } = useBaremetalsList();

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
  const onSubmit = (data: z.infer<typeof ADD_CONFIGURATION_SCHEMA>) => console.log({ data });

  const os = useWatch({ name: 'os', control });

  const { data: downloadLink, isLoading: isLoadingDownloadLink } =
    useBackupVSPCTenantAgentDownloadLink({ tenantId, os: os as OS | undefined });

  const formRef = useRef<HTMLFormElement>(null);

  const isSuccess = isSubmitSuccessful; // TODO: [unmocking] replace with API response when unmocking

  const isSubmitDisabled = isSubmitted && !isValid;
  const isDownloadEnabled = isSuccess && !!downloadLink;

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
        heading={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_configuration`)}
        onDismiss={goBack}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
        onSecondaryButtonClick={goBack}
      >
        <OdsText id={FORM_ID} preset="heading-3">
          {t('link_agent_to_a_server')}
        </OdsText>

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
            isDisabled={isLoading}
            allowNewElement={false}
          >
            {flattenData?.map(({ name, ip, iam: { displayName } }) => (
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
          <RhfField.Combobox placeholder={t('select_os')} isRequired allowNewElement={false}>
            {Object.keys(OS_LABELS).map((osKey) => (
              <RhfField.ComboboxItem key={osKey} value={osKey}>
                {OS_LABELS[osKey as OS]}
              </RhfField.ComboboxItem>
            ))}
          </RhfField.Combobox>
        </RhfField>
        <OdsButton
          type="submit"
          label={t(`${NAMESPACES.ACTIONS}:add`)}
          isDisabled={isSubmitDisabled}
          onClick={() => formRef.current?.requestSubmit()}
        />

        <section className={`mt-8 ${isSubmitSuccessful ? 'visible' : 'invisible'}`}>
          {!isSuccess && (
            <OdsMessage isDismissible={false} color="critical">
              {t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_agent_banner_error`)}
            </OdsMessage>
          )}
          {isSuccess && (
            <OdsMessage isDismissible={false} color="success">
              {t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_agent_banner_success`)}
            </OdsMessage>
          )}
        </section>

        <section className="flex flex-col gap-4 mt-8 max-w-fit">
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
              downloadLink={isDownloadEnabled ? downloadLink : '...'}
              canCopy={isDownloadEnabled}
            />
          )}
        </section>
      </Drawer>
    </form>
  );
};

export default AddConfigurationPage;
