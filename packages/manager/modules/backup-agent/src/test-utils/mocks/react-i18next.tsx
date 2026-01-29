import React from 'react';

import { vi } from 'vitest';

export const useTranslationMock = vi.fn().mockImplementation(() => ({
  t: (key: string) => (key.includes(':') ? `translated_${key.split(':')[1]}` : `translated_${key}`),
  i18n: {
    changeLanguage: vi.fn(),
  },
}));

export const TransMock = vi
  .fn()
  .mockImplementation(
    ({
      i18nKey,
      children,
      components,
    }: {
      i18nKey?: string;
      children?: React.ReactNode;
      components?: Record<string, unknown>;
    }) => (
      <span data-testid={`trans-${i18nKey}`}>
        {children}
        {components &&
          Object.entries(components).map(([key, component]) => (
            <React.Fragment key={key}>{component as React.ReactNode}</React.Fragment>
          ))}
      </span>
    ),
  );
