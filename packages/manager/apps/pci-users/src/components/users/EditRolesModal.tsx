import {
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  OdsCheckboxCheckedChangeEventDetail,
  OsdsCheckboxCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useUserRoles } from '@/hooks/useUser';
import { useAllRoles, useUpdateUserRoles } from '@/hooks/useRole';

interface EditRolesProps {
  projectId: string;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

export default function EditRolesModal({
  projectId,
  userId,
  onClose,
  onSuccess,
  onError,
}: EditRolesProps) {
  const { t } = useTranslation('common');
  const { data: roles, isPending: isPendingRoles } = useAllRoles(
    `${projectId}`,
  );
  const { data: userRoles, isPending: isPendingUserRoles } = useUserRoles(
    `${projectId}`,
    `${userId}`,
  );
  const { isPending: isPendingUpdate, update } = useUpdateUserRoles({
    projectId: `${projectId}`,
    userId,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });
  const [userRoleId, setUserRoleId] = useState<string[]>([]);
  useEffect(() => {
    if (userRoles) {
      setUserRoleId(
        userRoles.map((role) => {
          return role.id;
        }),
      );
    }
  }, [userRoles]);
  const isPending = isPendingUserRoles || isPendingRoles || isPendingUpdate;
  return (
    <>
      <OsdsModal
        headline={t('pci_projects_project_users_roles')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isPending ? (
            <>
              {roles?.roles.map((role) => (
                <OsdsCheckbox
                  key={role.id}
                  value={role.id}
                  checked={userRoleId.includes(role.id)}
                  onOdsCheckedChange={(
                    event: OsdsCheckboxCustomEvent<
                      OdsCheckboxCheckedChangeEventDetail
                    >,
                  ) => {
                    if (event.detail.checked) {
                      setUserRoleId([...userRoleId, event.detail.value]);
                    } else {
                      const indexRoleToRemove = userRoleId.indexOf(
                        event.detail.value,
                      );
                      userRoleId.splice(indexRoleToRemove, 1);
                      setUserRoleId([...userRoleId]);
                    }
                  }}
                >
                  <OsdsCheckboxButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                    interactive={true}
                    hasFocus={true}
                  >
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      slot={'end'}
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    >
                      {role.description}
                    </OsdsText>
                  </OsdsCheckboxButton>
                </OsdsCheckbox>
              ))}
            </>
          ) : (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          )}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
        >
          {t('pci_projects_project_users_roles_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => update(userRoleId)}
          {...(isPending ? { disabled: true } : {})}
          data-testid="submitRolesEditButton"
        >
          {t('pci_projects_project_users_roles_edit')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
