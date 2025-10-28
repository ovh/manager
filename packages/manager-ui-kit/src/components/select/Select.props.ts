/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  SelectProp as OdsSelectProps,
  type SelectCustomGroupRendererArg,
  type SelectCustomItemRendererArg,
  type SelectCustomOptionRendererArg,
  type SelectGroupItem,
  type SelectItem,
  type SelectMultipleMode,
  type SelectOptionItem,
} from '@ovhcloud/ods-react';

export type SelectProps = PropsWithChildren<OdsSelectProps> & {};

export type {
  SelectCustomGroupRendererArg,
  SelectCustomItemRendererArg,
  SelectCustomOptionRendererArg,
  SelectGroupItem,
  SelectItem,
  SelectMultipleMode,
  SelectOptionItem,
};
