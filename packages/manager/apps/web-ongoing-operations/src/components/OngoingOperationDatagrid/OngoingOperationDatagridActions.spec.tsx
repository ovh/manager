import { navigateMock } from '@/setupTests';
import React from 'react';
import { Mock, describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import OngoingOperationDatagridActions from '@/components/OngoingOperationDatagrid/OngoingOperationDatagridActions';
import { usePendingFoas, useGetDomainInformation } from '@/hooks/data/query';
import { AlldomOperationsEnum, DNSOperationsEnum } from '@/constants';
import { StatusEnum } from '@/enum/status.enum';
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
  useGetDomainInformation: vi.fn(),
}));

// setupTests mocks useNichandle to 'ca0000-ovh' : same handle = admin contact
const adminHandle = 'ca0000-ovh';
const mockServiceInfo = (contactAdminId: string | null = adminHandle) => {
  (useGetDomainInformation as Mock).mockReturnValue({
    data: contactAdminId ? { contactAdmin: { id: contactAdminId } } : undefined,
  });
};

const mockPendingFoas = ({
  taskId = tradeTaskId,
  pendingFoas = foas.slice(0, 1),
  isDesignatedAgentAllowed = true,
}: {
  taskId?: string | null;
  pendingFoas?: TFoa[];
  isDesignatedAgentAllowed?: boolean;
} = {}) => {
  (usePendingFoas as Mock).mockReturnValue({
    taskId,
    foas,
    pendingFoas,
    isDesignatedAgentAllowed,
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
    mockServiceInfo();
  });

  it('offers the designated agent validation on a trade with a pending foa', () => {
    mockPendingFoas();
    const { trigger, foaItem } = renderActions();

    expect(foaItem?.className).not.toContain('hidden');
    expect(trigger).toHaveAttribute('is-disabled', 'false');
  });

  it('navigates to the certification page of the operation', () => {
    // The url is appended to the current pathname, the listing of a product
    // section, matching the ':product/foa/:id' route pattern
    (useLocation as Mock).mockReturnValue({ pathname: '/domain', search: '' });
    mockPendingFoas();
    const { foaItem } = renderActions();

    fireEvent.click(foaItem as Element);

    expect(navigateMock).toHaveBeenCalledWith(
      `/domain/foa/${tradeOperation.id}`,
    );
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

  // A trade may be listed long after it ended : nothing can be validated on
  // it anymore, whatever the APIv2 task list still returns for the domain.
  it('hides the entry point on a trade that is over', () => {
    mockPendingFoas();
    [StatusEnum.DONE, StatusEnum.CANCELLED].forEach((status) => {
      const { foaItem } = renderActions({ ...tradeOperation, status });

      expect(foaItem?.className).toContain('hidden');
      expect(usePendingFoas).toHaveBeenCalledWith(tradeOperation.domain, false);
    });
  });

  it('still offers the validation on a trade in error or in problem', () => {
    mockPendingFoas();
    [StatusEnum.DOING, StatusEnum.ERROR, StatusEnum.PROBLEM].forEach(
      (status) => {
        const { foaItem } = renderActions({ ...tradeOperation, status });

        expect(foaItem?.className).not.toContain('hidden');
      },
    );
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

  // The designated agent only exists for domain operations. The alldom and
  // dns sections are fed by disjoint datasets (/me/task/domain?type=alldom
  // and /me/task/dns) whose functions can never be DomainTrade, so the
  // DomainTrade gate above is the structural guarantee — these two cases lock
  // it against a function ever leaking from those sections.
  it('never offers the validation on an alldom operation', () => {
    mockPendingFoas({ taskId: null, pendingFoas: [] });
    const { foaItem } = renderActions({
      ...tradeOperation,
      domain: 'alldom-pack',
      function: AlldomOperationsEnum.AlldomDelete,
    });

    expect(usePendingFoas).toHaveBeenCalledWith('alldom-pack', false);
    expect(foaItem?.className).toContain('hidden');
  });

  it('never offers the validation on a dns zone operation', () => {
    mockPendingFoas({ taskId: null, pendingFoas: [] });
    const { foaItem } = renderActions({
      ...tradeOperation,
      domain: undefined,
      zone: 'zone-of-registrant.ovh',
      function: DNSOperationsEnum.ZoneCreate,
    });

    // a dns row carries a zone, not a domain : the lookup is doubly disabled
    expect(usePendingFoas).toHaveBeenCalledWith('', false);
    expect(foaItem?.className).toContain('hidden');
  });

  it('hides the entry point when the registry forbids the designated agent', () => {
    mockPendingFoas({ isDesignatedAgentAllowed: false });
    const { foaItem } = renderActions();

    expect(foaItem?.className).toContain('hidden');
  });

  it('does not offer the validation to a contact who is not the domain admin', () => {
    mockPendingFoas();
    mockServiceInfo('other-contact-ovh');
    const { foaItem } = renderActions();

    expect(foaItem?.className).toContain('hidden');
  });

  it('falls open when the service info is unknown, the api stays the real gate', () => {
    mockPendingFoas();
    mockServiceInfo(null);
    const { foaItem } = renderActions();

    expect(foaItem?.className).not.toContain('hidden');
  });
});
