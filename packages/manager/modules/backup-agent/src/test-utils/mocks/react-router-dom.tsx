import React from 'react';

import { vi } from 'vitest';

export const useHrefMock = vi.fn().mockImplementation((url: string) => url);
const navigateMock = vi.fn();
// @ts-expect-error: navigate is not a property of vi.fn()
navigateMock.navigate = navigateMock;
export const useNavigateMock = vi.fn().mockImplementation(() => navigateMock);
export const useParamsMock = vi.fn().mockImplementation(() => ({}));
export const useLocationMock = vi.fn().mockImplementation(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}));
export const LinkMock = vi
  .fn()
  .mockImplementation(({ to, children, ...props }: { to: string; children?: React.ReactNode }) => (
    <a href={to} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ));
