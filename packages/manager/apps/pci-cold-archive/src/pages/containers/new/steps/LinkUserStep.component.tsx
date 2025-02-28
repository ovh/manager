import { StepComponent } from '@ovh-ux/manager-react-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { useContainerCreationStore } from '../useContainerCreationStore';
import LinkUserSelector from './LinkUserSelector.component';
import { CONTAINER_USER_ASSOCIATION_MODES } from '@/constants';
import LinkUserCreation from './LinkUserCreation.component';
import { TUser } from '@/api/data/users';

export function LinkUserStep() {
  const { t } = useTranslation([
    'cold-archive/new',
    'cold-archive/new/link-user',
    'pci-common',
  ]);

  const { data: project } = useProject();

  const {
    form,
    stepper,
    editOwnerId,
    submitOwnerId,
    setOwnerId,
    setSelectedUser,
  } = useContainerCreationStore();

  const [associateMode, setAssociateMode] = useState('');

  const onCancel = () => {
    setAssociateMode('');
    setOwnerId(undefined);
  };

  const onSelectOwner = (user: TUser) => {
    setOwnerId(user?.id);
    setSelectedUser(user);
  };

  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_cold_archive_add_step_link_user_archive_header',
      )}
      isOpen={stepper.ownerId.isOpen || stepper.ownerId.isLocked}
      isChecked={stepper.ownerId.isChecked}
      isLocked={stepper.ownerId.isLocked}
      order={1}
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
      <div className="flex flex-col gap-8">
        <OdsText preset="paragraph">
          {t(
            'cold-archive/new/link-user:pci_projects_project_storages_cold_archive_add_step_link_user_archive_description',
          )}
        </OdsText>

        {!associateMode && (
          <div className="flex gap-4">
            <OdsButton
              onClick={() =>
                setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.LINKED)
              }
              variant="ghost"
              size="sm"
              label={t(
                'cold-archive/new/link-user:pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select',
              )}
            />
            <OdsButton
              onClick={() =>
                setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.CREATE)
              }
              variant="outline"
              size="sm"
              label={t(
                'cold-archive/new/link-user:pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_create',
              )}
              icon="plus"
              isDisabled={isDiscoveryProject(project)}
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
      </div>
    </StepComponent>
  );
}
