import { As } from '@chakra-ui/react';
import { UiSchema } from '@rjsf/utils';

export type TitleUiSchema = {
  as?: As;
  size?: string;
};

export type FieldUiSchema = {
  size?: string;
};

export const getUiTitleOptions = (uiSchema: UiSchema): TitleUiSchema => {
  const { as, size } = uiSchema['ui:titleOptions'] || {};
  return { as, size } as FieldUiSchema;
};

export const getUiOptions = (uiSchema: UiSchema): FieldUiSchema => {
  const { size } = uiSchema['ui:options'] || {};
  return { size } as FieldUiSchema;
};

export default { getUiTitleOptions, getUiOptions };
