import { StepComponent } from '@ovh-ux/manager-react-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useContainerCreationStore } from '../useContainerCreationStore';
import LinkUserCreation from './LinkUserCreation.component';
import LinkUserSelector from './LinkUserSelector.component';
import { TUser } from '@/api/data/user';
import {
  CONTAINER_USER_ASSOCIATION_MODES,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';

export function LinkUserStep() {
  const { t } = useTranslation([
    'containers/add',
    'pci-common',
    'containers/associate-user-to-container',
  ]);

  const {
    form,
    stepper,
    editOwnerId,
    submitOwnerId,
    setOwnerId,
  } = useContainerCreationStore();

  const [associateMode, setAssociateMode] = useState('');

  const onCancel = () => {
    setAssociateMode('');
    setOwnerId(undefined);
  };
  const onSelectOwner = (user: TUser) => {
    setOwnerId(user?.id);
  };

  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_add_create_or_linked_user_title',
      )}
      isOpen={stepper.ownerId.isOpen || stepper.ownerId.isLocked}
      isChecked={stepper.ownerId.isChecked}
      isLocked={stepper.ownerId.isLocked}
      order={form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES ? 6 : 5}
      next={{
        action: submitOwnerId,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !form.ownerId,
      }}
      edit={{
        action: editOwnerId,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_containers_add_create_or_linked_user_description',
        )}
      </OdsText>

      {associateMode === '' && (
        <div className="mt-6 flex gap-4">
          <OdsButton
            onClick={() =>
              setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.LINKED)
            }
            variant="ghost"
            size="sm"
            label={t(
              'containers/associate-user-to-container:pci_projects_project_storages_containers_add_create_or_linked_user_mode_linked_user_btn',
            )}
          />
          <OdsButton
            onClick={() =>
              setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.CREATE)
            }
            variant="outline"
            size="sm"
            label={t(
              'containers/associate-user-to-container:pci_projects_project_storages_containers_add_create_or_linked_user_mode_create_user_btn',
            )}
            icon="plus"
          />
        </div>
      )}

      {associateMode === CONTAINER_USER_ASSOCIATION_MODES.LINKED && (
        <LinkUserSelector
          userId={form.ownerId}
          onSelectOwner={onSelectOwner}
          onCancel={onCancel}
        />
      )}

      {associateMode === CONTAINER_USER_ASSOCIATION_MODES.CREATE && (
        <LinkUserCreation onCancel={onCancel} onCreateUser={onSelectOwner} />
      )}
    </StepComponent>
  );
}
