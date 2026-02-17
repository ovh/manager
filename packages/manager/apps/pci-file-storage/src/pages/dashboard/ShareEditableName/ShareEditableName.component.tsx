import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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

import { nameSchema } from '@/pages/create/schema/CreateShare.schema';

const renameShareSchema = z.object({
  name: nameSchema.nullable(),
});

type TRenameShareFormValues = z.infer<typeof renameShareSchema>;

type TShareEditableNameProps = {
  name: string | null;
  onSubmit: (name: string) => void;
};

// Todo in this pr : add tests

export const ShareEditableName: React.FC<TShareEditableNameProps> = ({ name, onSubmit }) => {
  const { t } = useTranslation(['create']);

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

    onSubmit(data.name);
  };

  if (!name) {
    return <Skeleton className="h-10 w-full max-w-80" />;
  }

  return (
    <FormProvider {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormField invalid={!!errors.name}>
          <Editable
            className="items-center"
            onCancel={handleCancel}
            /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
            onSubmit={handleSubmit(handleFormSubmit)}
            defaultEditing={false}
          >
            <EditableDisplay>
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
                    <EditableCancelTrigger />
                  </>
                ) : (
                  <EditableEditTrigger />
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
