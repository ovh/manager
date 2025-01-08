import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createUser,
  generateS3Credentials,
  getUser,
  TUser,
} from '@/api/data/user';
import LabelComponent from '@/components/Label.component';
import { poll } from '@/utils';
import UserInformationTile from './UserInformationTile.component';
import { usePostS3Secret } from '@/api/hooks/useUser';

type LinkUserCreationProps = {
  onCreateUser: (user: TUser) => void;
  onCancel: () => void;
};
export default function LinkUserCreation({
  onCreateUser,
  onCancel,
}: Readonly<LinkUserCreationProps>) {
  const { projectId } = useParams();
  const { t: tAssociateUser } = useTranslation(
    'containers/associate-user-to-container',
  );
  const { t: tCommon } = useTranslation('pci-common');
  const [formState, setFormState] = useState({
    isTouched: false,
    description: '',
    hasError: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<TUser>(null);
  const [secretUser, setSecretUser] = useState('');

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      hasError: !formState.description && formState.isTouched,
    }));
  }, [formState.description, formState.isTouched]);

  const { postS3Secret: showSecretKey } = usePostS3Secret({
    projectId,
    userId: `${newUser?.id}`,
    userAccess: newUser?.s3Credentials?.access,
    onSuccess: ({ secret }) => {
      setSecretUser(secret);
    },
    onError: () => {},
  });

  useEffect(() => {
    if (newUser?.s3Credentials) {
      showSecretKey();
    }
  }, [newUser?.s3Credentials]);

  const onConfirm = async () => {
    setIsLoading(true);
    const data = await createUser(projectId, formState.description);

    poll<TUser>({
      fn: () => getUser(projectId, `${data.id}`),
      ruleFn: (user: TUser) => user.status === 'ok',
      onSuccess: async ({ value }) => {
        const credentials = await generateS3Credentials(
          projectId,
          `${value.id}`,
        );
        setNewUser({
          ...value,
          access: credentials.access,
          s3Credentials: credentials,
        });
        setIsLoading(false);

        onCreateUser(value);
      },
    });
  };

  const isDisabled =
    !formState.description || isLoading || !!newUser || undefined;
  return (
    <>
      {newUser && secretUser ? (
        <div className="mt-4">
          <UserInformationTile user={newUser} secretUser={secretUser} />
        </div>
      ) : (
        <OsdsFormField
          className="mt-6"
          error={
            formState.hasError ? tCommon('common_field_error_required') : ''
          }
        >
          <LabelComponent
            hasError={formState.hasError}
            text={tAssociateUser(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_label',
            )}
          />
          <div className="flex items-center">
            <OdsInput
              color="primary"
              name="description"
              hasError={formState.hasError}
              value={formState.description}
              inline
              className="min-w-[20%]"
              type={ODS_INPUT_TYPE.text}
              onOdsValueChange={(event) => {
                setFormState((prevState) => ({
                  ...prevState,
                  description: event.detail.value,
                }));
              }}
              onOdsInputBlur={() => {
                setFormState((prevState) => ({
                  ...prevState,
                  isTouched: true,
                }));
              }}
            />
            {isLoading && (
              <OsdsSpinner
                inline
                size={ODS_SPINNER_SIZE.sm}
                className="ml-6 align-center"
              />
            )}
          </div>
        </OsdsFormField>
      )}

      <div className="flex mt-8">
        <OsdsButton
          onClick={onCancel}
          variant="ghost"
          size="sm"
          label={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_btn_cancel',
          )}
          isDisabled={isLoading || undefined}
          color="primary"
        ></OdsButton>
        <OdsButton
          color="primary"
          size="sm"
          label={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_btn_linked',
          )}
          isDisabled={isDisabled}
          onClick={onConfirm}
          class="ml-4"
        ></OdsButton>
      </div>
    </>
  );
}
