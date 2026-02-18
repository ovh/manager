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
  toast,
} from '@ovhcloud/ods-react';

import { shareDetailsQueryKey } from '@/adapters/shares/queryKeys';
import { useUpdateShare } from '@/data/hooks/shares/useUpdateShare';
import { nameSchema } from '@/pages/create/schema/CreateShare.schema';

const SUCCESS_TOASTER_DURATION = 5000;
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

// Todo in this pr : add  tests

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
    toast(t('dashboard:rename.success'), {
      color: 'success',
      duration: SUCCESS_TOASTER_DURATION,
    });

    setTimeout(() => {
      void queryClient.invalidateQueries({
        queryKey: shareDetailsQueryKey(projectId, region, shareId),
      });
    }, SUCCESS_REFETCH_DELAY);
  }, [projectId, queryClient, region, shareId, t]);

  const onUpdateError = useCallback(() => {
    toast(t('dashboard:rename.error'), {
      color: 'warning',
      duration: Infinity,
    });
  }, [t]);

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
  };

  const handleFormSubmit = (data: TRenameShareFormValues) => {
    if (!data.name) return;
    setEditing(false);
    updateShare({ name: data.name }, { onSuccess: onUpdateSuccess, onError: onUpdateError });
  };

  if (!name) {
    return <Skeleton className="h-10 w-full max-w-80" />;
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
            <EditableActions>
              {({ editing }) =>
                editing ? (
                  <>
                    <EditableSubmitTrigger disabled={!!errors.name} />
                    <EditableCancelTrigger onClick={() => setEditing(false)} />
                  </>
                ) : (
                  <EditableEditTrigger onClick={() => setEditing(true)} />
                )
              }
            </EditableActions>
          </Editable>
          {errors.name && (
            <FormFieldError>{t(`create:name.error.${errors.name.type}`)}</FormFieldError>
          )}
        </FormField>
      </form>
    </FormProvider>
  );
};
