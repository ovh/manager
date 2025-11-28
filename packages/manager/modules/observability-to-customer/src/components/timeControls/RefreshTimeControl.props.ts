import { SelectItem } from '@ovhcloud/ods-react';

import { SelectItemExtraData } from './RefreshTimeControl.type';

export interface RefreshTimeControlProps {
  refreshTimeOptions?: SelectItem<SelectItemExtraData>[];
  defaultRefreshInterval: number;
  isLoading: boolean;
  onStateChange: <TValue>(key: string, value: TValue) => void;
}
