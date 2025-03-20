import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import PresetImageSelect from '../preset-image/PresetImageSelect.component';
import DockerCustomImageInput from '../docker-custom-image/DockerCutomImage';

interface ImageSelectProps {
  images: ai.job.PresetImage[];
  value: string;
  onChange: (newImage: string) => void;
  className?: string;
}

const JobImagesSelect = React.forwardRef<HTMLInputElement, ImageSelectProps>(
  ({ images, value, onChange, className }, ref) => {
    const { t } = useTranslation('ai-tools/components/job-image');

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
          <PresetImageSelect
            images={images}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
          />
        </TabsContent>
        <TabsContent value="customerImage">
          <DockerCustomImageInput value={value} onChange={onChange} ref={ref} />
        </TabsContent>
      </Tabs>
    );
  },
);

export default JobImagesSelect;
