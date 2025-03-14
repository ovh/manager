import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  createUser,
  generateS3Credentials,
  getUser,
  TUser,
} from '@/api/data/users';
import { invalidateGetUsersCache, usePostS3Secret } from '@/api/hooks/useUsers';
import LabelComponent from '@/components/Label.component';
import UserInformationTile from '@/components/UserInformationTile.component';
import { poll } from '@/helpers';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';

type LinkUserCreationProps = {
  onCreateUser: (user: TUser) => void;
  onCancel: () => void;
};

export default function LinkUserCreation({
  onCreateUser,
  onCancel,
}: Readonly<LinkUserCreationProps>) {
  const { t } = useTranslation(['cold-archive/new/link-user', 'pci-common']);

  const { projectId } = useParams();

  const [formState, setFormState] = useState({
    isTouched: false,
    description: '',
    hasError: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<TUser>(null);
  const [secretUser, setSecretUser] = useState('');
  const [hideCredentials, setHideCredentials] = useState(false);

  const {
    trackCancelAction,
    trackConfirmAction: trackConfirmActionNewUser,
    trackSuccessPage: trackSuccessPageNewUser,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.NEW_USER}`,
  );

  const {
    trackSuccessPage: trackSuccessPageAssociate,
    trackConfirmAction: trackConfirmActionAssociate,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}`,
  );

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
  });

  useEffect(() => {
    if (newUser?.s3Credentials) {
      showSecretKey();
    }
  }, [newUser?.s3Credentials]);

  const onConfirm = async () => {
    trackConfirmActionNewUser();
    trackConfirmActionAssociate();

    setIsLoading(true);
    const data = await createUser(projectId, formState.description);

    poll<TUser>({
      fn: () => getUser(projectId, data.id),
      ruleFn: (user: TUser) => user.status === 'ok',
      onSuccess: async ({ value }) => {
        const credentials = await generateS3Credentials(projectId, value.id);
        const userWithCredentials = {
          ...value,
          access: credentials.access,
          s3Credentials: credentials,
        };
        setNewUser(userWithCredentials);

        trackSuccessPageAssociate();
        trackSuccessPageNewUser();

        onCreateUser(userWithCredentials);
        invalidateGetUsersCache(projectId);
        setIsLoading(false);
      },
    });
  };

  const isDisabled = !formState.description || isLoading || !!newUser;

  return (
    <div className="flex flex-col gap-4">
      {newUser && secretUser && !hideCredentials ? (
        <OdsMessage
          color="success"
          isDismissible
          onOdsRemove={() => setHideCredentials(true)}
        >
          <UserInformationTile
            title={
              <OdsText preset="paragraph">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'users/credentials:pci_projects_project_storages_containers_add_linked_user_success_message',
                      {
                        username: `<strong>${newUser?.username}</strong>`,
                        // This hack is used beacause the italian translation use userName instead of username
                        userName: `<strong>${newUser?.username}</strong>`,
                      },
                    ),
                  }}
                />
              </OdsText>
            }
            username={newUser?.username}
            description={newUser?.description}
            accessKey={newUser?.s3Credentials?.access}
            secret={secretUser}
            trackingPrefix={
              COLD_ARCHIVE_TRACKING.CONTAINERS.USER.CLIPBOARD_PREFIX
            }
          />
        </OdsMessage>
      ) : (
        <OdsFormField
          error={
            formState.hasError
              ? t('pci-common:common_field_error_required')
              : ''
          }
        >
          <LabelComponent
            text={t(
              'pci_projects_project_storages_cold_archive_add_step_link_user_archive_user_description_label',
            )}
          />
          <div className="flex gap-4 items-center">
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
            {isLoading && <OdsSpinner size="sm" />}
          </div>
        </OdsFormField>
      )}

      <div className="flex gap-4">
        <OdsButton
          onClick={() => {
            trackCancelAction();
            onCancel();
          }}
          variant="ghost"
          size="sm"
          label={t(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_create_field_user_cta_cancel',
          )}
          isDisabled={isLoading}
        />
        <OdsButton
          size="sm"
          label={t(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_create_field_user_cta_create',
          )}
          isDisabled={isDisabled}
          onClick={onConfirm}
        />
      </div>
    </div>
  );
}
