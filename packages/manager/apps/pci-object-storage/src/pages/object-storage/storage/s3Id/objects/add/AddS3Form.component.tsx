import {
  Button,
  DialogClose,
  DialogFooter,
  FieldDescription,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@datatr-ux/uxlib';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { FileInput } from '@/components/file-input/FileInput.component';
import { FormField } from '@/components/form-field/FormField.component';
import StorageClassSelector from '@/components/storage-class-selector/StorageClassSelector.component';
import { useAvailableStorageClasses } from '@/hooks/useAvailableStorageClasses.hook';
import storages from '@/types/Storages';
import { useS3Data } from '../../S3.context';
import { StorageClassWarningMessage } from '../_components/StorageClassWarningMessage';

interface AddS3FormProps {
  onSubmit: SubmitHandler<{
    prefix?: string;
    storageClass?: storages.StorageClassEnum;
    files?: File[];
  }>;
  onError: SubmitErrorHandler<{
    prefix?: string;
    storageClass?: storages.StorageClassEnum;
    files?: File[];
  }>;
  initialValue?: {
    prefix?: string;
    storageClass?: storages.StorageClassEnum;
    files?: File[];
  };
}
const AddS3Form = ({ onSubmit, onError, initialValue }: AddS3FormProps) => {
  const { t } = useTranslation('components/file-uploader');
  const { s3 } = useS3Data();
  const {
    availableStorageClasses,
    isPending: isAvailableStorageClassesPending,
  } = useAvailableStorageClasses(s3.region);
  const schema = z.object({
    prefix: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          // Prevent trailing slashes
          if (val.endsWith('/')) return false;
          // Prevent multiple consecutive slashes
          if (val.includes('//')) return false;
          return true;
        },
        {
          message: t('prefixValidationError'),
        },
      ),
    storageClass: z.nativeEnum(storages.StorageClassEnum),
    files: z
      .array(z.instanceof(File))
      .min(1, { message: t('errorFileRequired') }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialValue ?? {
      prefix: '',
      storageClass: storages.StorageClassEnum.STANDARD,
      files: [],
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-2 px-6"
    >
      <FormField form={form} name="prefix">
        {(field) => (
          <>
            <FieldLabel>{t('prefixFieldLabel')}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                placeholder={t('prefixFieldPlaceholder')}
                {...field}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>/</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>{t('prefixHelperText')}</FieldDescription>
          </>
        )}
      </FormField>

      <FormField form={form} name="storageClass">
        {(field) => (
          <>
            <StorageClassSelector
              storageClass={field.value}
              onStorageClassChange={field.onChange}
              availableStorageClasses={availableStorageClasses}
              isLoading={isAvailableStorageClassesPending}
            />
            <StorageClassWarningMessage storageClass={field.value} />
          </>
        )}
      </FormField>
      <FormField form={form} name="files">
        {(field) => <FileInput {...field} multiple />}
      </FormField>

      <DialogFooter className="flex justify-end px-0">
        <DialogClose asChild>
          <Button type="button" mode="ghost">
            {t('fileUploaderButtonCancel')}
          </Button>
        </DialogClose>
        <Button type="submit">{t('fileUploaderButtonConfirm')}</Button>
      </DialogFooter>
    </form>
  );
};

export default AddS3Form;
