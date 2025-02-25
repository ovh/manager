import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PrivacyEnum } from '@/types/orderFunnel';

interface PrivacyRadioProps {
  value: string;
  onChange: (privacy: string) => void;
  className?: string;
}

const PrivacyRadioInput = React.forwardRef<HTMLInputElement, PrivacyRadioProps>(
  ({ value, onChange, className }, ref) => {
    const { t } = useTranslation('components/privacy');

    return (
      <>
        <Label className={className}>
          {t('fieldConfigurationPrivacyLabel')}
        </Label>
        <div className="flex items-center space-x-2">
          <RadioGroup
            ref={ref}
            className="mb-2"
            name="access-type"
            value={value}
            onValueChange={onChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
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
              <RadioGroupItem value={PrivacyEnum.public} id="public-access" />
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
