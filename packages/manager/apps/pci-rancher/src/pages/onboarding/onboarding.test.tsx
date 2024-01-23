import React from 'react';
import Onboarding from './index';
import { render, waitFor } from '../../utils/test.provider';
import onboardingTranslation from '../../public/translations/pci-rancher/onboarding/Messages_fr_FR.json';

const setupSpecTest = async () => waitFor(() => render(<Onboarding />));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ isLoading: false, data: [] })),
  useMutation: jest.fn(() => ({ isLoading: false, data: [] })),
}));

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
}));

describe('Onboarding', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText(onboardingTranslation.title);

    expect(title).not.toBeNull();
  });
});
