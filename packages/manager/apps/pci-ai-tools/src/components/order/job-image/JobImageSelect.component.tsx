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
}

const JobImagesSelect = React.forwardRef<HTMLInputElement, ImageSelectProps>(
  ({ images, value, onChange }, ref) => {
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
        <TabsContent value="ovhImage" className="mt-0">
          <PresetImageSelect
            images={images}
            value={value}
            onChange={onChange}
            ref={ref}
          />
        </TabsContent>
        <TabsContent value="customerImage" className="mt-0">
          <DockerCustomImageInput
            value={value}
            onChange={onChange}
            ref={ref}
            jobImages={images}
          />
        </TabsContent>
      </Tabs>
    );
  },
);

export default JobImagesSelect;
