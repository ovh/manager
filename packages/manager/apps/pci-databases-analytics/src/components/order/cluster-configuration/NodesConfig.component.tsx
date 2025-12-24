import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Label,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { HelpCircle } from 'lucide-react';

interface NodesConfigProps {
  value: number;
  onChange: (newValue: number) => void;
  minimum: number;
  maximum: number;
}
const NodesConfig = React.forwardRef<HTMLInputElement, NodesConfigProps>(
  ({ value, onChange, minimum, maximum }, ref) => {
    const { t } = useTranslation('pci-databases-analytics/components/cluster');
    return (
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Label
            data-testid="nodes-configuration-label"
            htmlFor="node-number-select"
          >
            {t('inputNodeLabel')}
          </Label>
          {minimum === maximum && (
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                <p>{t('inputNodeTooltip')}</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <Input
          data-testid="nodes-configuration-input"
          ref={ref}
          name="node-number-select"
          type="number"
          min={minimum}
          max={maximum}
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          disabled={minimum === maximum}
        />
      </div>
    );
  },
);

NodesConfig.displayName = 'NodesConfig';

export default NodesConfig;
