import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormMessage,
  DialogFooter,
  DialogClose,
  Button,
} from '@datatr-ux/uxlib';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { FileInput } from '@/components/file-input/FileInput.component';

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-2 px-6"
      >
        <FormField
          control={form.control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('prefixFieldLabel')}</FormLabel>
              <Input placeholder="Enter a prefix" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FileInput {...field} multiple />
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="outline">
              {t('fileUploaderButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="submit">{t('fileUploaderButtonConfirm')}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddSwiftObjectForm;
