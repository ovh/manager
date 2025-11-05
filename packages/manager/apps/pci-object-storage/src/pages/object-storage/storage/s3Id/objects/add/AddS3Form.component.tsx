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
import { useMemo } from 'react';
import { z } from 'zod';
import { FileInput } from '@/components/file-input/FileInput.component';
import storages from '@/types/Storages';
import { useS3Data } from '../../S3.context';
import StorageClassSelector from '@/components/storage-class-selector/StorageClassSelector.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useIs3AZ } from '@/hooks/useIs3AZ.hook';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import { FormField } from '@/components/form-field/FormField.component';
import { getAvailableStorageClasses } from '@/lib/s3StorageHelper';

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
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const is3AZ = useIs3AZ(s3, regions);
  const isLocalZone = useIsLocaleZone(s3, regions);

  const availableStorageClasses = useMemo(
    () => getAvailableStorageClasses({ is3AZ, isLZ: isLocalZone }),
    [is3AZ, isLocalZone],
  );

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
