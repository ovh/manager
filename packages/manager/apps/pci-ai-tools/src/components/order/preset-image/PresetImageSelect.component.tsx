import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@datatr-ux/uxlib';
import {
  ArrowUpRightFromSquare,
  ArrowUpRightFromSquareIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import A from '@/components/links/A.component';
import ai from '@/types/AI';

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
  const { t } = useTranslation('ai-tools/components/preset-image');
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
                  <span
                    className={`text-lg capitalize ${
                      image.id === value ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {image.name}
                  </span>
                  {image.logo && (
                    <img
                      className="block w-[60px] h-[40px]"
                      src={image.logo}
                      alt={image.name}
                    />
                  )}
                </div>
                <p className="text-sm">{image.description}</p>
              </div>
              <RadioTile.Separator />
              <A
                href={image.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
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
