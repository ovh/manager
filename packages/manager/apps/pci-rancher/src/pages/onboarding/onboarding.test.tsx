import React from 'react';
import userEvent from '@testing-library/user-event';
import onboardingTranslation from '@translation/onboarding/Messages_fr_FR.json';
import Onboarding from './Onboarding.page';
import { render, waitFor } from '@/utils/test/test.provider';
import { useGuideUtils } from '@/hooks/useGuideLink/useGuideLink';

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

jest.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  useGuideUtils: jest.fn(() => ({
    MANAGED_RANCHER_SERVICE_GETTING_STARTED: 'https://example.com/guide1',
    MANAGED_RANCHER_SERVICE_CREATION: 'https://example.com/guide2',
    MANAGED_RANCHER_SERVICE_LIFECYCLE_POLICY: 'https://example.com/guide3',
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

    const tileList = [
      { id: 1, href: 'https://example.com/guide1' },
      { id: 2, href: 'https://example.com/guide2' },
      { id: 3, href: 'https://example.com/guide3' },
    ];

    const guideTitle = screen.getByText(
      onboardingTranslation.managedRancherServiceGettingStartedTitle,
    );
    const guideDescription = screen.getByText(
      onboardingTranslation.managedRancherServiceGettingStartedTitleDescription,
    );

    expect(guideTitle).toBeInTheDocument();
    expect(guideDescription).toBeInTheDocument();

    const cards = screen.getAllByTestId('tileCard');
    cards.forEach((card, index) => {
      expect(card).toHaveAttribute('href', tileList[index].href);
    });
  });

  it('uses the guide link utility correctly', async () => {
    const guideUtils = useGuideUtils();

    const expectedResults = [
      {
        key: 'MANAGED_RANCHER_SERVICE_GETTING_STARTED',
        expectedValue: 'https://example.com/guide1',
      },
      {
        key: 'MANAGED_RANCHER_SERVICE_CREATION',
        expectedValue: 'https://example.com/guide2',
      },
      {
        key: 'MANAGED_RANCHER_SERVICE_CREATION_USERS_PROJECTS',
        expectedValue: 'https://example.com/guide3',
      },
    ];

    expectedResults.forEach((testCase) => {
      expect(guideUtils[testCase.key]).toBe(testCase.expectedValue);
    });
  });
});
