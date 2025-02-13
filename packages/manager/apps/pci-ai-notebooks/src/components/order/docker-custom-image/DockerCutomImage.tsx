import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRightFromSquare, PlusCircle } from 'lucide-react';
import A from '@/components/links/A.component';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageSelectProps {
  value: string;
  onChange: (newImage: string) => void;
}

const DockerCustomImageInput = React.forwardRef<
  HTMLInputElement,
  ImageSelectProps
>(({ value, onChange }, ref) => {
  const { t } = useTranslation('components/docker-custom-image');
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
    <Card>
      <CardHeader>
        <CardTitle>{t('customImageTitle')}</CardTitle>
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
              variant={'ghost'}
              onClick={onSubmit}
              className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
            >
              <PlusCircle />
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
});
export default DockerCustomImageInput;
