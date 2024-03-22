import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import { useEffect, useState } from 'react';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useCreateUser } from '@/hooks/useUser';
import RolesSelector from '@/pages/add/components/RolesSelector';
import { useAllRoles } from '@/hooks/useRole';
import { Role, User } from '@/interface';

type State = {
  description: string;
  roles: Role[];
  touched: boolean;
  isNextStepReached: boolean;
  hasError: boolean;
};

export default function AddUserPage(): JSX.Element {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { t: tNotifs } = useTranslation('notifications');
  const { t: tCommon } = useTranslation('common');
  const { create } = useCreateUser({
    projectId: projectId!,
    onSuccess: (user: User) => {
      addSuccess(
        <span
          dangerouslySetInnerHTML={{
            __html: tNotifs('pci_projects_project_users_add_success_message', {
              username: user.username,
              password: user.password,
              escapeInterpolation: true,
            }),
          }}
        />,
      );
    },
    onError: (error) => {
      addError(
        <span
          dangerouslySetInnerHTML={{
            __html: tNotifs('pci_projects_project_users_add_error_save', {
              message: error && error.message,
            }),
          }}
        />,
      );
    },
  });

  const { data: projectRoles, isPending: areProjectRolesLoading } = useAllRoles(
    `${projectId}`,
  );

  const modalActions = {
    close: () => {
      navigate('..');
    },
    next: () => {},
    confirm: async (description: string, roles: Role[]) => {
      create({ description, roles: roles.map((role) => role.name) });
      modalActions.close();
    },
  };

  const [state, setState] = useState<State>({
    description: '',
    roles: [],
    touched: false,
    isNextStepReached: false,
    hasError: false,
  });

  useEffect(() => {
    setState({ ...state, hasError: state.touched && state.description === '' });
  }, [state.description, state.touched]);

  return (
    <OsdsModal
      headline={
        !state.isNextStepReached
          ? tCommon('pci_projects_project_users_add_title')
          : tCommon('pci_projects_project_users_roles')
      }
      onOdsModalClose={modalActions.close}
    >
      <slot name="content">
        {(() => {
          if (!state.isNextStepReached)
            return (
              <OsdsFormField
                color={
                  !state.hasError
                    ? ODS_THEME_COLOR_INTENT.primary
                    : ODS_THEME_COLOR_INTENT.error
                }
                error={
                  state.hasError
                    ? tCommon(
                        'pci_projects_project_users_add_description_error',
                      )
                    : ''
                }
              >
                <OsdsText
                  slot="label"
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="mt-4"
                >
                  {tCommon('pci_projects_project_users_add_description_label')}
                </OsdsText>
                <OsdsInput
                  value={state.description}
                  onOdsInputBlur={() => {
                    setState({ ...state, touched: true });
                  }}
                  onOdsInputFocus={() => {
                    setState({ ...state, touched: true });
                  }}
                  onOdsValueChange={(e) =>
                    setState({
                      ...state,
                      description: `${e.detail.value}`,
                      touched: true,
                    })
                  }
                  type={ODS_INPUT_TYPE.text}
                  color={
                    !state.hasError
                      ? ODS_THEME_COLOR_INTENT.primary
                      : ODS_THEME_COLOR_INTENT.error
                  }
                  error={state.hasError}
                  className="border"
                  style={
                    state.hasError
                      ? {
                          borderColor: 'var(--ods-color-error-200)',
                        }
                      : {}
                  }
                />
              </OsdsFormField>
            );

          if (!areProjectRolesLoading)
            return (
              <RolesSelector
                allRoles={projectRoles?.roles || []}
                preSelectedRoles={[]}
                onInput={(newRoles) => setState({ ...state, roles: newRoles })}
              />
            );
          return <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />;
        })()}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        onClick={modalActions.close}
      >
        {tCommon('pci_projects_project_users_add_cancel_label')}
      </OsdsButton>
      {!state.isNextStepReached ? (
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => setState({ ...state, isNextStepReached: true })}
          {...(state.description === '' && { disabled: true })}
        >
          {tCommon('pci_projects_project_users_add_submit_label')}
        </OsdsButton>
      ) : (
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            modalActions.confirm(state.description, state.roles);
          }}
        >
          {tCommon('pci_projects_project_users_roles_edit')}
        </OsdsButton>
      )}
    </OsdsModal>
  );
}
