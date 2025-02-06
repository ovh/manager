import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import BillingSupport from './BillingSupport.component';

describe('BillingSupport component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders billing support page', async () => {
    render(<BillingSupport />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('billing-support-container')).toBeInTheDocument();
  });
});
