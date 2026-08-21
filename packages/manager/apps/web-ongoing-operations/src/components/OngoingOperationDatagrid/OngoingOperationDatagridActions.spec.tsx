import { navigateMock } from '@/setupTests';
import React from 'react';
import { Mock, describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import OngoingOperationDatagridActions from '@/components/OngoingOperationDatagrid/OngoingOperationDatagridActions';
import { usePendingFoas } from '@/hooks/data/query';
import { wrapper } from '@/utils/test.provider';
import { TFoa, TOngoingOperations } from '@/types';

const tradeTaskId = 'f0a1c2d3-0000-4a1b-9b7e-000000000001';

const tradeOperation: TOngoingOperations = {
  id: 42,
  domain: 'change-of-registrant.ovh',
  status: 'todo',
  function: 'DomainTrade',
  todoDate: '2026-08-10T09:12:00+02:00',
  creationDate: '2026-08-10T09:12:00+02:00',
  lastUpdate: '2026-08-12T14:40:00+02:00',
  canCancel: false,
  canRelaunch: false,
  canAccelerate: false,
};

/** The two FOAs of a trade, the second one already answered by its holder */
const foas: TFoa[] = [
  { id: 'foa-current-holder', currentState: { STATUS: 'WAITING' } },
  {
    id: 'foa-new-holder',
    currentState: { STATUS: 'ANSWERED', CHOICE: 'ACCEPT' },
  },
];

vi.mock('@/hooks/data/query', () => ({
  usePendingFoas: vi.fn(),
}));

const mockPendingFoas = ({
  taskId = tradeTaskId,
  pendingFoas = foas.slice(0, 1),
}: { taskId?: string | null; pendingFoas?: TFoa[] } = {}) => {
  (usePendingFoas as Mock).mockReturnValue({
    taskId,
    foas,
    pendingFoas,
    isLoading: false,
  });
};

const renderActions = (operation: TOngoingOperations = tradeOperation) => {
  const { container } = render(
    <OngoingOperationDatagridActions props={operation} />,
    { wrapper },
  );
  // the menu items are ods-button custom elements, only labelled by attribute
  return {
    trigger: container.querySelector(
      '[data-testid="navigation-action-trigger-action"]',
    ),
    foaItem: container.querySelector(
      'ods-button[label="domain_operations_foa_cta"]',
    ),
  };
};

describe('OngoingOperationDatagridActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('offers the designated agent validation on a trade with a pending foa', () => {
    mockPendingFoas();
    const { trigger, foaItem } = renderActions();

    expect(foaItem?.className).not.toContain('hidden');
    expect(trigger).toHaveAttribute('is-disabled', 'false');
  });

  it('navigates to the certification page of the operation', () => {
    mockPendingFoas();
    const { foaItem } = renderActions();

    fireEvent.click(foaItem as Element);

    expect(navigateMock).toHaveBeenCalledWith(`/foa/${tradeOperation.id}`);
  });

  it('hides the entry point when every foa has already been answered', () => {
    mockPendingFoas({ pendingFoas: [] });
    const { trigger, foaItem } = renderActions();

    expect(foaItem?.className).toContain('hidden');
    expect(trigger).toHaveAttribute('is-disabled', 'true');
  });

  it('hides the entry point when the task carries no foa', () => {
    mockPendingFoas({ taskId: null, pendingFoas: [] });
    const { foaItem } = renderActions();

    expect(foaItem?.className).toContain('hidden');
  });

  it('keeps the menu usable on a trade whose other actions are available', () => {
    mockPendingFoas({ pendingFoas: [] });
    const { trigger } = renderActions({
      ...tradeOperation,
      canCancel: true,
    });

    expect(trigger).toHaveAttribute('is-disabled', 'false');
  });

  it('does not look for foas on an operation that is not a trade', () => {
    mockPendingFoas({ taskId: null, pendingFoas: [] });
    const { foaItem } = renderActions({
      ...tradeOperation,
      function: 'DomainDnsUpdate',
    });

    expect(usePendingFoas).toHaveBeenCalledWith(tradeOperation.domain, false);
    expect(foaItem?.className).toContain('hidden');
  });
});
