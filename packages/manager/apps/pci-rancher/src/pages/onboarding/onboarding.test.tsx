import React from 'react';
import userEvent from '@testing-library/user-event';
import Onboarding from './index';
import { render, waitFor } from '../../utils/test/test.provider';
import onboardingTranslation from '../../public/translations/pci-rancher/onboarding/Messages_fr_FR.json';

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

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ projectId: '123' }),
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
});
