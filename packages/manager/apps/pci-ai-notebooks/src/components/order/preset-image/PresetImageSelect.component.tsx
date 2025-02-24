import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRightFromSquare,
  ArrowUpRightFromSquareIcon,
} from 'lucide-react';
import * as ai from '@/types/cloud/project/ai';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import A from '@/components/links/A.component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PresetImageSelectProps {
  images: ai.job.PresetImage[];
  value: string;
  onChange: (newImage: string) => void;
  className?: string;
}

const PresetImageSelect = React.forwardRef<
  HTMLInputElement,
  PresetImageSelectProps
>(({ images, value, onChange, className }, ref) => {
  const { t } = useTranslation('components/preset-image');
  return (
    <Card data-testid="preset-image-select">
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
              <A href={image.link} target="_blank" rel="noopener noreferrer">
                {t('imageDocLink')}
                <ArrowUpRightFromSquare className="size-4 inline ml-1" />
              </A>
            </RadioTile>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export default PresetImageSelect;
