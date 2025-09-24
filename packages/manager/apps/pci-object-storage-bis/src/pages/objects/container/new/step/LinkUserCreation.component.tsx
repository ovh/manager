import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  createUser,
  generateS3Credentials,
  getUser,
  TUser,
} from '@/api/data/user';
import LabelComponent from '@/components/Label.component';
import { poll } from '@/utils';
import UserInformationTile from './UserInformationTile.component';
import { getQueryKeyUsers, usePostS3Secret } from '@/api/hooks/useUser';
import queryClient from '@/queryClient';

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
  const [hideCredentials, setHideCredentials] = useState(false);

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      hasError: !formState.description && formState.isTouched,
    }));
  }, [formState.description, formState.isTouched]);

  const { postS3Secret: showSecretKey } = usePostS3Secret({
    projectId,
    userId: newUser?.id,
    userAccess: newUser?.s3Credentials?.access,
    onSuccess: ({ secret }) => {
      setSecretUser(secret);
      setHideCredentials(false);
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
      fn: () => getUser(projectId, data.id),
      ruleFn: (user: TUser) => user.status === 'ok',
      onSuccess: ({ value }) => {
        generateS3Credentials(projectId, value.id)
          .then((credentials) => {
            setNewUser({
              ...value,
              access: credentials.access,
              s3Credentials: credentials,
            });
          })
          .finally(() => {
            queryClient.invalidateQueries({
              queryKey: [...getQueryKeyUsers(projectId)],
            });
            onCreateUser(value);
            setIsLoading(false);
          });
      },
    });
  };

  const isDisabled =
    !formState.description || isLoading || !!newUser || undefined;

  return (
    <>
      {newUser && secretUser && !hideCredentials ? (
        <div className="mt-4">
          <UserInformationTile
            user={newUser}
            secretUser={secretUser}
            onClose={() => setHideCredentials(true)}
          />
        </div>
      ) : (
        <OdsFormField
          className="my-6 block "
          error={
            formState.hasError ? tCommon('common_field_error_required') : ''
          }
        >
          <LabelComponent
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
              className="min-w-[35rem]"
              onOdsChange={(event) => {
                setFormState((prevState) => ({
                  ...prevState,
                  description: event.detail.value.toString(),
                }));
              }}
              onOdsBlur={() => {
                setFormState((prevState) => ({
                  ...prevState,
                  isTouched: true,
                }));
              }}
            />
            {isLoading && (
              <OdsSpinner size="sm" className="ml-6 align-center" />
            )}
          </div>
        </OdsFormField>
      )}

      <div className="flex mt-8 gap-4">
        <OdsButton
          onClick={onCancel}
          variant="ghost"
          size="sm"
          label={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_btn_cancel',
          )}
          isDisabled={isLoading || undefined}
        />
        <OdsButton
          size="sm"
          label={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_btn_linked',
          )}
          isDisabled={isDisabled}
          onClick={onConfirm}
        />
      </div>
    </>
  );
}
