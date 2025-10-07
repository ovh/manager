import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

export interface UseFileUploaderFormProps {
  allowMultipleFile: boolean;
  jsonFile?: boolean;
}

export const useFileUploarderForm = ({
  allowMultipleFile,
  jsonFile,
}: UseFileUploaderFormProps) => {
  const { t } = useTranslation('components/file-uploader');
  const schema = z
    .object({
      prefix: z.string().optional(),
      files: z
        .array(z.instanceof(File))
        .min(1, { message: t('errorFileRequired') }),
    })
    .refine(
      (data) => {
        if (!allowMultipleFile && data.files.length > 1) return false;
        return true;
      },
      {
        message: t('errorFileNumber'),
        path: ['files'],
      },
    )
    .refine(
      (data) => {
        if (data.files.length > 1 && !data.prefix) return false;
        return true;
      },
      {
        message: t('prefixRequiredError'),
        path: ['prefix'],
      },
    )
    .refine(
      (data) => {
        if (jsonFile) {
          return data.files.every(
            (file) =>
              file.type === 'application/json' &&
              file.name.toLowerCase().endsWith('.json'),
          );
        }
        return true;
      },
      {
        message: t('errorJsonFile'),
        path: ['files'],
      },
    );

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    prefix: '/',
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
