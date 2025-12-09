import {
  Input,
  DialogFooter,
  DialogClose,
  Button,
  FieldLabel,
} from '@datatr-ux/uxlib';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { FileInput } from '@/components/file-input/FileInput.component';
import storages from '@/types/Storages';
import StorageClassSelector from '@/components/storage-class-selector/StorageClassSelector.component';
import { FormField } from '@/components/form-field/FormField.component';
import { useAvailableStorageClasses } from '@/hooks/useAvailableStorageClasses.hook';
import { useS3Data } from '../../S3.context';

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
  const availableStorageClasses = useAvailableStorageClasses(s3.region);
  const schema = z.object({
    prefix: z.string().optional(),
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
            <Input placeholder={t('prefixFieldPlaceholder')} {...field} />
          </>
        )}
      </FormField>

      <FormField form={form} name="storageClass">
        {(field) => (
          <StorageClassSelector
            storageClass={field.value}
            onStorageClassChange={field.onChange}
            availableStorageClasses={availableStorageClasses}
          />
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
