import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import {
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
} from '@datatr-ux/uxlib';
import { PrivacyEnum } from '@/types/orderFunnel';

interface PrivacyRadioProps {
  value: string;
  onChange: (privacy: string) => void;
  className?: string;
}

const PrivacyRadioInput = React.forwardRef<HTMLInputElement, PrivacyRadioProps>(
  ({ value, onChange }, ref) => {
    const { t } = useTranslation('ai-tools/components/privacy');

    return (
      <>
        <div
          data-testid="privacy-radio-container"
          className="flex items-center space-x-2"
        >
          <RadioGroup
            ref={ref}
            className="mb-2"
            name="access-type"
            value={value}
            onValueChange={onChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                data-testid="private-radio"
                value={PrivacyEnum.private}
                id="private-access-radio"
              />
              <Label>{t('privateAccess')}</Label>
              <Popover>
                <PopoverTrigger>
                  <HelpCircle className="size-4" />
                </PopoverTrigger>
                <PopoverContent className="text-sm">
                  <p>{t('privateAccessDescription')}</p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                data-testid="public-radio"
                value={PrivacyEnum.public}
                id="public-access"
              />
              <Label>{t('publicAccess')}</Label>
              <Popover>
                <PopoverTrigger>
                  <HelpCircle className="size-4" />
                </PopoverTrigger>
                <PopoverContent className="text-sm">
                  <p>{t('publicAccessDescription1')}</p>
                  <p className="text-red-600">
                    {t('publicAccessDescription2')}
                  </p>
                </PopoverContent>
              </Popover>
            </div>
          </RadioGroup>
        </div>
      </>
    );
  },
);
export default PrivacyRadioInput;
