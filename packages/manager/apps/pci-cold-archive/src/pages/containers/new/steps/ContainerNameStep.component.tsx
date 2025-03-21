import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import LabelComponent from '@/components/Label.component';
import {
  ContainerCreationForm,
  useContainerCreationStore,
} from '../useContainerCreationStore';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

const COLD_ARCHIVE_NAME_ARCHIVE_PATTERN = /^[a-z0-9]([a-z0-9.-]{1,61})[a-z0-9]$/;

interface ContainerNameStepProps {
  isCreationPending: boolean;
  onSubmit: (form: ContainerCreationForm) => void;
}

export function ContainerNameStep({
  isCreationPending,
  onSubmit,
}: Readonly<ContainerNameStepProps>) {
  const { t } = useTranslation([
    'cold-archive/new/name-archive',
    'cold-archive/new',
    'pci-common',
  ]);
  const { tracking } = useContext(ShellContext).shell;

  const trackNextStepClick = (action: string) => {
    tracking?.trackClick({
      name: action,
      type: 'action',
      level2: COLD_ARCHIVE_TRACKING.PCI_LEVEL2,
    });
  };

  const navigate = useNavigate();

  const { trackCancelAction } = useTracking(
    COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER,
  );

  const goBack = () => navigate('..');

  const onCreationCancel = () => {
    trackCancelAction();
    goBack();
  };

  const { form, stepper, setContainerName } = useContainerCreationStore();
  const [isTouched, setIsTouched] = useState(false);

  const isValid = COLD_ARCHIVE_NAME_ARCHIVE_PATTERN.test(form.containerName);

  let nameError: string | undefined;

  if (isTouched && !form.containerName) {
    nameError = t('pci-common:common_field_error_required');
  } else if (isTouched && !isValid) {
    nameError = t('pci-common:common_field_error_pattern');
  }

  return (
    <StepComponent
      title={t(
        'cold-archive/new:pci_projects_project_storages_cold_archive_add_step_name_archive_header',
      )}
      isOpen={stepper.containerName.isOpen || stepper.containerName.isLocked}
      isChecked={stepper.containerName.isChecked}
      isLocked={stepper.containerName.isLocked || isCreationPending}
      order={2}
      next={{
        action: () => {
          trackNextStepClick(COLD_ARCHIVE_TRACKING.CONTAINERS.STEPPER.STEP_2);
          onSubmit(form);
        },
        label: t(
          'cold-archive/new:pci_projects_project_storages_cold_archive_add_action_create',
        ),
        isDisabled: !isValid || !!nameError,
      }}
      skip={{
        action: onCreationCancel,
        label: t(
          'cold-archive/new:pci_projects_project_storages_cold_archive_add_action_cancel',
        ),
      }}
    >
      <OdsFormField error={nameError}>
        <LabelComponent
          text={t(
            'cold-archive/new/name-archive:pci_projects_project_storages_cold_archive_add_step_name_archive_field_name',
          )}
        />
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
            'pci_projects_project_storages_cold_archive_add_step_name_archive_description',
          )}
        </OdsText>
      </OdsFormField>

      {isCreationPending && (
        <div className="my-4">
          <OdsSpinner size="md" />
        </div>
      )}
    </StepComponent>
  );
}
