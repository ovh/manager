import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('zustand');

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));
