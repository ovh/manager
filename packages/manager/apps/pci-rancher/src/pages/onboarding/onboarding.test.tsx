import React from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import onboardingTranslation from '../../../public/translations/onboarding/Messages_fr_FR.json';
import Onboarding from './Onboarding.page';
import { render } from '../../utils/test/test.provider';
import { useGuideUtils } from '../../hooks/useGuideLink/useGuideLink';

const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ projectId: '123' }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: vi.fn(() => ({
    getURL: vi.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

vi.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  useGuideUtils: vi.fn(() => ({
    MANAGED_RANCHER_SERVICE_GETTING_STARTED: 'https://example.com/guide1',
  })),
}));

vi.spyOn(React, 'useEffect').mockImplementation((t) => vi.fn(t));

const setupSpecTest = () => waitFor(() => render(<Onboarding />));

describe('Onboarding', () => {
  it('renders without error', async () => {
    setupSpecTest();
    const title = screen.getByText(onboardingTranslation.title);
  });

  it('Given click on CTA, we should redirect to create rancher page', async () => {
    setupSpecTest();

    const button = screen.getByText(onboardingTranslation.orderButtonLabel);

    await userEvent.click(button);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/pci/projects/123/rancher/new',
    );
  });

  it('renders the guide tiles correctly', async () => {
    setupSpecTest();

    const guideTitle = screen.getByText(
      onboardingTranslation.managedRancherServiceGettingStartedTitle,
    );
    const guideDescription = screen.getByText(
      onboardingTranslation.managedRancherServiceGettingStartedTitleDescription,
    );

    expect(guideTitle).toBeInTheDocument();
    expect(guideDescription).toBeInTheDocument();

    const card = screen.getByTestId('tileCard');
    expect(card).toHaveAttribute('href', 'https://example.com/guide1');
  });

  it('uses the guide link utility correctly', async () => {
    const guideUtils = useGuideUtils();

    expect(guideUtils.MANAGED_RANCHER_SERVICE_GETTING_STARTED).toBe(
      'https://example.com/guide1',
    );
  });
});
