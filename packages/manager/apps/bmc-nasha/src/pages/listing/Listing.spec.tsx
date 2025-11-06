import { ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// --- Mock router ---
const navigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

// --- Tests ---
describe('ListingPage', () => {
  afterEach(() => {
    vi.resetModules();
  });
});
