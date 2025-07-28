import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Onboarding from './Onboarding.page';
import {
  mockedGuideOnboarding,
  mockedGuides,
} from '@/__tests__/helpers/mocks/shared/guides';

describe('Onboarding page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/data/api/ai/guide.api', () => ({
      getGuides: vi.fn(() => [mockedGuides, mockedGuideOnboarding]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the onboarding Page', async () => {
    render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onbaording-container')).toBeTruthy();
      expect(screen.getByTestId('create-notebook-link')).toBeTruthy();
    });
  });
});
