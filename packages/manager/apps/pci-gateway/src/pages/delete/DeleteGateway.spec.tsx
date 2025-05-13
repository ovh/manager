import { act, fireEvent, render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
} from '@tanstack/react-query';
import { OsdsButton } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import DeleteGateway from '@/pages/delete/DeleteGateway.page';
import * as useGatewayModule from '@/api/hooks/useGateway';

const renderDeleteGatewayPage = () => {
  const queryClient = new QueryClient();
  return render(
    <ShellContext.Provider value={undefined}>
      <QueryClientProvider client={queryClient}>
        <DeleteGateway />
      </QueryClientProvider>
      ,
    </ShellContext.Provider>,
  );
};

const mockedUseNavigate = vi.fn();

type UseDeleteGatewayReturnType = UseMutationResult<
  unknown,
  Error,
  void,
  unknown
> & { deleteGateway: () => void };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate,
  useSearchParams: () => [
    new URLSearchParams({
      id: 'id-gateway',
      name: 'name-gateway',
      region: 'region-gateway',
    }),
  ],
  useParams: () => ({
    projectId: 'project-id-param',
  }),
}));

describe('DeleteGateway component tests', () => {
  const mockDeleteGateway = vi.fn();

  it('should display spinner when deleteGateway is pending', () => {
    vi.spyOn(useGatewayModule, 'useDeleteGateway').mockReturnValue(({
      isPending: true,
      deleteGateway: mockDeleteGateway,
    } as unknown) as UseDeleteGatewayReturnType);
    const { queryByTestId } = renderDeleteGatewayPage();
    expect(queryByTestId('pciModal-spinner')).toBeVisible();
  });

  it('should not display spinner when deleteGateway is not pending', () => {
    vi.spyOn(useGatewayModule, 'useDeleteGateway').mockReturnValue(({
      isPending: false,
      deleteGateway: mockDeleteGateway,
    } as unknown) as UseDeleteGatewayReturnType);
    const { queryByTestId } = renderDeleteGatewayPage();
    expect(queryByTestId('pciModal-spinner')).not.toBeInTheDocument();
  });

  it('should disabled submit button when deleteGateway is pending', () => {
    vi.spyOn(useGatewayModule, 'useDeleteGateway').mockReturnValue(({
      isPending: true,
      deleteGateway: mockDeleteGateway,
    } as unknown) as UseDeleteGatewayReturnType);
    const { queryByTestId } = renderDeleteGatewayPage();

    const submitButton = (queryByTestId(
      'pciModal-button_submit',
    ) as unknown) as OsdsButton;

    expect(submitButton).toHaveAttribute('disabled');
    expect(submitButton.disabled).toBe(true);
  });

  it('should not disabled submit button when deleteGateway is not pending', () => {
    vi.spyOn(useGatewayModule, 'useDeleteGateway').mockReturnValue(({
      isPending: false,
      deleteGateway: mockDeleteGateway,
    } as unknown) as UseDeleteGatewayReturnType);
    const { queryByTestId } = renderDeleteGatewayPage();
    const submitButton = queryByTestId('pciModal-button_submit');
    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('should handle onClose function the the cancel button is clicked', () => {
    vi.spyOn(useGatewayModule, 'useDeleteGateway').mockReturnValue(({
      isPending: false,
      deleteGateway: mockDeleteGateway,
    } as unknown) as UseDeleteGatewayReturnType);

    const { getByTestId } = renderDeleteGatewayPage();

    const submitButton = getByTestId('pciModal-button_submit');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(mockDeleteGateway).toHaveBeenCalledTimes(1);
  });
});
