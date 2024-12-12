import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import BlocCIDR from './CIDR.component';

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useForm({
    defaultValues: {
      errors: {},
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...formMethods}>{children}</FormProvider>
    </QueryClientProvider>
  );
};

describe('BlocCIDR Component', () => {
  it('renders spinner when data is pending', () => {
    vi.mock('@/api/hooks/useIpRestrictions', () => ({
      useIpRestrictions: () => ({
        data: [],
        isPending: true,
      }),
    }));

    render(
      <Wrapper>
        <BlocCIDR />
      </Wrapper>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error messages when form has errors', () => {
    const formMethods = useForm({
      defaultValues: {
        errors: {
          errorKey: { message: 'Error message' },
        },
      },
    });

    render(
      <FormProvider {...formMethods}>
        <BlocCIDR />
      </FormProvider>,
    );

    expect(screen.getByTestId('osds-message')).toBeInTheDocument();
    expect(screen.getByTestId('osds-text')).toHaveTextContent('Error message');
  });

  it('renders notifications when no CIDR data is available', () => {
    render(
      <Wrapper>
        <BlocCIDR />
      </Wrapper>,
    );

    expect(screen.getByTestId('notifications')).toBeInTheDocument();
  });

  it('handles the creation of new rows', () => {
    const setQueryDataMock = vi.fn();

    render(
      <Wrapper>
        <BlocCIDR />
      </Wrapper>,
    );

    const button = screen.getByText('createNewRow'); // Ajoutez un bouton ou une action pour déclencher cette fonctionnalité
    fireEvent.click(button);

    expect(setQueryDataMock).toHaveBeenCalled();
  });
});
