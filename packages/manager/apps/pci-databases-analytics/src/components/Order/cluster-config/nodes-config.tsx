import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NodesConfigProps {
  value: number;
  onChange: (newValue: number) => void;
  minimum: number;
  maximum: number;
}
const NodesConfig = React.forwardRef<HTMLInputElement, NodesConfigProps>(
  ({ value, onChange, minimum, maximum }, ref) => {
    const { t } = useTranslation('pci-databases-analytics/components/cluster');
    if (minimum === maximum) {
      return <></>;
    }
    return (
      <div>
        <Label
          data-testid="nodes-configuration-label"
          htmlFor="node-number-select"
        >
          {t('inputNodeLabel')}
        </Label>
        <Input
          data-testid="nodes-configuration-input"
          ref={ref}
          name="node-number-select"
          type="number"
          min={minimum}
          max={maximum}
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
        />
      </div>
    );
  },
);

NodesConfig.displayName = 'NodesConfig';

export default NodesConfig;
