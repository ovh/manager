import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { RenderResult, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ORDER_SUBMIT_ERROR_TEST_ID } from '@/components/order/OrderRecapPanel/OrderRecapPanel.component';
import { ORDER_TERMS_ERROR_TEST_ID } from '@/components/order/OrderTerms/OrderTerms.component';
import { getBackupServicesCatalog } from '@/data/api/catalog/catalog.requests';
import { mockOrderFunnelRequiredConfiguration } from '@/mocks/order/order.mock';
import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import {
  WatchedApiRequest,
  resolveApiRequests,
  stopWatchingApiCalls,
  watchApiRequests,
} from '@/test-utils/watchApiCalls';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

import OrderPage from './Order.page';

vi.mock('@/data/api/catalog/catalog.requests');
vi.mock('@/hooks/useMainGuideItem', () => ({ useMainGuideItem: () => [] }));

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
  const OdsCheckbox = ({
    onOdsChange,
    isChecked,
    isDisabled,
    inputId,
  }: {
    onOdsChange?: (event: CustomEvent) => void;
    isChecked?: boolean;
    isDisabled?: boolean;
    inputId?: string;
  }) => (
    <mock-checkbox
      id={inputId}
      is-checked={isChecked ? 'true' : undefined}
      is-disabled={isDisabled ? 'true' : undefined}
      ref={(node: HTMLElement | null) =>
        node?.addEventListener('odsChange', ((event: Event) =>
          onOdsChange?.(event as CustomEvent)) as EventListener)
      }
    />
  );
  return { ...actual, OdsCheckbox };
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'mock-checkbox': Record<string, unknown>;
    }
  }
}

// Page pleine (BaseLayout + StepComponent) : mêmes substituts DOM que
// `EditBackupServer.page.spec.tsx`, dont ce tunnel partage la structure.
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    Breadcrumb: () => null,
    ChangelogButton: () => null,
    GuideButton: () => null,
    BaseLayout: ({
      children,
      onClickReturn,
      backLinkLabel,
    }: {
      children?: React.ReactNode;
      onClickReturn?: () => void;
      backLinkLabel?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & Record<string, any>) => (
      <div data-testid="order-layout">
        <button
          type="button"
          data-testid="back-link"
          disabled={!onClickReturn}
          onClick={onClickReturn}
        >
          {backLinkLabel}
        </button>
        {children}
      </div>
    ),
    StepComponent: ({
      order,
      isOpen,
      isLocked,
      edit,
      next,
      children,
    }: {
      order: number;
      isOpen?: boolean;
      isLocked?: boolean;
      edit?: { action: (id: string) => void; label: string; isDisabled?: boolean };
      next?: { action: (id: string) => void; label: string; isDisabled?: boolean };
      children?: React.ReactNode;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & Record<string, any>) => (
      <section data-testid={`step-${order}`}>
        {edit?.action && isLocked && (
          <button
            type="button"
            data-testid={`step-${order}-edit`}
            disabled={edit.isDisabled}
            onClick={() => edit.action('id')}
          >
            {edit.label}
          </button>
        )}
        {isOpen && (
          <div data-testid={`step-${order}-content`}>
            {children}
            {next?.action && (
              <button
                type="button"
                data-testid={`step-${order}-next`}
                disabled={next.isDisabled}
                onClick={() => next.action('id')}
              >
                {next.label}
              </button>
            )}
          </div>
        )}
      </section>
    ),
  };
});

const DRAFT_STORAGE_KEY = 'hpc-backup-licenses.order-funnel';

/** Le tunnel entièrement rempli : le CTA de commande part au premier clic. */
const validDraft = {
  family: LicenseFamily.DATA_PLATFORM,
  tier: VdpTier.PREMIUM,
  form: {
    displayName: 'backup-prod-paris',
    backupServerExternalIp: '203.0.113.10',
    isBehindNat: false,
    backupServerPrivateIp: '',
    vaultDisplayName: 'vault-prod-paris',
    regionApiValue: 'eu-west-par',
  },
};

const renderOrderPage = (mockParams: MockParams = {}): Promise<RenderResult> => {
  setupMswMock({
    cartRequiredConfiguration: mockOrderFunnelRequiredConfiguration,
    ...mockParams,
  });
  window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(validDraft));

  return renderWithProviders(
    <Routes>
      <Route path="/linked-servers" element={<div data-testid="linked-servers" />} />
      <Route path="/order" element={<OrderPage />} />
    </Routes>,
    { initialEntries: ['/order'] },
  );
};

const submitButton = (container: Element) =>
  container.querySelector(`ods-button[label="${labels.order.summary.cta}"]`) as Element;

const clickSubmit = (container: Element) => fireEvent.click(submitButton(container));

const termsCheckbox = (container: Element) => container.querySelector('mock-checkbox');

const acceptTerms = async (container: Element) => {
  await waitFor(() => expect(termsCheckbox(container)).toBeInTheDocument());
  fireEvent(
    termsCheckbox(container) as Element,
    new CustomEvent('odsChange', { detail: { checked: true } }),
  );
  await waitFor(() => expect(submitButton(container)).toHaveAttribute('is-disabled', 'false'));
};

const persistedDraft = () => window.sessionStorage.getItem(DRAFT_STORAGE_KEY);

describe('OrderPage — submit', () => {
  let requests: Promise<WatchedApiRequest>[];

  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    vi.mocked(getBackupServicesCatalog).mockResolvedValue(undefined as never);
    requests = watchApiRequests('/order/cart');
  });

  afterEach(() => {
    stopWatchingApiCalls();
  });

  it('builds the cart as soon as the region is picked, without engaging anything', async () => {
    const { container } = await renderOrderPage();

    await waitFor(() => expect(termsCheckbox(container)).toBeInTheDocument());
    const emitted = await resolveApiRequests(requests);
    expect(emitted.filter(({ url }) => url.endsWith('/order/cart'))).toHaveLength(1);
    expect(
      emitted.filter(({ method, url }) => method === 'POST' && url.includes('/checkout')),
    ).toHaveLength(0);
  });

  it('shows the contracts the simulated checkout returned', async () => {
    const { container } = await renderOrderPage();

    await waitFor(() =>
      expect(container.querySelector('ods-link[label="Test contract"]')).toBeInTheDocument(),
    );
    expect(container.querySelector('ods-link[label="Test contract"]')).toHaveAttribute(
      'href',
      'https://example.test/contract',
    );
  });

  it('keeps the CTA disabled until the contracts are accepted', async () => {
    const { container } = await renderOrderPage();

    await waitFor(() => expect(termsCheckbox(container)).toBeInTheDocument());
    expect(submitButton(container)).toHaveAttribute('is-disabled', 'true');

    clickSubmit(container);

    await waitFor(() => expect(screen.queryByTestId('linked-servers')).not.toBeInTheDocument());
    const emitted = await resolveApiRequests(requests);
    expect(
      emitted.filter(({ method, url }) => method === 'POST' && url.includes('/checkout')),
    ).toHaveLength(0);
  });

  it('places the order, clears the draft and lands on the linked servers', async () => {
    const { container } = await renderOrderPage();

    await acceptTerms(container);
    clickSubmit(container);

    await waitFor(() => expect(screen.getByTestId('linked-servers')).toBeInTheDocument());
    const emitted = await resolveApiRequests(requests);
    expect(emitted.filter(({ url }) => url.endsWith('/order/cart'))).toHaveLength(1);
    expect(persistedDraft()).toBeNull();
    expect(screen.queryByTestId(ORDER_SUBMIT_ERROR_TEST_ID)).not.toBeInTheDocument();
  });

  it('locks the form and the CTA while the order is in flight, so one click means one order', async () => {
    // Retenir chaque écriture suffit à observer l'état en vol : la séquence en compte une dizaine,
    // et un délai plus long ferait expirer l'attente de la navigation finale.
    const { container } = await renderOrderPage({ orderDelay: 20 });

    await acceptTerms(container);
    clickSubmit(container);

    await waitFor(() => expect(submitButton(container)).toHaveAttribute('is-loading', 'true'));
    expect(submitButton(container)).toHaveAttribute('is-disabled', 'true');
    expect(screen.getByTestId('back-link')).toBeDisabled();
    expect(screen.getByTestId('step-1-edit')).toBeDisabled();

    // Re-cliquer pendant la soumission : le garde-fou du handler tient même si ODS laissait
    // l'événement passer sur un bouton désactivé.
    clickSubmit(container);
    clickSubmit(container);

    await waitFor(() => expect(screen.getByTestId('linked-servers')).toBeInTheDocument());
    const emitted = await resolveApiRequests(requests);
    expect(
      emitted.filter(({ method, url }) => method === 'POST' && url.includes('/checkout')),
    ).toHaveLength(1);
  });

  it('keeps the form and its draft, and stays on the page, when the order fails', async () => {
    const { container } = await renderOrderPage({ isCheckoutError: true });

    await acceptTerms(container);
    clickSubmit(container);

    await waitFor(() => expect(screen.getByTestId(ORDER_SUBMIT_ERROR_TEST_ID)).toBeInTheDocument());
    expect(screen.getByTestId(ORDER_SUBMIT_ERROR_TEST_ID)).toHaveTextContent(
      labels.order.error.submit,
    );
    expect(screen.queryByTestId('linked-servers')).not.toBeInTheDocument();
    expect(JSON.parse(persistedDraft() as string)).toEqual(validDraft);
    expect(screen.getByText('vault-prod-paris')).toBeInTheDocument();
  });

  it('announces the failure and takes focus to it', async () => {
    const { container } = await renderOrderPage({ isCheckoutError: true });

    await acceptTerms(container);
    clickSubmit(container);

    await waitFor(() => expect(screen.getByTestId(ORDER_SUBMIT_ERROR_TEST_ID)).toBeInTheDocument());
    const liveRegion = screen.getByRole('alert');
    expect(liveRegion).toContainElement(screen.getByTestId(ORDER_SUBMIT_ERROR_TEST_ID));
    expect(liveRegion).toHaveFocus();
  });

  it('re-enables the CTA after a failure so the customer can retry the same cart', async () => {
    const { container } = await renderOrderPage({ isCheckoutError: true });

    await acceptTerms(container);
    clickSubmit(container);

    await waitFor(() => expect(screen.getByTestId(ORDER_SUBMIT_ERROR_TEST_ID)).toBeInTheDocument());
    expect(submitButton(container)).toHaveAttribute('is-disabled', 'false');
  });

  it('reports a cart that could not be prepared, and offers to retry it', async () => {
    const { container } = await renderOrderPage({ isOrderError: true });

    await waitFor(() => expect(screen.getByTestId(ORDER_TERMS_ERROR_TEST_ID)).toBeInTheDocument());
    expect(termsCheckbox(container)).not.toBeInTheDocument();
    expect(submitButton(container)).toHaveAttribute('is-disabled', 'true');
  });
});
