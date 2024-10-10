import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { useHref, useParams } from 'react-router-dom';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import { TProject } from '@ovh-ux/manager-pci-common';
import ListingPage from './List.page';

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
describe('ListingPage', () => {
  it('ListingPage renders without crashing', () => {
    vi.spyOn(pciCommonModule, 'useProject').mockResolvedValue({
      data: {
        project_id: '123',
        planCode: 'project.discovery',
        description: 'description',
      },
    } as UseQueryResult<TProject, null>);
    const { environment, shell } = shellContext;
    environment.getUser.mockResolvedValue({
      ovhSubsidiary: 'foo',
    });
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useParams).mockReturnValue({ projectId: '123' });
    vi.mocked(useHref).mockReturnValue('mocked_href');
    const { container } = render(<ListingPage />, { wrapper });
    expect(container).toBeDefined();
  });
});
