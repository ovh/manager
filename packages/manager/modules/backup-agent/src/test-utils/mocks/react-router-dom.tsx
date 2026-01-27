import React from 'react';
import { vi } from 'vitest';

export const useHrefMock = vi.fn().mockImplementation((url: string) => url);
const navigateMock = vi.fn();
// @ts-ignore
navigateMock.navigate = navigateMock;
export const useNavigateMock = vi.fn().mockImplementation(() => navigateMock);
export const useParamsMock = vi.fn().mockImplementation(() => ({}));
export const useLocationMock = vi.fn().mockImplementation(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}));
export const LinkMock = vi.fn().mockImplementation(({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
));
