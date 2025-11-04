import { FC } from 'react';
import { FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import { Clipboard } from '@/components/clipboard/Clipboard.component';
import { TAction } from '@/types/instance/action/action.type';

const IpAddress: FC<{
  label: string;
  value: string;
  actions?: TAction[];
}> = ({ label, value, actions }) => (
  <div className="my-4 flex items-end w-full">
    <FormField className="flex-grow">
      <FormFieldLabel>{label}</FormFieldLabel>
      <Clipboard value={value} />
    </FormField>
    <div className="w-[40px] flex-shrink-0">
      {actions && (
        <ActionsMenu
          actionButton={{ variant: 'ghost' }}
          items={new Map([[`${label}_actions`, actions]])}
        />
      )}
    </div>
  </div>
);

export default IpAddress;
