import { useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { BaremetalOption } from '@/components/CommonFields/BaremetalOption/BaremetalOption.component';
import { RhfField } from '@/components/Fields/RhfField.component';
import { useBaremetalsList } from '@/data/hooks/baremetal/useBaremetalsList';
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

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { flattenData, isLoading } = useBaremetalsList();

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = useForm<z.infer<typeof ADD_CONFIGURATION_SCHEMA>>({
    resolver: zodResolver(ADD_CONFIGURATION_SCHEMA),
    values: {
      server: '',
      os: '',
    },
  });
  const onSubmit = (data: z.infer<typeof ADD_CONFIGURATION_SCHEMA>) => console.log({ data });

  const os = useWatch({ name: 'os', control });

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
        heading={t(`${BACKUP_AGENT_NAMESPACES.AGENT}:add_configuration`)}
        onDismiss={goBack}
        primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:add`)}
        onPrimaryButtonClick={() => formRef.current?.requestSubmit()}
        isPrimaryButtonDisabled={isSubmitted && !isValid}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
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
        <section className="flex flex-col gap-4">
          <OdsText id={FORM_ID} preset="heading-3">
            {t('download_agent')}
          </OdsText>
          <OdsButton type="button" label={t(`${NAMESPACES.ACTIONS}:download`)} isDisabled={!os} />
        </section>
      </Drawer>
    </form>
  );
};

export default AddConfigurationPage;
