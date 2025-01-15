import { vi } from 'vitest';
import '@testing-library/jest-dom';

export const tMock = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
  }),
}));
