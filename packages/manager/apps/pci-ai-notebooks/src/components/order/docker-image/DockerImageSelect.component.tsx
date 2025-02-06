import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowUpRightFromSquare,
  ArrowUpRightFromSquareIcon,
  PlusCircle,
} from 'lucide-react';
import * as ai from '@/types/cloud/project/ai';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageSelectProps {
  images: ai.job.PresetImage[];
  value: string;
  onChange: (newImage: string) => void;
  className?: string;
}

const ImagesSelect = React.forwardRef<HTMLInputElement, ImageSelectProps>(
  ({ images, value, onChange, className }, ref) => {
    const { t } = useTranslation('components/images');
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
    });

    const onSubmit = imageForm.handleSubmit((formValues) => {
      onChange(formValues.imageName);
    });

    return (
      <Tabs defaultValue="ovhImage">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ovhImage" data-testid="ovh-image-trigger">
            {t('presetImageTabsLabel')}
          </TabsTrigger>
          <TabsTrigger value="customerImage" data-testid="custom-image-trigger">
            {t('customImageTabsLabel')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ovhImage">
          <Card>
            <CardHeader>
              <CardTitle>{t('presetImageTitle')}</CardTitle>
              <div className="pt-4 text-sm">
                <p>{t('presetImageDesc')}</p>
                <p>
                  {t('missingImageDesc')}
                  <A
                    className="ml-2"
                    href={'https://discord.com/invite/vXVurFfwe9'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('discordLinkLabel')}
                    <ArrowUpRightFromSquareIcon className="size-4 inline ml-1 mb-1" />
                  </A>
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div
                data-testid="images-select-container"
                ref={ref}
                className={cn(
                  'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2',
                  className,
                )}
              >
                {images.map((image) => (
                  <RadioTile
                    data-testid={`image-radio-tile-${image.id}`}
                    name="image-select"
                    key={image.id}
                    onChange={() => {
                      onChange(image.id);
                      imageForm.reset();
                    }}
                    value={image.id}
                    checked={image.id === value}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <h5
                          className={`capitalize ${
                            image.id === value ? 'font-bold' : 'font-normal'
                          }`}
                        >
                          {image.name}
                        </h5>
                        {image.logo && (
                          <img
                            className="block w-[60px] h-[40px]"
                            src={image.logo}
                            alt={image.name}
                          />
                        )}
                      </div>
                      <p>{image.description}</p>
                    </div>
                    <RadioTile.Separator />
                    <A
                      href={image.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('imageDocLink')}
                      <ArrowUpRightFromSquare className="size-4 inline ml-1" />
                    </A>
                  </RadioTile>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customerImage">
          <Card>
            <CardHeader>
              <CardTitle>{t('customImageTitle')}</CardTitle>
              <div className="pt-4 text-sm">
                <p>{t('privateImageDesc')}</p>
                <p>
                  {t('privateImageDesc1')}{' '}
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
                <div
                  className="flex w-full items-start gap-2"
                  data-testid="ssh-key-container"
                >
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
                              data-testid="personnal-image-input"
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
                    data-testid="image-add-button"
                    variant={'ghost'}
                    onClick={imageForm.handleSubmit(onSubmit)}
                    className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
                  >
                    <PlusCircle />
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  },
);
ImagesSelect.displayName = 'ImagesSelect';
export default ImagesSelect;
