import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Divider,
  Text,
} from '@ovhcloud/ods-react';
import { useFlexInstance } from '../hooks/useFlexInstance';
import { FlexFlavorHelper } from './advancedParameters/FlexFlavorHelper.component';

export const FlexInstance: FC = () => {
  const { t } = useTranslation('creation');
  const { showFlexBlock, isFlex, onFlexChange } = useFlexInstance();

  if (!showFlexBlock) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-4">
        <Text preset="heading-4">
          {t('pci_instance_creation_instance_flex_title')}
        </Text>
        <FlexFlavorHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        {t('pci_instance_creation_instance_flex_description')}
      </Text>
      <Checkbox
        className="mt-6"
        checked={Boolean(isFlex)}
        onCheckedChange={onFlexChange}
      >
        <CheckboxControl />
        <CheckboxLabel className="text-[var(--ods-color-text)]">
          {t('pci_instance_creation_instance_flex_title')}
        </CheckboxLabel>
      </Checkbox>
      <Divider spacing="48" className="mt-6" />
    </div>
  );
};
