import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  RadioGroup,
  RadioTile,
  Separator,
} from '@datatr-ux/uxlib';
import {
  ArrowUpRightFromSquare,
  ArrowUpRightFromSquareIcon,
  Wrench,
} from 'lucide-react';
import A from '@/components/links/A.component';
import ai from '@/types/AI';

interface PresetImageSelectProps {
  images: ai.job.PresetImage[];
  value: string;
  onChange: (newImage: string) => void;
}

const PresetImageSelect = React.forwardRef<
  HTMLInputElement,
  PresetImageSelectProps
>(({ images, value, onChange }, ref) => {
  const { t } = useTranslation('ai-tools/components/preset-image');
  return (
    <Card data-testid="preset-image-select">
      <CardHeader>
        <h5>{t('presetImageTitle')}</h5>
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
        <RadioGroup
          data-testid="images-select-container"
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
          value={value}
          onValueChange={onChange}
        >
          {images.map((image) => (
            <RadioTile
              data-testid={`image-radio-tile-${image.id}`}
              key={image.id}
              onChange={() => {
                onChange(image.id);
              }}
              value={image.id}
              checked={image.id === value}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h5>{image.name}</h5>
                  {image.logo ? (
                    <img
                      className="block w-[50px] h-[30px]"
                      src={image.logo}
                      alt={image.name}
                    />
                  ) : (
                    <Wrench className="size-6 shrink-0" />
                  )}
                </div>
                <p className="text-sm">{image.description}</p>
              </div>
              <Separator className="my-2" />
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
        </RadioGroup>
      </CardContent>
    </Card>
  );
});

export default PresetImageSelect;
