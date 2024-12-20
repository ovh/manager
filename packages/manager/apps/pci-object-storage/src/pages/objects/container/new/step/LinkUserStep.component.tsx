import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContainerCreationStore } from '../useContainerCreationStore';
import LinkUserCreation from './LinkUserCreation.component';
import LinkUserSelector from './LinkUserSelector.component';
import { TUser } from '@/api/data/user';
import { CONTAINER_USER_ASSOCIATION_MODES } from '@/constants';

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
    setOwnerId('');
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
      order={4}
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
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {t(
          'pci_projects_project_storages_containers_add_create_or_linked_user_description',
        )}
      </OsdsText>
      {associateMode === '' && (
        <div className="mt-6 flex">
          <OsdsButton
            onClick={() =>
              setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.LINKED)
            }
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t(
              'containers/associate-user-to-container:pci_projects_project_storages_containers_add_create_or_linked_user_mode_linked_user_btn',
            )}
          </OsdsButton>
          <OsdsButton
            onClick={() =>
              setAssociateMode(CONTAINER_USER_ASSOCIATION_MODES.CREATE)
            }
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            class="ml-4"
          >
            <OsdsIcon
              name={ODS_ICON_NAME.PLUS}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xxs}
              className="mr-4"
            />
            {t(
              'containers/associate-user-to-container:pci_projects_project_storages_containers_add_create_or_linked_user_mode_create_user_btn',
            )}
          </OsdsButton>
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
