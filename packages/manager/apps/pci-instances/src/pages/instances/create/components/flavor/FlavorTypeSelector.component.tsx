import { mockedFlavorType } from '@/__mocks__/instance/constants';
import {
  Badge,
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';
import { FC } from 'react';

const FlavorTypeSelector: FC = () => {
  return (
    <FormField>
      <FormFieldLabel>Type de XXXXXXXX</FormFieldLabel>
      <Select items={mockedFlavorType}>
        <SelectControl />
        <SelectContent
          customOptionRenderer={({ customData, label }) => (
            <div className="flex justify-between">
              <Text>{label}</Text>
              <Badge color="neutral">coming soon</Badge>
            </div>
          )}
        />
      </Select>
    </FormField>
  );
};

export default FlavorTypeSelector;
