import React from 'react';
import userEvent from '@testing-library/user-event';
import Onboarding from './index';
import { render, waitFor } from '../../utils/test/test.provider';
import onboardingTranslation from '../../public/translations/pci-rancher/onboarding/Messages_fr_FR.json';
import { useGuideUtils } from '@/components/GuideLink';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ projectId: '123' }),
}));

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

jest.mock('@/components/GuideLink', () => ({
  useGuideUtils: jest.fn(() => ({
    MANAGED_RANCHER_SERVICE_GETTING_STARTED: 'https://example.com/guide1',
  })),
}));

jest.spyOn(React, 'useEffect').mockImplementation((t) => jest.fn(t));

const setupSpecTest = async () => waitFor(() => render(<Onboarding />));

describe('Onboarding', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText(onboardingTranslation.title);

    expect(title).not.toBeNull();
  });

  it('Given click on CTA, we should redirect to create rancher page', async () => {
    const screen = await setupSpecTest();

    const button = screen.getByText(onboardingTranslation.orderButtonLabel);

    await userEvent.click(button);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/pci/projects/123/rancher/new',
    );
  });

  it('renders the guide tiles correctly', async () => {
    const screen = await setupSpecTest();

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
