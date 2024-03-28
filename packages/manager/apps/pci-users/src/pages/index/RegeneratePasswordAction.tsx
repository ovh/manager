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
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovhcloud/manager-components';
import { useRegeneratePassword } from '@/api/hooks/useUser';
import { User } from '@/interface';
import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';

export default function RegeneratePasswordAction({ user }: { user: User }) {
  const { t } = useTranslation('common');
  const { projectId } = useParams();
  const { addError, addSuccess, addInfo } = useNotifications();
  const navigate = useNavigate();
  const { trackClick } = useTracking();
  const { regenerate } = useRegeneratePassword({
    projectId: `${projectId}`,
    userId: `${user.id}`,
    onError: (err: Error) => {
      addError(
        <>
          {t('pci_projects_project_users_password_message_error', {
            user: user.username,
            message: err?.message,
          })}
        </>,
        true,
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
        true,
      );
      addSuccess(
        <>
          {t('pci_projects_project_users_password_message_success', {
            user: updatedUser.username,
          })}
        </>,
        true,
      );
      navigate('.');
    },
  });
  return (
    <OsdsButton
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={() => {
        trackClick({
          name: `${PAGE_PREFIX}::users::regen-password`,
          type: 'action',
          level2: PCI_LEVEL2,
        });
        regenerate();
      }}
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
