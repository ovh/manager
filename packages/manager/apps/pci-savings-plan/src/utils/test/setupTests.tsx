import { vi } from 'vitest';
import '@testing-library/jest-dom';

export const tMock = vi.fn((key: string) => key);

export const PageType = {
  popup: 'popup',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useRouteLoaderData: () => ({
      serviceId: 1,
    }),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();

  return {
    ...mod,
    useCatalogPrice: vi
      .fn()
      .mockReturnValue({ getTextPrice: vi.fn().mockReturnValue('€10.00') }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await import('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useOvhTracking: () => ({
      trackClick: vi.fn(),
      trackCurrentPage: vi.fn(),
      trackPage: vi.fn(),
      pageType: actual.PageType.popup,
    }),
  };
});

type ElementInternalsLike = {
  form: HTMLFormElement | null;
  states: Set<string>;
  setFormValue(value: unknown, state?: unknown): void;
  setValidity(
    flags?: Record<string, boolean>,
    message?: string,
    anchor?: HTMLElement | null,
  ): void;
};

if (!HTMLElement.prototype.attachInternals) {
  // avoid reimplementing the full attachInternals content
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HTMLElement.prototype.attachInternals = (): ElementInternalsLike => {
    return {
      form: null,
      states: new Set<string>(),
      setFormValue: () => {},
      setValidity: () => {},
    };
  };
}
