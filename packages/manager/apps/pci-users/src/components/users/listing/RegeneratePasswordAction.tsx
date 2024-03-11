import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegeneratePassword } from '@/hooks/useUser';
import { User } from '@/interface';
import useNotifications from '@/hooks/useNotifications';

export default function RegeneratePasswordAction({ user }: { user: User }) {
  const { t } = useTranslation('common');
  const { projectId } = useParams();
  const { addError, addSuccess, addInfo } = useNotifications();
  const navigate = useNavigate();
  const { regenerate } = useRegeneratePassword({
    projectId: `${projectId}`,
    userId: `${user.id}`,
    onError: (err: Error) => {
      addError(
        <>
          {t('pci_projects_project_users_password_message_error', {
            user: user.username,
            message: err && err.message,
          })}
        </>,
      );
    },
    onSuccess: (updatedUser: User) => {
      addInfo(
        <span
          dangerouslySetInnerHTML={{
            __html: t('pci_projects_project_users_password_message_infos', {
              user: updatedUser.username,
              password: updatedUser.password,
              interpolation: { escapeValue: false },
            }),
          }}
        ></span>,
      );
      addSuccess(
        <>
          {t('pci_projects_project_users_password_message_success', {
            user: updatedUser.username,
          })}
        </>,
      );
      navigate('.');
    },
  });
  return (
    <OsdsButton
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={regenerate}
      data-testid="regeneratePasswordButton"
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        level={ODS_TEXT_LEVEL.button}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot={'start'}
      >
        {t('pci_projects_project_users_password_label')}
      </OsdsText>
    </OsdsButton>
  );
}
