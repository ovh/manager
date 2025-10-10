import { Trans, useTranslation } from 'react-i18next';
import {
  useCatalogPrice,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DefaultError } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useInstanceBackupAction } from '@/data/hooks/instance/action/useInstanceAction';
import { useInstanceBackupPrice } from '@/data/hooks/instance/action/useInstanceBackupPrice';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';
import { useProjectId } from '@/hooks/project/useProjectId';
import { isApiErrorResponse } from '@/utils';
import { TSchemaOutput } from '@/input-validation';
import { InputField, ToggleField } from '@/components/form';
import { useBackupFormShema } from '@/pages/instances/action/hooks/useBackupFormShema';
import { DistantSnapshotSection } from './components/backup-action/DistantSnapshotSection.component';

const InstanceBackupLink = ({ children }: PropsWithChildren) => {
  const projectUrl = useProjectUrl('public-cloud');

  return <a href={`${projectUrl}/storages/instance-backups`}>{children}</a>;
};

const BackupActionPage = () => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { t } = useTranslation(['actions', 'common']);
  const { addError, addInfo } = useNotifications();
  const navigate = useNavigate();

  const { instance, isLoading } = useInstanceActionModal(
    region,
    instanceId,
    'backup',
  );

  const defaultSnapshotName = useMemo(
    () => `${instance?.name} ${formatISO(new Date())}`,
    [instance?.name],
  );

  const {
    price: backupPrice,
    isLoading: isBackupLoading,
    distantContinents,
  } = useInstanceBackupPrice(projectId, region);

  const closeModal = () => navigate('..');

  const onError = (rawError: unknown) => {
    const errorMessage = isApiErrorResponse(rawError)
      ? rawError.response?.data.message
      : (rawError as DefaultError).message;
    addError(
      t(`pci_instances_actions_backup_instance_error_message`, {
        name: instance?.name,
        error: errorMessage,
      }),
      true,
    );
  };

  const { mutationHandler, isPending } = useInstanceBackupAction(
    projectId,
    region,
    {
      onError,
      onSuccess(_res, { snapshotName, distantSnapshot }) {
        addInfo(
          distantSnapshot ? (
            <Trans
              components={{
                InstanceBackupLink: <InstanceBackupLink />,
              }}
              i18nKey={
                'pci_instances_actions_backup_instance_with_distant_success_message'
              }
              t={t}
              values={{
                name: snapshotName,
                distantName: distantSnapshot.name,
              }}
            />
          ) : (
            t('pci_instances_actions_backup_instance_success_message', {
              name: snapshotName,
            })
          ),
          true,
        );

        closeModal();
      },
    },
  );

  const formSchema = useBackupFormShema();

  const { handleSubmit, formState, ...restForm } = useForm({
    resolver: zodResolver(formSchema),
    values: {
      snapshotName: defaultSnapshotName,
      distantSnapshot: false,
      distantSnapshotName: defaultSnapshotName,
      distantRegion: null,
    },
    mode: 'onBlur',
  });

  const handleInstanceAction = useCallback(
    (formValues: TSchemaOutput<typeof formSchema>) => {
      if (instance)
        mutationHandler({
          instance,
          ...formValues,
        });
    },
    [instance, mutationHandler],
  );

  const { getFormattedCatalogPrice } = useCatalogPrice(3);

  const price = backupPrice ? getFormattedCatalogPrice(backupPrice) : null;
  return (
    <ActionModal
      title={t(`pci_instances_actions_backup_instance_title`)}
      isPending={isPending}
      onModalClose={closeModal}
      instance={instance}
      section="backup"
      isLoading={isLoading}
      variant="primary"
      className="max-h-[unset] mt-[25vh]"
      wrapper={({ children }: PropsWithChildren) => (
        <FormProvider
          formState={formState}
          handleSubmit={handleSubmit}
          {...restForm}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(handleInstanceAction)}>{children}</form>
        </FormProvider>
      )}
    >
      <div className="flex flex-col gap-4 mt-6">
        <Controller
          render={({ field, fieldState: { error, invalid } }) => (
            <InputField
              label={t('pci_instances_actions_backup_instance_name_label')}
              invalid={invalid}
              errorMessage={error?.message}
              type="text"
              {...field}
            />
          )}
          name="snapshotName"
        />
        {!!price && !isBackupLoading && (
          <Text preset={TEXT_PRESET.caption}>
            {t('pci_instances_actions_backup_instance_price', {
              price,
            })}
          </Text>
        )}

        {distantContinents.size > 0 && (
          <div className="mt-6">
            <Controller
              render={({ field: { value: fieldValue, onChange, onBlur } }) => (
                <ToggleField
                  label={t(
                    'pci_instances_actions_backup_instance_distant_label',
                  )}
                  checked={!!fieldValue}
                  onCheckedChange={() => onChange(!fieldValue)}
                  onBlur={onBlur}
                  badges={[
                    {
                      label: t('common:pci_instances_common_new'),
                    },
                  ]}
                />
              )}
              name="distantSnapshot"
            />

            <DistantSnapshotSection
              projectId={projectId}
              continents={distantContinents}
            />
          </div>
        )}
      </div>
    </ActionModal>
  );
};

export default BackupActionPage;
