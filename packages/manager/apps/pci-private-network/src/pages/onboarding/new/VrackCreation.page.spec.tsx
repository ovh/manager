import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as useVrackModule from '@/api/hooks/useVrack';
import VrackCreation from './VrackCreation.page';
import { TVrack } from '@/api/data/vrack';

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

describe('VrackCreationPage', () => {
  it('renders correctly', () => {
    vi.spyOn(useVrackModule, 'useVracks').mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<(TVrack & { vrackId: string; displayName: string })[]>);
    vi.spyOn(useVrackModule, 'useProjectVrack').mockReturnValue({
      data: null,
      isPending: false,
    } as UseQueryResult<{ id: string; name: string }>);
    const { container } = render(<VrackCreation />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
