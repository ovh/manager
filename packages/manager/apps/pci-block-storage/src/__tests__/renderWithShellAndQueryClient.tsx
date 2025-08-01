import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { render, RenderOptions } from '@testing-library/react';
import { DeepPartial } from 'react-hook-form';

const defaultShellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: () => Promise.resolve('https://www.ovh.com'),
    },
  },
};

export const renderWithShellAndQueryClient = (
  ui: React.ReactNode,
  options?: RenderOptions & { shell?: DeepPartial<ShellContextType> },
) => {
  const queryClient = new QueryClient();
  const {
    shell = {},
    wrapper: CustomWrapper = ({ children }) => <>{children}</>,
    ...optionsRest
  } = options ?? {};

  const DefaultWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={
          {
            ...defaultShellContext,
            ...shell,
          } as ShellContextType
        }
      >
        {children}
      </ShellContext.Provider>
    </QueryClientProvider>
  );

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CustomWrapper>
      <DefaultWrapper>{children}</DefaultWrapper>
    </CustomWrapper>
  );

  return render(ui, {
    wrapper,
    ...optionsRest,
  });
};
