/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Editable,
  EditableActions,
  EditableCancelTrigger,
  EditableDisplay,
  EditableEditTrigger,
  EditableInput,
  EditableSubmitTrigger,
  FormField,
  FormFieldError,
  Input,
  Skeleton,
  Text,
} from '@ovhcloud/ods-react';

import { shareDetailsQueryKey } from '@/adapters/shares/queryKeys';
import { useUpdateShare } from '@/data/hooks/shares/useUpdateShare';
import { nameSchema } from '@/pages/create/schema/CreateShare.schema';
import { ToastDuration, successToast, warningToast } from '@/utils/toast.utils';

const SUCCESS_REFETCH_DELAY = 5000;

const renameShareSchema = z.object({
  name: nameSchema.nullable(),
});

type TRenameShareFormValues = z.infer<typeof renameShareSchema>;

type TShareEditableNameProps = {
  name: string | null;
  projectId: string;
  shareId: string;
  region: string;
};

export const ShareEditableName: React.FC<TShareEditableNameProps> = ({
  name,
  projectId,
  shareId,
  region,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const { t } = useTranslation(['create', 'dashboard']);
  const queryClient = useQueryClient();

  const onUpdateSuccess = useCallback(() => {
    successToast({
      ns: 'dashboard',
      i18nKey: 'rename.success',
      duration: ToastDuration.Short,
    });

    setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: shareDetailsQueryKey(projectId, region, shareId),
      });
    }, SUCCESS_REFETCH_DELAY);
  }, [projectId, queryClient, region, shareId]);

  const onUpdateError = useCallback(() => {
    warningToast({
      ns: 'dashboard',
      i18nKey: 'rename.error',
      duration: ToastDuration.Infinite,
    });
  }, []);

  const { mutate: updateShare } = useUpdateShare({
    projectId,
    shareId,
    region,
  });

  const form = useForm<TRenameShareFormValues>({
    resolver: zodResolver(renameShareSchema),
    defaultValues: {
      name: name,
    },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form;

  const nameValue = useWatch({ control, name: 'name' });

  useEffect(() => {
    if (name && nameValue === null) {
      reset({ name });
    }
  }, [name, nameValue, reset]);

  const handleCancel = () => {
    reset({ name });
    setEditing(false);
  };

  const handleFormSubmit = (data: TRenameShareFormValues) => {
    if (!data.name) return;
    setEditing(false);
    updateShare({ name: data.name }, { onSuccess: onUpdateSuccess, onError: onUpdateError });
  };

  if (!name) {
    return <Skeleton className="h-10 w-80" />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormField invalid={!!errors.name}>
          <Editable
            className="items-center"
            onCancel={handleCancel}
            onSubmit={handleSubmit(handleFormSubmit)}
            editing={editing}
          >
            <EditableDisplay onDoubleClick={() => setEditing(true)}>
              <Text preset="heading-2">{name}</Text>
            </EditableDisplay>
            <EditableInput>
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <Input autoFocus {...register('name')} className="w-96 max-w-full" />
            </EditableInput>
            <EditableActions className="flex">
              {({ editing }) =>
                editing ? (
                  <>
                    <EditableSubmitTrigger disabled={!!errors.name} />
                    <EditableCancelTrigger onClick={handleCancel} />
                  </>
                ) : (
                  <EditableEditTrigger onClick={() => setEditing(true)} />
                )
              }
            </EditableActions>
          </Editable>
          {errors.name && (
            <Text preset="span">
              <FormFieldError>{t(`create:name.error.${errors.name.type}`)}</FormFieldError>
            </Text>
          )}
        </FormField>
      </form>
    </FormProvider>
  );
};
