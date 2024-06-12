import 'element-internals-polyfill';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useParams } from 'react-router-dom';
import OnBoardingPage from './Onboarding.page';

vi.mock('react-router-dom');

const shellContext = {
  environment: {
    getUser: vi.fn(),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('OnBoardingPage', () => {
  it('should render onboarding page', async () => {
    const { environment, shell } = shellContext;
    environment.getUser.mockResolvedValue({
      ovhSubsidiary: 'foo',
    });
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useParams).mockReturnValue({ projectId: '123' });
    const { container } = render(<OnBoardingPage />, { wrapper });
    expect(container).toBeDefined();
  });
});
