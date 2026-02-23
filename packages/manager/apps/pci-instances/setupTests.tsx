import { ReactNode } from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-i18next', async (importOriginal) => {
  const original: typeof import('react-i18next') = await importOriginal();

  return {
    ...original,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        exists: () => true,
        language: 'fr_FR',
      },
    }),
    Trans: ({
      i18nKey,
      components,
    }: {
      i18nKey: string;
      components?: Record<string, ReactNode> | null;
    }) => (
      <>
        <span>{i18nKey}</span>
        {components != null &&
          Object.entries(components).map(([key, node]) => (
            <div key={key}>{node}</div>
          ))}
      </>
    ),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: () => '/foo/bar',
  useCatalogPrice: vi.fn().mockReturnValue({
    getTextPrice: vi.fn((price: number) => `${price}`),
    getFormattedHourlyCatalogPrice: vi.fn(
      (price: number) => `${price} €/HT/hour`,
    ),
    getFormattedMonthlyCatalogPrice: vi.fn(
      (price: number) => `${price} €/HT/month`,
    ),
  }),
}));

vi.mock('@/hooks/project/useProjectId', () => ({
  useProjectId: () => '8c8c4fd6d4414aa29fc777752b00005198664',
}));

const ResizeObserverMock = vi.fn((callback) => {
  const mockEntry = {
    target: document.createElement('div'),
    contentRect: {
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
    },
    borderBoxSize: [{ width: 100, height: 100 }],
    contentBoxSize: [{ width: 100, height: 100 }],
    devicePixelContentBoxSize: [{ width: 100, height: 100 }],
  };

  callback([mockEntry]);

  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();

  return {
    ...original,
    useOvhTracking: vi.fn().mockReturnValue({
      trackCurrentPage: vi.fn(),
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    }),
  };
});

vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const original: typeof import('@ovh-ux/muk') = await importOriginal();

  return {
    ...original,
    isLocalZone: vi
      .fn()
      .mockImplementation((microRegion) => microRegion === 'fake-LZ'),
    useCatalogPrice: vi.fn().mockReturnValue({
      getTextPrice: vi.fn((price: number) => `${price}`),
      getFormattedHourlyCatalogPrice: vi.fn(
        (price: number) => `${price} €/HT/hour`,
      ),
      getFormattedMonthlyCatalogPrice: vi.fn(
        (price: number) => `${price} €/HT/month`,
      ),
    }),
  };
});
