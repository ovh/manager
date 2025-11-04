import { Combobox as OdsCombobox } from '@ovhcloud/ods-react';

import { ComboboxProps } from '@/components/combobox/Combobox.props';

export const Combobox = ({ children, ...others }: ComboboxProps) => (
  <OdsCombobox {...others}>{children}</OdsCombobox>
);
