import { describe, expect, it, vi } from 'vitest';

import * as AppC from '@/App.constants';

import {
  ensureLeadingSlash,
  interpolatePath,
  resolveListingRoute,
  resolveOnboardingRoute,
} from './Client.utils';

describe('ensureLeadingSlash', () => {
  it('returns "/" when input is empty', () => {
    expect(ensureLeadingSlash('')).toBe('/');
  });

  it('keeps leading slash intact', () => {
    expect(ensureLeadingSlash('/login')).toBe('/login');
  });

  it('prepends slash if missing', () => {
    expect(ensureLeadingSlash('users')).toBe('/users');
  });
});

describe('interpolatePath', () => {
  it('replaces {param} placeholders', () => {
    const route = interpolatePath('/email/domain/{domain}', { domain: 'example.com' });
    expect(route).toBe('/email/domain/example.com');
  });

  it('replaces :param placeholders', () => {
    const route = interpolatePath('/okms/:id/resource', { id: '123' });
    expect(route).toBe('/okms/123/resource');
  });

  it('replaces undefined values with empty string', () => {
    const route = interpolatePath('/foo/{x}/:y', { x: undefined, y: undefined });
    expect(route).toBe('/foo//');
  });

  it('returns unchanged when no params provided', () => {
    expect(interpolatePath('/hello')).toBe('/hello');
  });
});

describe('resolveListingRoute', () => {
  it('returns normalized route with params', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const spy = vi.spyOn(AppC, 'LISTING_API_ROUTE', 'get').mockReturnValue('/zimbra');
    const route = resolveListingRoute({ projectId: 'p-123' });
    expect(route).toBe('/zimbra');
    spy.mockRestore();
  });

  it('falls back to "/" when route is empty', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const spy = vi.spyOn(AppC, 'LISTING_API_ROUTE', 'get').mockReturnValue('' as unknown as string);

    expect(resolveListingRoute()).toBe('/');
    spy.mockRestore();
  });
});

describe('resolveOnboardingRoute', () => {
  it('returns normalized route with params', () => {
    const spy = vi
      .spyOn(AppC, 'ONBOARDING_API_ROUTE', 'get')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .mockReturnValue('/email/domain/{domain}/account-getemailDomainDomainAccountList');

    const route = resolveOnboardingRoute({ domain: 'example.com' });
    // function splits at "-" and interpolates
    expect(route).toBe('/email/domain/example.com/account');
    spy.mockRestore();
  });

  it('falls back to "/" when route is empty', () => {
    const spy = vi
      .spyOn(AppC, 'ONBOARDING_API_ROUTE', 'get')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .mockReturnValue('' as unknown as string);

    expect(resolveOnboardingRoute()).toBe('/');
    spy.mockRestore();
  });
});
