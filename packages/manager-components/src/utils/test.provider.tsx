import React, { ComponentType } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../.storybook/i18n';

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: Wrappers as ComponentType, ...options });

export { customRender as render };
