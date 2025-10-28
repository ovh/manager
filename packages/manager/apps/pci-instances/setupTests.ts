import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
      language: 'fr_FR',
    },
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: () => '/foo/bar',
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
