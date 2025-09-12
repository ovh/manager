import { Trans, useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ICON_NAME,
  Input,
  Link,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Skeleton,
  Text,
} from '@ovhcloud/ods-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TAttachedInstance } from '@/api/select/instances';
import { BaseRetypeForm } from './BaseRetypeForm.component';
import { useDetachVolume } from '@/api/hooks/useVolume';

const CONFIRM_WORD = 'DETACH';

type RetypeDetachInstanceProps = {
  instance: TAttachedInstance;
  projectId: string;
  volumeId: string;
};

export const RetypeDetachInstance: FC<RetypeDetachInstanceProps> = ({
  instance,
  projectId,
  volumeId,
}) => {
  const { t } = useTranslation(['retype', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const blockListingHref = useHref('..');

  const {
    detachVolume,
    isPending: isDetachPending,
    isError: isDetachingError,
  } = useDetachVolume();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      confirmation: null,
    },
    mode: 'onChange',
    shouldUseNativeValidation: true,
  });

  const displayFieldError =
    formState.touchedFields.confirmation && !formState.isValid;

  const handleOnClose = () => {
    navigate('..');
  };

  const handleOnSubmit = () =>
    detachVolume({
      projectId,
      volumeId,
      instanceId: instance.id,
    });

  return (
    <BaseRetypeForm
      onSubmit={handleSubmit(handleOnSubmit)}
      onClose={handleOnClose}
      isValidationDisabled={
        !formState.isValid || isDetachPending || isDetachingError
      }
      cancelButtonText={t(`${NAMESPACES.ACTIONS}:cancel`)}
      validateButtonText={t(
        `retype:pci_projects_project_storages_blocks_retype_detach_volume_confirm_button`,
      )}
    >
      <div className="flex flex-col gap-8">
        {isDetachPending && (
          <>
            <Skeleton className="h-10" data-testid="skeleton" />
            <Skeleton className="h-10" />
          </>
        )}
        {isDetachingError && (
          <Message
            dismissible={false}
            className="max-w-80"
            color={MESSAGE_COLOR.critical}
          >
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>
              <Trans
                i18nKey="pci_projects_project_storages_blocks_retype_detach_volume_error"
                ns="retype"
                components={[
                  <Link
                    key="0"
                    color={ODS_THEME_COLOR_INTENT.primary}
                    href={blockListingHref}
                    className="inline"
                  />,
                ]}
              />
            </MessageBody>
          </Message>
        )}
        {!isDetachPending && !isDetachingError && (
          <>
            <Message
              color={MESSAGE_COLOR.warning}
              dismissible={false}
              className="max-w-80"
            >
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <MessageBody>
                {t(
                  'retype:pci_projects_project_storages_blocks_retype_detach_volume',
                  {
                    instance: instance.name,
                  },
                )}
              </MessageBody>
            </Message>
            <label className="flex flex-col gap-4">
              <span>
                {t(
                  'retype:pci_projects_project_storages_blocks_retype_detach_volume_label',
                  { confirmWord: CONFIRM_WORD },
                )}
              </span>
              <Input
                {...register('confirmation', {
                  required: true,
                  pattern: /^DETACH$/,
                })}
                className={clsx(
                  displayFieldError &&
                    'bg-red-100 border-red-500 text-red-500 focus:text-red-500',
                )}
              />
              {displayFieldError && (
                <Text className="text-red-500">
                  {t(`${NAMESPACES.FORM}:error_pattern`)}
                </Text>
              )}
            </label>
          </>
        )}
      </div>
    </BaseRetypeForm>
  );
};
