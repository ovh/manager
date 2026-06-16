import { ComponentProps, ReactNode } from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

import { Step1Selection } from './Step1Selection.component';

/**
 * Replace ONLY the form-associated ODS components (combobox + checkbox) with faithful
 * stand-ins. The `element-internals-polyfill` used by the legacy jsdom harness throws on
 * form-associated custom elements that connect without a populated internals map, which
 * would otherwise crash the whole render. The stand-ins keep the `onOdsChange` /
 * `onOdsBlur` contract (driven by native `odsChange` CustomEvents in the tests) and the
 * `is-checked` / `is-disabled` attribute surface the assertions query.
 */
vi.mock('@/hooks/useTunnelLinks', () => ({
  useTunnelLinks: () => ({
    faq: 'https://help.ovhcloud.com/csm/fr-documentation',
    installGuide: 'https://help.ovhcloud.com/csm/fr-backup-agent-first-configuration',
    orderBaremetal: 'https://www.ovhcloud.com/fr/bare-metal/',
    support: 'https://www.ovhcloud.com/fr/support-levels/',
    paymentSettings: 'https://www.ovh.com/manager/#/dedicated/billing/payment/method',
  }),
}));

vi.mock('@ovhcloud/ods-components/react', async (orig) => {
  const actual = await orig<typeof import('@ovhcloud/ods-components/react')>();
  type StandInProps = ComponentProps<'div'> & {
    children?: ReactNode;
    onOdsChange?: (e: CustomEvent) => void;
    isChecked?: boolean;
    isDisabled?: boolean;
    value?: string;
  };
  // Bridge the native `odsChange` CustomEvent dispatched in tests to the React `onOdsChange` prop.
  const bridge = (onOdsChange?: (e: CustomEvent) => void) => (node: HTMLElement | null) => {
    if (!node) return;
    node.addEventListener('odsChange', ((e: Event) =>
      onOdsChange?.(e as CustomEvent)) as EventListener);
  };
  const Combobox = ({ children, onOdsChange, isDisabled, value }: StandInProps) => (
    <mock-combobox
      is-disabled={isDisabled ? 'true' : undefined}
      value={value}
      ref={bridge(onOdsChange)}
    >
      {children}
    </mock-combobox>
  );
  const ComboboxItem = ({ children, value }: StandInProps) => (
    <mock-combobox-item value={value}>{children}</mock-combobox-item>
  );
  const Checkbox = ({ onOdsChange, isChecked, isDisabled }: StandInProps) => (
    <mock-checkbox
      is-checked={isChecked ? 'true' : undefined}
      is-disabled={isDisabled ? 'true' : undefined}
      ref={bridge(onOdsChange)}
    />
  );
  return { ...actual, OdsCombobox: Combobox, OdsComboboxItem: ComboboxItem, OdsCheckbox: Checkbox };
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'mock-combobox': Record<string, unknown>;
      'mock-combobox-item': Record<string, unknown>;
      'mock-checkbox': Record<string, unknown>;
    }
  }
}

// ─── Hoisted mocks ───
const {
  baremetalsAllMock,
  useQueryMock,
  createCartMock,
  checkoutMock,
  checkoutCallbacks,
  checkoutState,
} = vi.hoisted(() => ({
  baremetalsAllMock: vi.fn(),
  useQueryMock: vi.fn(),
  createCartMock: vi.fn(),
  checkoutMock: vi.fn(),
  // captures the onSuccess/onError passed to useCheckoutBackupAgentCart
  checkoutCallbacks: {} as {
    onSuccess?: () => void;
    onError?: (error: { response?: { data: { message: string } }; message: string }) => void;
  },
  checkoutState: { isPending: false },
}));

vi.mock('@tanstack/react-query', async (orig) => {
  const actual = await orig<typeof import('@tanstack/react-query')>();
  return { ...actual, useQuery: useQueryMock };
});

vi.mock('@ovh-ux/backup-agent/data/queries/baremetals.queries', () => ({
  baremetalsQueries: { all: baremetalsAllMock },
}));

vi.mock('@/hooks/useCreateBackupAgentCart', () => ({
  useCreateBackupAgentCart: () => ({ mutateAsync: createCartMock }),
}));

vi.mock('@/hooks/useCheckoutBackupAgentCart', () => ({
  useCheckoutBackupAgentCart: (options: {
    onSuccess?: () => void;
    onError?: (error: { response?: { data: { message: string } }; message: string }) => void;
  }) => {
    checkoutCallbacks.onSuccess = options.onSuccess;
    checkoutCallbacks.onError = options.onError;
    return { mutate: checkoutMock, isPending: checkoutState.isPending };
  },
}));

const BAREMETALS = [
  {
    name: 'ns1.eu',
    ip: '1.2.3.4',
    region: 'GRA',
    datacenter: 'gra1',
    iam: { displayName: 'Server A' },
  },
  {
    name: 'ns2.eu',
    ip: '5.6.7.8',
    region: 'RBX',
    datacenter: 'rbx2',
    iam: { displayName: 'Server B' },
  },
  {
    name: 'ns3.eu',
    ip: '9.9.9.9',
    region: 'SBG',
    datacenter: 'sbg3',
    iam: { displayName: 'Server C' },
  },
];

const CART_RESULT = {
  cartId: 'cart-1',
  contractList: [{ name: 'Contract One', url: 'https://contract.ovh/1' }],
};

const renderStep1 = async (props: Partial<Parameters<typeof Step1Selection>[0]> = {}) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
  return render(<Step1Selection onComplete={vi.fn()} {...props} />, { wrapper });
};

const selectServer = async (container: HTMLElement, value: string) => {
  const combobox = container.querySelector('mock-combobox');
  await act(async () => {
    combobox?.dispatchEvent(new CustomEvent('odsChange', { detail: { value } }));
    await Promise.resolve();
  });
};

const checkTerms = async (container: HTMLElement) => {
  const checkbox = container.querySelector('mock-checkbox');
  await act(async () => {
    checkbox?.dispatchEvent(new CustomEvent('odsChange', { detail: { checked: true } }));
    await Promise.resolve();
  });
};

describe('Step1Selection', () => {
  beforeEach(() => {
    baremetalsAllMock.mockReturnValue({});
    useQueryMock.mockReturnValue({
      data: BAREMETALS,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
    createCartMock.mockReset();
    createCartMock.mockResolvedValue(CART_RESULT);
    checkoutMock.mockReset();
    checkoutState.isPending = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // TC-TNL-09 — combobox populated with displayName - IP (DATACENTER)
  it('populates the combobox with every server', async () => {
    const { container } = await renderStep1();
    const items = container.querySelectorAll('mock-combobox-item');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Server A - 1.2.3.4 (gra1)');
  });

  // TC-TNL-13 — selecting a server triggers cart creation with the server's IP/region/name
  it('creates a cart on server selection with the correct params', async () => {
    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu');

    await waitFor(() =>
      expect(createCartMock).toHaveBeenCalledWith({
        agentIp: '1.2.3.4',
        agentRegionName: 'GRA',
        agentServiceName: 'ns1.eu',
      }),
    );
  });

  // TC-TNL-18 — contract links appear once the cart resolves
  it('shows contract links once the cart resolves', async () => {
    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu');

    await waitFor(() => {
      const link = container.querySelector('ods-link[label="Contract One"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://contract.ovh/1');
    });
  });

  // TC-TNL-15 — rapid server changes: only the last cart result is applied (race cancellation)
  it('applies only the latest cart when servers change rapidly', async () => {
    let resolveA!: (v: typeof CART_RESULT) => void;
    const cartA = new Promise<typeof CART_RESULT>((res) => {
      resolveA = res;
    });
    createCartMock.mockReturnValueOnce(cartA).mockResolvedValueOnce({
      cartId: 'cart-C',
      contractList: [{ name: 'Contract C', url: 'https://contract.ovh/c' }],
    });

    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu'); // starts cart A (pending)
    await selectServer(container, 'ns3.eu'); // cancels A, starts cart C

    // Resolve the stale cart A after C has been selected.
    await act(async () => {
      resolveA(CART_RESULT);
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(container.querySelector('ods-link[label="Contract C"]')).toBeInTheDocument(),
    );
    // Stale cart A's contract must NOT be shown.
    expect(container.querySelector('ods-link[label="Contract One"]')).not.toBeInTheDocument();
  });

  // TC-TNL-23 — terms checkbox resets when the server changes
  it('resets the terms checkbox when the server changes', async () => {
    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu');
    await waitFor(() => expect(container.querySelector('mock-checkbox')).toBeInTheDocument());

    await checkTerms(container);
    await waitFor(() =>
      expect(container.querySelector('mock-checkbox')).toHaveAttribute('is-checked', 'true'),
    );

    await selectServer(container, 'ns2.eu');
    await waitFor(() =>
      expect(container.querySelector('mock-checkbox')).not.toHaveAttribute('is-checked', 'true'),
    );
  });

  // TC-TNL-20 / TC-TNL-21 — cart failure shows error + Retry, Retry re-runs createCart
  it('shows a cart error with a Retry that re-runs cart creation', async () => {
    createCartMock.mockReset();
    createCartMock.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce(CART_RESULT);

    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu');

    await waitFor(() =>
      expect(screen.getByText(/préparation de votre commande/i)).toBeInTheDocument(),
    );
    const retry = container.querySelector('ods-button[label="Réessayer"]');
    expect(retry).toBeInTheDocument();

    await userEvent.click(retry as Element);
    await waitFor(() => expect(createCartMock).toHaveBeenCalledTimes(2));
  });

  // TC-TNL-24 — Continue disabled until server + cart + terms, then enabled
  it('keeps Continue disabled until server, cart and terms are all satisfied', async () => {
    const { container } = await renderStep1();
    const continueBtn = () => container.querySelector('ods-button[label="Continuer"]');

    // No server selected.
    expect(continueBtn()).toHaveAttribute('is-disabled', 'true');

    await selectServer(container, 'ns1.eu');
    await waitFor(() => expect(container.querySelector('mock-checkbox')).toBeInTheDocument());
    // Cart ready but terms unchecked → still disabled.
    expect(continueBtn()).toHaveAttribute('is-disabled', 'true');

    await checkTerms(container);
    await waitFor(() => expect(continueBtn()).not.toHaveAttribute('is-disabled', 'true'));
  });

  // TC-TNL-25 — checkout fires with the resolved cartId
  it('checks out with the resolved cartId when Continue is clicked', async () => {
    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu');
    await waitFor(() => expect(container.querySelector('mock-checkbox')).toBeInTheDocument());
    await checkTerms(container);

    const continueBtn = container.querySelector('ods-button[label="Continuer"]');
    await waitFor(() => expect(continueBtn).not.toHaveAttribute('is-disabled', 'true'));

    // The ODS web-component button submits via ElementInternals, which jsdom does not
    // wire to the host <form>; submit the form directly to exercise handleSubmit -> checkout.
    const form = container.querySelector('form');
    await act(async () => {
      fireEvent.submit(form as HTMLFormElement);
      await Promise.resolve();
    });

    await waitFor(() => expect(checkoutMock).toHaveBeenCalledWith({ cartId: 'cart-1' }));
  });

  // TC-TNL-26 — checkout success forwards server data to onComplete
  it('forwards server data to onComplete on checkout success', async () => {
    const onComplete = vi.fn();
    const { container } = await renderStep1({ onComplete });
    await selectServer(container, 'ns1.eu');
    await waitFor(() => expect(createCartMock).toHaveBeenCalled());

    await act(async () => {
      checkoutCallbacks.onSuccess?.();
      await Promise.resolve();
    });
    expect(onComplete).toHaveBeenCalledWith({
      serverName: 'ns1.eu',
      serverIp: '1.2.3.4',
      serverRegion: 'GRA',
    });
  });

  // TC-TNL-27 / TC-TNL-06 — checkout error renders the banner + a payment-settings link when payment-related
  it('renders the checkout error banner with a payment-settings link on a payment error', async () => {
    const { container } = await renderStep1();
    await selectServer(container, 'ns1.eu');
    await waitFor(() => expect(createCartMock).toHaveBeenCalled());

    await act(async () => {
      checkoutCallbacks.onError?.({
        response: { data: { message: 'No payment method configured' } },
        message: 'No payment method configured',
      });
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(
        container.querySelector('ods-link[label="Configurer un moyen de paiement"]'),
      ).toBeInTheDocument(),
    );
  });

  // TC-TNL-12 — empty baremetals list disables the combobox and shows the order link
  it('disables the combobox and shows the order link when no server is available', async () => {
    useQueryMock.mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
    const { container } = await renderStep1();
    expect(container.querySelector('mock-combobox')).toHaveAttribute('is-disabled', 'true');
    expect(
      container.querySelector('ods-link[label="Commander un serveur Bare Metal"]'),
    ).toBeInTheDocument();
  });

  // TC-TNL-11 — baremetals fetch error shows a critical message + Retry
  it('shows a retry when the baremetals fetch fails', async () => {
    const refetch = vi.fn();
    useQueryMock.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch,
    });
    const { container } = await renderStep1();
    expect(screen.getByText(/chargement de vos serveurs Bare Metal/i)).toBeInTheDocument();
    await userEvent.click(container.querySelector('ods-button[label="Réessayer"]') as Element);
    expect(refetch).toHaveBeenCalled();
  });
});
