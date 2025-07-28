import { Trans, useTranslation } from 'react-i18next';
import {
  useCatalogPrice,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Text, Message, MessageBody } from '@ovhcloud/ods-react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DefaultError } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useInstanceBackupAction } from '@/data/hooks/instance/action/useInstanceAction';
import { useInstanceBackupPrice } from '@/data/hooks/instance/action/useInstanceBackupPrice';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';
import { useProjectId } from '@/hooks/project/useProjectId';
import { isApiErrorResponse } from '@/utils';
import {
  TSchemaInput,
  TSchemaOutput,
  useInputSchema,
} from '@/input-validation';
import {
  Form,
  InputField,
  SelectField,
  SelectFieldGroup,
  ToggleField,
} from '@/components/zod-form';

const useFormSchema = () => {
  const {
    object,
    discriminatedUnion,
    literal,
    string,
    remove,
    nullableRequired,
  } = useInputSchema();

  return useMemo(
    () =>
      discriminatedUnion('distantSnapshot', [
        object({
          snapshotName: string(),
          distantSnapshot: literal(true),
          distantRegion: nullableRequired(string()),
          distantSnapshotName: nullableRequired(string()),
        }),
        object({
          snapshotName: string(),
          distantSnapshot: literal(false),
          distantRegion: remove(string()),
          distantSnapshotName: remove(string()),
        }),
      ]).transform(
        ({
           snapshotName,
           distantSnapshot,
           distantRegion,
           distantSnapshotName,
         }) => ({
          snapshotName,
          distantSnapshot: distantSnapshot
            ? { name: distantSnapshotName, region: distantRegion }
            : undefined,
        }),
      ),
    [object, discriminatedUnion, literal, string, remove, nullableRequired],
  );
};

type TFormFieldsValues = TSchemaInput<ReturnType<typeof useFormSchema>>;

const DistantSnapshotSection = ({
                                  projectId,
                                  continents,
                                }: {
  projectId: string;
  continents: ReturnType<typeof useInstanceBackupPrice>['distantContinents'];
}) => {
  const { t } = useTranslation('actions');
  const { watch } = useFormContext<TFormFieldsValues>();

  const open = watch('distantSnapshot');
  const distantRegion = watch('distantRegion');

  const {
    price: backupPrice,
    isLoading: isBackupLoading,
  } = useInstanceBackupPrice(projectId, distantRegion ?? '');

  const { getFormattedCatalogPrice } = useCatalogPrice(3);
  const price = useMemo(
    () => (backupPrice ? getFormattedCatalogPrice(backupPrice) : null),
    [backupPrice, getFormattedCatalogPrice],
  );

  const regionItems = useMemo(
    () =>
      continents
        .entries()
        .map<SelectFieldGroup>(([label, regions]) => ({
          label,
          options: regions.map((region) => ({
            label: region.label,
            value: region.name,
          })),
        }))
        .toArray(),
    [continents],
  );

  const showActivateRegionWarning = useMemo(
    () =>
      !!distantRegion &&
      !!continents
        .values()
        .find(
          (regions) =>
            regions.find((r) => r.name === distantRegion)?.enabled === false,
        ),
    [distantRegion, continents],
  );

  if (!open) return null;

  return (
    <>
      <InputField<TFormFieldsValues>
        label={t('pci_instances_actions_backup_instance_distant_name_label')}
        name={'distantSnapshotName'}
        type={'text'}
      />

      <SelectField<TFormFieldsValues>
        label={t('pci_instances_actions_backup_instance_distant_region_label')}
        name={'distantRegion'}
        items={regionItems}
      />

      {!!price && !isBackupLoading && (
        <p className="text-sm font-medium">
          {t('pci_instances_actions_backup_instance_distant_region_price', {
            price,
          })}
        </p>
      )}

      {showActivateRegionWarning && (
        <Message
          color={'warning'}
          className="mt-6"
        >
          <MessageBody>
            {t('pci_instances_actions_backup_instance_region_enable_warning')}
          </MessageBody>
        </Message>
      )}
    </>
  );
};

const InstanceBackupLink = ({ children }: PropsWithChildren) => {
  const projectUrl = useProjectUrl('public-cloud');

  return <a href={`${projectUrl}/storages/instance-backups`}>{children}</a>;
};

const BackupActionPage = () => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { t } = useTranslation('actions');
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

  const { mutationHandler, isPending } = useInstanceBackupAction(projectId, {
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
  });

  const formSchema = useFormSchema();

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
      section={'backup'}
      isLoading={isLoading}
      wrapper={({ children }: PropsWithChildren) => (
        <Form
          schema={formSchema}
          onSubmit={handleInstanceAction}
          values={{
            snapshotName: defaultSnapshotName,
            distantSnapshot: false,
            distantSnapshotName: defaultSnapshotName,
            distantRegion: null,
          }}
        >
          {children}
        </Form>
      )}
    >
      <div className="flex flex-col gap-4">
        <InputField<TFormFieldsValues>
          label={t('pci_instances_actions_backup_instance_name_label')}
          name={'snapshotName'}
          type="text"
        />
        {!!price && !isBackupLoading && (
          <Text>
            {t('pci_instances_actions_backup_instance_price', {
              price,
            })}
          </Text>
        )}

        {distantContinents.size > 0 && (
          <>
            <ToggleField<TFormFieldsValues>
              label={t('pci_instances_actions_backup_instance_distant_label')}
              name={'distantSnapshot'}
            />

            <DistantSnapshotSection
              projectId={projectId}
              continents={distantContinents}
            />
          </>
        )}
      </div>
    </ActionModal>
  );
};

export default BackupActionPage;
