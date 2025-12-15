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
import { FormField } from '@/components/form-field/FormField.component';

interface AddSwiftObjectFormProps {
  onSubmit: SubmitHandler<{
    prefix?: string;
    files?: File[];
  }>;
  onError: SubmitErrorHandler<{
    prefix?: string;
    files?: File[];
  }>;
  initialValue?: {
    prefix?: string;
    files?: File[];
  };
}
const AddSwiftObjectForm = ({
  onSubmit,
  onError,
  initialValue,
}: AddSwiftObjectFormProps) => {
  const { t } = useTranslation('components/file-uploader');
  const schema = z.object({
    prefix: z.string().optional(),
    files: z
      .array(z.instanceof(File))
      .min(1, { message: t('errorFileRequired') }),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialValue ?? {
      prefix: '',
      files: [],
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-2"
    >
      <FormField form={form} name="prefix">
        {(field) => (
          <>
            <FieldLabel>{t('prefixFieldLabel')}</FieldLabel>
            <Input placeholder="Enter a prefix" {...field} />
          </>
        )}
      </FormField>
      <FormField form={form} name="files">
        {(field) => <FileInput {...field} multiple />}
      </FormField>
      <DialogFooter className="flex justify-end px-0">
        <DialogClose asChild>
          <Button
            type="button"
            mode="ghost"
            data-testid="add-object-form-cancel"
          >
            {t('fileUploaderButtonCancel')}
          </Button>
        </DialogClose>
        <Button type="submit" data-testid="add-object-form-submit">
          {t('fileUploaderButtonConfirm')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddSwiftObjectForm;
