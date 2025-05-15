import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRightFromSquare, Check, Plus } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@datatr-ux/uxlib';
import A from '@/components/links/A.component';
import ai from '@/types/AI';

interface DockerCustomImageProps {
  value: string;
  onChange: (newImage: string) => void;
  images: ai.job.PresetImage[];
}

const DockerCustomImageInput = React.forwardRef<
  HTMLInputElement,
  DockerCustomImageProps
>(({ value, onChange, images }, ref) => {
  const { t } = useTranslation('ai-tools/components/docker-custom-image');
  const personalImageRules = z
    .string()
    .trim()
    .min(1, {
      message: t('formDatastoreErrorMinLength', {
        min: 1,
      }),
    });

  const imageSchema = z.object({
    imageName: personalImageRules,
  });

  const imageForm = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageName: value,
    },
  });

  const onSubmit = imageForm.handleSubmit((formValues) => {
    onChange(formValues.imageName);
  });

  return (
    <Card data-testid="docker-custom-image">
      <CardHeader>
        <h5>{t('customImageTitle')}</h5>
        <div className="pt-4 text-sm">
          <p>{t('privateImageDesc')}</p>
          <ul className="list-disc my-3">
            <div className="ml-8 font-semibold">
              <li>{t('privateImageDesc1')}</li>
              <li>{t('privateImageDesc2')}</li>
              <li>{t('privateImageDesc3')}</li>
            </div>
          </ul>
          <p>
            {t('privateImageDesc4')}{' '}
            <A
              href={
                'https://docs.ovh.com/gb/en/publiccloud/ai/training/build-use-custom-image/'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('privateImageLink')}
              <ArrowUpRightFromSquare className="size-4 inline ml-1" />
            </A>
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...imageForm}>
          <div className="flex w-full items-start gap-2">
            {!images.find((im) => im.id === value) && (
              <Check className="size-6 shrink-0 text-green-200 mt-10" />
            )}
            <div className="w-full">
              <FormField
                control={imageForm.control}
                name="imageName"
                defaultValue={''}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('priaveImageInputLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="docker-custom-image-input"
                        {...field}
                        ref={ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              data-testid="docker-custom-image-add-button"
              size="menu"
              variant="menu"
              mode="menu"
              className="shrink-0 mt-8 ml-2"
              onClick={onSubmit}
            >
              <Plus className="size-6" />
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
});
export default DockerCustomImageInput;
