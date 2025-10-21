/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  type ComboboxGroupItem,
  type ComboboxInputValueChangeDetails,
  type ComboboxItem,
  type ComboboxOptionItem,
  type ComboboxValueChangeDetails,
  ComboboxProp as OdsComboboxProps,
} from '@ovhcloud/ods-react';

export type ComboboxProps = PropsWithChildren<OdsComboboxProps> & {};

export type {
  ComboboxGroupItem,
  ComboboxInputValueChangeDetails,
  ComboboxItem,
  ComboboxOptionItem,
  ComboboxValueChangeDetails,
};
