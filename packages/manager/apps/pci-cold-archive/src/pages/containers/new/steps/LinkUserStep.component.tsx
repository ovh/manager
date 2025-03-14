import { StepComponent } from '@ovh-ux/manager-react-components';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContainerCreationStore } from '../useContainerCreationStore';
import LinkUserSelector from './LinkUserSelector.component';
import { CONTAINER_USER_ASSOCIATION_MODES } from '@/constants';
import LinkUserCreation from './LinkUserCreation.component';
import { TUser } from '@/api/data/users';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

export function LinkUserStep() {
  const { t } = useTranslation([
    'cold-archive/new',
    'cold-archive/new/link-user',
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

  const { data: project } = useProject();

  const {
    form,
    stepper,
    editOwnerId,
    submitOwnerId,
    setOwnerId,
    setSelectedUser,
  } = useContainerCreationStore();

  const { trackActionClick } = useTracking(
    COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER,
  );

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
        action: () => {
          trackNextStepClick(COLD_ARCHIVE_TRACKING.CONTAINERS.STEPPER.STEP_1);
          submitOwnerId();
        },
        label: t('common_stepper_next_button_label', { ns: 'pci-common' }),
        isDisabled: !form.ownerId,
      }}
      edit={{
        action: editOwnerId,
        label: t('common_stepper_modify_this_step', { ns: 'pci-common' }),
      }}
    >
      <div className="flex flex-col gap-8">
        <OdsText preset="paragraph">
          {t(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_description',
            { ns: 'cold-archive/new/link-user' },
          )}
        </OdsText>

        {!associateMode && (
          <div className="flex gap-4">
            <OdsButton
              onClick={() => {
                trackActionClick(
                  COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.EXISTING_USER,
                );
                setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.LINKED);
              }}
              variant="ghost"
              size="sm"
              label={t(
                'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select',
                { ns: 'cold-archive/new/link-user' },
              )}
            />
            <OdsButton
              onClick={() => {
                trackActionClick(
                  COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER,
                );
                setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.CREATE);
              }}
              variant="outline"
              size="sm"
              label={t(
                'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_create',
                { ns: 'cold-archive/new/link-user' },
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
