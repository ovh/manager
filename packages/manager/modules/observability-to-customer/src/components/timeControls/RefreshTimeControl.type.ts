import type { ComponentProps } from 'react';
import { Select } from '@ovh-ux/muk';

export type SelectItemExtraData = {
  selectLabel?: string;
  refreshTimeInSeconds: number;
};

type CustomData = SelectItemExtraData;

type SelectGroupItem<T extends CustomData = CustomData> = {
    customRendererData?: T;
    disabled?: boolean;
    label: string;
    options: SelectOptionItem<T>[];
};

export type SelectItem<T extends CustomData = CustomData> = SelectGroupItem<T> | SelectOptionItem<T>;

export type SelectOptionItem<T extends CustomData = CustomData> = {
    customRendererData?: T;
    disabled?: boolean;
    label: string;
    value: string;
};

export type SelectOnValueChange = NonNullable<
  ComponentProps<typeof Select>['onValueChange']
>;
