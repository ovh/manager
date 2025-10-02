import { mockedFlavorCategory } from '@/__mocks__/instance/constants';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const FlavorCategorySelector: FC = () => {
  const { t } = useTranslation('creation');
  const { trackClick } = useOvhTracking();

  const handleSelect = ({ value }: { value: string[] }) => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tab,
      actionType: 'action',
      actions: ['add_instance', 'select_flavor', value[0] ?? ''],
    });
  };

  return (
    <FormField>
      <FormFieldLabel>
        {t('pci_instance_creation_select_flavor_category_label')}
      </FormFieldLabel>
      <Select items={mockedFlavorCategory} onValueChange={handleSelect}>
        <SelectControl />
        <SelectContent />
      </Select>
    </FormField>
  );
};

export default FlavorCategorySelector;
