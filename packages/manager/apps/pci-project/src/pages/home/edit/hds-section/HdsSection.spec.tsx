import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TProject } from '@ovh-ux/manager-pci-common';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import HdsSection from './HdsSection';
import { createWrapper } from '@/wrapperRenders';
import * as useHdsModule from './useHds';
import * as useCartModule from '@/data/hooks/useCart';
import { Cart, CartSummary, TCheckoutResponse } from '@/data/types/cart.type';
import { TCartServiceOption } from '@/data/types/service.type';

vi.mock('./useHds', () => ({
  useIsAlreadyHdsCertifiedProject: vi.fn(),
  useGetHdsCartServiceOption: vi.fn(),
  usePrepareHdsCart: vi.fn(),
  useCheckoutAndPayCart: vi.fn(),
}));

vi.mock('@/data/hooks/useCart', () => ({
  useGetCartSummary: vi.fn(),
}));

const mockProject: TProject = {
  access: 'full',
  creationDate: '2023-01-01',
  description: 'Test Project',
  expiration: null,
  iam: { displayName: 'Test', id: 'iam-1', urn: 'urn', tags: {} },
  manualQuota: false,
  orderId: 123,
  planCode: 'plan',
  projectName: 'Test Project',
  project_id: 'project-1',
  status: 'ok',
  unleash: false,
};

function mockQueryResult<T>(data: T) {
  return ({
    data,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: true,
    refetch: vi.fn(),
    remove: vi.fn(),
    status: 'success',
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    isFetched: true,
    isRefetching: false,
    isStale: false,
    isPaused: false,
    fetchStatus: 'idle',
    isLoadingError: false,
    isRefetchError: false,
    variables: undefined,
  } as unknown) as UseQueryResult<T, Error>;
}

type HdsMutationResult = UseMutationResult<
  TCheckoutResponse,
  ApiError,
  { cartId: string; paymentMean?: string },
  unknown
>;

function mockMutationResult(
  options: Partial<HdsMutationResult> = {},
): HdsMutationResult {
  return ({
    mutate: vi.fn(),
    isPending: false,
    ...options,
  } as unknown) as HdsMutationResult;
}

const mockCartServiceOption: TCartServiceOption = {
  mandatory: false,
  exclusive: false,
  productName: '',
  planCode: 'certification.hds',
  family: '',
  productType: '',
  prices: [],
};

const mockCart: Cart = {
  cartId: 'cart-1',
  description: '',
  expire: '',
  readOnly: false,
};

const mockCartSummary: CartSummary = {
  contracts: [],
  orderId: 1,
  url: '',
  details: [],
  prices: {
    originalWithoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    tax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    withTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    withoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
  },
};

const mockCartSummaryWithContracts: CartSummary = {
  contracts: [{ url: 'url', name: 'Contract', content: 'c' }],
  orderId: 1,
  url: '',
  details: [],
  prices: {
    originalWithoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    tax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    withTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    withoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
  },
};

describe('HdsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title and HdsOption', () => {
    vi.mocked(useHdsModule.useIsAlreadyHdsCertifiedProject).mockReturnValue(
      mockQueryResult<boolean>(false),
    );
    vi.mocked(useHdsModule.useGetHdsCartServiceOption).mockReturnValue(
      mockQueryResult<TCartServiceOption>(mockCartServiceOption),
    );
    vi.mocked(useHdsModule.usePrepareHdsCart).mockReturnValue(
      mockQueryResult<Cart>(mockCart),
    );
    vi.mocked(useCartModule.useGetCartSummary).mockReturnValue(
      mockQueryResult<CartSummary>(mockCartSummary),
    );
    vi.mocked(useHdsModule.useCheckoutAndPayCart).mockReturnValue(
      mockMutationResult(),
    );

    render(<HdsSection project={mockProject} />, { wrapper: createWrapper() });

    expect(
      screen.getByText('pci_projects_project_edit_hds_title'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('hds-checkbox')).toBeInTheDocument();
  });

  it('disables HdsOption if already certified', () => {
    vi.mocked(useHdsModule.useIsAlreadyHdsCertifiedProject).mockReturnValue(
      mockQueryResult<boolean>(true),
    );
    vi.mocked(useHdsModule.useGetHdsCartServiceOption).mockReturnValue(
      mockQueryResult<TCartServiceOption>(mockCartServiceOption),
    );
    vi.mocked(useHdsModule.usePrepareHdsCart).mockReturnValue(
      mockQueryResult<Cart>(mockCart),
    );
    vi.mocked(useCartModule.useGetCartSummary).mockReturnValue(
      mockQueryResult<CartSummary>(mockCartSummary),
    );
    vi.mocked(useHdsModule.useCheckoutAndPayCart).mockReturnValue(
      mockMutationResult(),
    );

    render(<HdsSection project={mockProject} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('hds-checkbox')).toHaveAttribute(
      'is-disabled',
      'true',
    );
  });

  it('shows contracts section when HDS is checked and not certified', async () => {
    vi.mocked(useHdsModule.useIsAlreadyHdsCertifiedProject).mockReturnValue(
      mockQueryResult<boolean>(false),
    );
    vi.mocked(useHdsModule.useGetHdsCartServiceOption).mockReturnValue(
      mockQueryResult<TCartServiceOption>(mockCartServiceOption),
    );
    vi.mocked(useHdsModule.usePrepareHdsCart).mockReturnValue(
      mockQueryResult<Cart>(mockCart),
    );
    vi.mocked(useCartModule.useGetCartSummary).mockReturnValue(
      mockQueryResult<CartSummary>(mockCartSummaryWithContracts),
    );
    vi.mocked(useHdsModule.useCheckoutAndPayCart).mockReturnValue(
      mockMutationResult(),
    );

    render(<HdsSection project={mockProject} />, { wrapper: createWrapper() });

    const hdsCheckbox = screen.getByTestId('hds-checkbox');
    fireEvent(
      hdsCheckbox,
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('contracts-checkbox')).toBeVisible();
    });
  });

  it('disables validate button unless contracts are checked', async () => {
    vi.mocked(useHdsModule.useIsAlreadyHdsCertifiedProject).mockReturnValue(
      mockQueryResult<boolean>(false),
    );
    vi.mocked(useHdsModule.useGetHdsCartServiceOption).mockReturnValue(
      mockQueryResult<TCartServiceOption>(mockCartServiceOption),
    );
    vi.mocked(useHdsModule.usePrepareHdsCart).mockReturnValue(
      mockQueryResult<Cart>(mockCart),
    );
    vi.mocked(useCartModule.useGetCartSummary).mockReturnValue(
      mockQueryResult<CartSummary>(mockCartSummaryWithContracts),
    );
    vi.mocked(useHdsModule.useCheckoutAndPayCart).mockReturnValue(
      mockMutationResult(),
    );

    render(<HdsSection project={mockProject} />, { wrapper: createWrapper() });

    const hdsCheckbox = screen.getByTestId('hds-checkbox');
    fireEvent(
      hdsCheckbox,
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    const contractsCheckbox = screen.getByTestId('contracts-checkbox');

    await waitFor(() => {
      expect(contractsCheckbox).toBeInTheDocument();
    });

    const button = screen.getByTestId('hds-section_submit-button');
    expect(button).toHaveAttribute('is-disabled', 'true');

    fireEvent(
      contractsCheckbox,
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    expect(button).toHaveAttribute('is-disabled', 'false');
  });

  it('calls checkoutCart and shows loading on submit', async () => {
    vi.mocked(useHdsModule.useIsAlreadyHdsCertifiedProject).mockReturnValue(
      mockQueryResult<boolean>(false),
    );
    vi.mocked(useHdsModule.useGetHdsCartServiceOption).mockReturnValue(
      mockQueryResult<TCartServiceOption>(mockCartServiceOption),
    );
    vi.mocked(useHdsModule.usePrepareHdsCart).mockReturnValue(
      mockQueryResult<Cart>(mockCart),
    );
    vi.mocked(useCartModule.useGetCartSummary).mockReturnValue(
      mockQueryResult<CartSummary>(mockCartSummaryWithContracts),
    );
    const mutate = vi.fn();
    vi.mocked(useHdsModule.useCheckoutAndPayCart).mockReturnValue(
      mockMutationResult({ mutate, isPending: true }),
    );

    render(<HdsSection project={mockProject} />, { wrapper: createWrapper() });

    const hdsCheckbox = screen.getByTestId('hds-checkbox');
    fireEvent(
      hdsCheckbox,
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    const contractsCheckbox = screen.getByTestId('contracts-checkbox');
    await waitFor(() => {
      expect(contractsCheckbox).toBeVisible();
    });

    fireEvent(
      contractsCheckbox,
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    const button = screen.getByTestId('hds-section_submit-button');
    fireEvent.click(button);

    expect(mutate).toHaveBeenCalledWith({ cartId: 'cart-1' });
    expect(button).toHaveAttribute('is-loading', 'true');
  });

  it('shows spinner in contracts section when contracts are loading', () => {
    vi.mocked(useHdsModule.useIsAlreadyHdsCertifiedProject).mockReturnValue(
      mockQueryResult<boolean>(false),
    );
    vi.mocked(useHdsModule.useGetHdsCartServiceOption).mockReturnValue(
      mockQueryResult<TCartServiceOption>(mockCartServiceOption),
    );
    vi.mocked(useHdsModule.usePrepareHdsCart).mockReturnValue(
      mockQueryResult<Cart>(mockCart),
    );
    vi.mocked(useCartModule.useGetCartSummary).mockReturnValue(
      (mockQueryResult<CartSummary | undefined>(
        undefined,
      ) as unknown) as UseQueryResult<CartSummary, Error>,
    );
    vi.mocked(useHdsModule.useCheckoutAndPayCart).mockReturnValue(
      mockMutationResult(),
    );

    render(<HdsSection project={mockProject} />, { wrapper: createWrapper() });

    fireEvent(
      screen.getByTestId('hds-checkbox'),
      new CustomEvent('odsChange', { detail: { checked: true } }),
    );

    expect(screen.getByTestId('ods-spinner')).toBeVisible();
  });
});
