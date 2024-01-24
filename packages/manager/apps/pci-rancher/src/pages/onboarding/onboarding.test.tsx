import React from 'react';
import Onboarding from './index';
import { render, waitFor } from '../../utils/test.provider';
import onboardingTranslation from '../../public/translations/pci-rancher/onboarding/Messages_fr_FR.json';

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
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
});
