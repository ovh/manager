import React from 'react';
import { Button, Input } from '@datatr-ux/uxlib';
import { RefreshCcw } from 'lucide-react';
import { generateName } from '@/lib/nameGenerator';
import { Trans } from 'react-i18next';

interface NameInputProps {
  value?: string;
  onChange: (newValue: string) => void;
}

const NameInput = React.forwardRef<HTMLInputElement, NameInputProps>(
  ({ onChange, value, ...rest }, ref) => {
    return (
      <div>
        <div className="flex w-full items-end ring-offset-background focus-within:ring-2 focus-within:outline-none focus-within:ring-[#000e9c] focus-within:ring-offset-2 rounded-md">
          <Input
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="rounded-r-none focus-visible:ring-0"
            {...rest}
          />
          <Button
            type="button"
            onClick={() => onChange?.(generateName())}
            tabIndex={-1}
            className="rounded-l-none text-sm focus-visible:ring-0"
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>
        <div className="text-xs mt-2 italic">
          <Trans
            i18nKey={`nameInputInfo`}
            ns={'pci-object-storage/order-funnel'}
          />
        </div>
      </div>
    );
  },
);

NameInput.displayName = 'NameInput';

export default NameInput;
