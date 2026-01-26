import { SelectOptionItem } from '@ovhcloud/ods-react';

import { SelectItemExtraData } from '@/types/timeControls/RefreshTimeControl.type';

export const defaultRefreshTimeOptions: SelectOptionItem<SelectItemExtraData>[] = [
  {
    label: 'off',
    value: '0',
    customRendererData: {
      selectLabel: '',
      refreshTimeInSeconds: 0,
    },
  },
  {
    label: '15s',
    value: '15',
    customRendererData: {
      refreshTimeInSeconds: 15,
    },
  },
  {
    label: '1m',
    value: '60',
    customRendererData: {
      refreshTimeInSeconds: 60,
    },
  },
  {
    label: '5m',
    value: '300',
    customRendererData: {
      refreshTimeInSeconds: 300,
    },
  },
  {
    label: '15m',
    value: '900',
    customRendererData: {
      refreshTimeInSeconds: 900,
    },
  },
  {
    label: '30m',
    value: '1800',
    customRendererData: {
      refreshTimeInSeconds: 1800,
    },
  },
  {
    label: '1h',
    value: '3600',
    customRendererData: {
      refreshTimeInSeconds: 3600,
    },
  },
];

export const defaultRefreshTimeOption: number = defaultRefreshTimeOptions.at(0)?.customRendererData
  ?.refreshTimeInSeconds as number;
