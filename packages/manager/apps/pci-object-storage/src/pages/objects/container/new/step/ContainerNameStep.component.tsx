import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContext, useMemo, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  OdsFormField,
  OdsInput,
  OdsLink,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ContainerCreationForn,
  useContainerCreationStore,
} from '../useContainerCreationStore';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  STORAGE_ASYNC_REPLICATION_LINK,
} from '@/constants';

const validNameRegex = /^[a-z0-9]([a-z0-9.-]{1,61})[a-z0-9]$/;

interface ContainerNameStepProps {
  isCreationPending: boolean;
  onSubmit: (form: ContainerCreationForn) => void;
}

export function ContainerNameStep({
  isCreationPending,
  onSubmit,
}: Readonly<ContainerNameStepProps>) {
  const { t } = useTranslation(['containers/add', 'pci-common']);

  const context = useContext(ShellContext);
  const { tracking } = context.shell;
  const navigate = useNavigate();
  const { ovhSubsidiary } = context.environment.getUser();
  const { form, stepper, setContainerName } = useContainerCreationStore();
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validNameRegex.test(form.containerName);
  let nameError: string | undefined;
  if (isTouched && !form.containerName) {
    nameError = t('pci-common:common_field_error_required');
  } else if (isTouched && !isValid) {
    nameError = t('pci-common:common_field_error_pattern');
  }

  const order = useMemo(() => {
    if (
      form.offer === OBJECT_CONTAINER_OFFER_SWIFT ||
      (form.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD &&
        form.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE)
    ) {
      return 4;
    }
    if (form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES) {
      return 8;
    }
    return 7;
  }, [form.offer, form.deploymentMode]);

  const asyncReplicationLink =
    STORAGE_ASYNC_REPLICATION_LINK[ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  return (
    <StepComponent
      title={t('pci_projects_project_storages_containers_add_name_title')}
      isOpen={stepper.containerName.isOpen || stepper.containerName.isLocked}
      isChecked={stepper.containerName.isChecked}
      isLocked={stepper.containerName.isLocked || isCreationPending}
      order={order}
      next={{
        action: () => {
          onSubmit(form);
        },
        label: t('pci_projects_project_storages_containers_add_submit_label'),
        isDisabled: !isValid || !!nameError,
      }}
      skip={{
        action: () => {
          tracking?.trackClick({
            name: 'storage_container_cancel_creation',
            type: 'action',
          });
          navigate('..');
        },
        label: t('pci_projects_project_storages_containers_add_cancel_label'),
      }}
    >
      <OdsFormField error={nameError}>
        <OdsInput
          value={form.containerName}
          name="containerName"
          color="primary"
          isRequired
          onOdsChange={(event) => {
            setContainerName(`${event.detail.value || ''}`);
          }}
          onOdsBlur={() => {
            setIsTouched(true);
          }}
        />

        <OdsText
          slot="helper"
          preset="caption"
          className={`max-w-2xl ${nameError ? 'text-critical' : ''}`}
        >
          {t(
            'pci_projects_project_storages_containers_add_pattern_help_storage-s3',
          )}
        </OdsText>
      </OdsFormField>

      {(form.deploymentMode === OBJECT_CONTAINER_MODE_MONO_ZONE ||
        form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES) &&
        !form.offsiteReplication && (
          <OdsMessage
            className="my-8"
            color="information"
            isDismissible={false}
          >
            <OdsText preset="paragraph">
              {t(
                'pci_projects_project_storages_containers_add_replication_rules_info',
              )}{' '}
              <OdsLink
                color="primary"
                href={asyncReplicationLink}
                target="_blank"
                icon="external-link"
                label={t(
                  'pci_projects_project_storages_containers_add_replication_rules_info_link',
                )}
              />
            </OdsText>
          </OdsMessage>
        )}

      {isCreationPending && (
        <div className="my-4">
          <OdsSpinner size="md" />
        </div>
      )}
    </StepComponent>
  );
}
