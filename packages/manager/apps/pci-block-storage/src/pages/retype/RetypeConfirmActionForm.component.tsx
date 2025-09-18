import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ICON_NAME,
  Input,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Skeleton,
  Text,
} from '@ovhcloud/ods-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { BaseRetypeForm } from './BaseRetypeForm.component';

type RetypeConfirmActionFormProps = {
  warningMessage: string;
  confirmWord: string;
  errorElement: React.ReactElement;
  onSubmit: () => void;
  onClose: () => void;
  isPending: boolean;
  isError: boolean;
};

export const RetypeConfirmActionForm: FC<RetypeConfirmActionFormProps> = ({
  warningMessage,
  confirmWord,
  errorElement,
  onSubmit,
  onClose,
  isPending,
  isError,
}) => {
  const { t } = useTranslation(['retype', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      confirmation: null,
    },
    mode: 'onChange',
    shouldUseNativeValidation: true,
  });

  const confirmRegexp = new RegExp(`^${confirmWord}$`);

  const displayFieldError =
    formState.touchedFields.confirmation && !formState.isValid;

  return (
    <BaseRetypeForm
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      isValidationDisabled={!formState.isValid || isPending || isError}
      cancelButtonText={t(`${NAMESPACES.ACTIONS}:cancel`)}
      validateButtonText={t(
        `retype:pci_projects_project_storages_blocks_retype_confirm_action_confirm_button`,
      )}
    >
      <div className="flex flex-col gap-8">
        {isPending && (
          <>
            <Skeleton className="h-10" data-testid="skeleton" />
            <Skeleton className="h-10" />
          </>
        )}
        {isError && (
          <Message
            dismissible={false}
            className="max-w-80"
            color={MESSAGE_COLOR.critical}
          >
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>{errorElement}</MessageBody>
          </Message>
        )}
        {!isPending && !isError && (
          <>
            <Message
              color={MESSAGE_COLOR.warning}
              dismissible={false}
              className="max-w-80"
            >
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <MessageBody>{warningMessage}</MessageBody>
            </Message>
            <label className="flex flex-col gap-4">
              <span>
                {t(
                  'retype:pci_projects_project_storages_blocks_retype_confirm_action_label',
                  { confirmWord },
                )}
              </span>
              <Input
                {...register('confirmation', {
                  required: true,
                  pattern: confirmRegexp,
                })}
                className={clsx(
                  displayFieldError && 'bg-red-100 border-red-500 text-red-500',
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
