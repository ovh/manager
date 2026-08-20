import { navigateMock } from '@/setupTests';
import React from 'react';
import { Mock, describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import UpdateFoaComponent from '@/components/Update/Content/Update.Foa.component';
import {
  useDomain,
  useGetDomainInformation,
  usePendingFoas,
} from '@/hooks/data/query';
import { validateFoa } from '@/data/api/foa';
import { AlldomOperationsEnum } from '@/constants';
import { StatusEnum } from '@/enum/status.enum';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { isPendingFoa } from '@/utils/foa.utils';
import { wrapper } from '@/utils/test.provider';
import { domain } from '@/__mocks__/domain';
import { TFoa, TOngoingOperations } from '@/types';

const domainName = 'change-of-registrant.ovh';
const taskId = 'f0a1c2d3-0000-4a1b-9b7e-000000000001';

const tradeOperation: TOngoingOperations = {
  id: 42,
  domain: domainName,
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
const answeredFoas: TFoa[] = [
  { id: 'foa-current-holder', currentState: { STATUS: 'WAITING' } },
  {
    id: 'foa-new-holder',
    currentState: { STATUS: 'ANSWERED', CHOICE: 'ACCEPT' },
  },
];

const pendingFoas: TFoa[] = [
  { id: 'foa-current-holder', currentState: { STATUS: 'WAITING' } },
  { id: 'foa-new-holder', currentState: {} },
];

vi.mock('@/hooks/data/query', () => ({
  useDomain: vi.fn(),
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

vi.mock('@/data/api/foa', () => ({
  validateFoa: vi.fn(),
}));

const mockQueries = ({
  operation = tradeOperation,
  foas = answeredFoas,
  isDesignatedAgentAllowed = true,
}: {
  operation?: unknown;
  foas?: TFoa[];
  isDesignatedAgentAllowed?: boolean;
} = {}) => {
  (useDomain as Mock).mockReturnValue({ data: operation, isLoading: false });
  (usePendingFoas as Mock).mockReturnValue({
    taskId: taskId,
    foas,
    pendingFoas: foas.filter(isPendingFoa),
    isDesignatedAgentAllowed,
    isLoading: false,
  });
};

const getCheckbox = () => screen.getByRole('checkbox');
const getButton = (name: string) =>
  screen.getByRole('button', { name }) as HTMLButtonElement;

describe('UpdateFoaComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServiceInfo();
    (validateFoa as Mock).mockResolvedValue(undefined);
  });

  it('keeps the validation buttons disabled until the certification is ticked', async () => {
    mockQueries();
    const { container } = render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByText('domain_operations_foa_title')).toBeInTheDocument();
    expect(
      screen.getByText('domain_operations_foa_certification'),
    ).toBeInTheDocument();
    expect(getButton('domain_operations_foa_accept').disabled).toBe(true);
    expect(getButton('domain_operations_foa_reject').disabled).toBe(true);
    expect(getButton(`${NAMESPACES.ACTIONS}:cancel`).disabled).toBe(false);

    fireEvent.click(getCheckbox());

    await waitFor(() => {
      expect(getButton('domain_operations_foa_accept').disabled).toBe(false);
    });
    expect(getButton('domain_operations_foa_reject').disabled).toBe(false);

    await expect(container).toBeAccessible({
      rules: {
        'heading-order': { enabled: false },
      },
    });
  });

  it('lays the actions out like the v8 modal, primary action last', () => {
    mockQueries();
    render(<UpdateFoaComponent />, { wrapper });

    const order = screen
      .getAllByRole('button')
      .map((button) => button.getAttribute('name'))
      .filter((name): name is string => name !== null);

    expect(order).toEqual(['cancel', 'reject', 'accept']);
  });

  it('validates every still pending foa of the task on accept', async () => {
    mockQueries({ foas: pendingFoas });
    render(<UpdateFoaComponent />, { wrapper });

    fireEvent.click(getCheckbox());
    await waitFor(() => {
      expect(getButton('domain_operations_foa_accept').disabled).toBe(false);
    });
    fireEvent.click(getButton('domain_operations_foa_accept'));

    await waitFor(() => {
      expect(validateFoa).toHaveBeenCalledTimes(2);
    });
    expect(validateFoa).toHaveBeenNthCalledWith(
      1,
      domainName,
      taskId,
      'foa-current-holder',
      FoaChoiceEnum.Accept,
    );
    expect(validateFoa).toHaveBeenNthCalledWith(
      2,
      domainName,
      taskId,
      'foa-new-holder',
      FoaChoiceEnum.Accept,
    );
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/domain');
    });
  });

  it('skips the foas already answered and rejects with the reject choice', async () => {
    mockQueries();
    render(<UpdateFoaComponent />, { wrapper });

    fireEvent.click(getCheckbox());
    await waitFor(() => {
      expect(getButton('domain_operations_foa_reject').disabled).toBe(false);
    });
    fireEvent.click(getButton('domain_operations_foa_reject'));

    await waitFor(() => {
      expect(validateFoa).toHaveBeenCalledTimes(1);
    });
    expect(validateFoa).toHaveBeenCalledWith(
      domainName,
      taskId,
      'foa-current-holder',
      FoaChoiceEnum.Reject,
    );
  });

  it('treats an already finalized foa as an idempotent success', async () => {
    mockQueries();
    (validateFoa as Mock).mockRejectedValue({ response: { status: 409 } });
    render(<UpdateFoaComponent />, { wrapper });

    fireEvent.click(getCheckbox());
    await waitFor(() => {
      expect(getButton('domain_operations_foa_accept').disabled).toBe(false);
    });
    fireEvent.click(getButton('domain_operations_foa_accept'));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/domain');
    });
  });

  it('keeps the user on the page when the validation fails', async () => {
    mockQueries();
    (validateFoa as Mock).mockRejectedValue({ response: { status: 400 } });
    render(<UpdateFoaComponent />, { wrapper });

    fireEvent.click(getCheckbox());
    await waitFor(() => {
      expect(getButton('domain_operations_foa_accept').disabled).toBe(false);
    });
    fireEvent.click(getButton('domain_operations_foa_accept'));

    await waitFor(() => {
      expect(
        screen.getByText('domain_operations_foa_error'),
      ).toBeInTheDocument();
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('is not reachable when the operation is not a change of registrant', () => {
    mockQueries({ operation: domain[0] });
    render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByText('404 - route not found')).toBeInTheDocument();
  });

  // The designated agent only exists for domain operations : a crafted
  // /alldom/foa/:id or /dns/foa/:id url must dead-end. An alldom task resolves
  // on /me/task/domain/{id} but is not a trade ; a dns task id 404s there, so
  // the operation stays undefined.
  it('is not reachable for an alldom operation', () => {
    mockQueries({
      operation: { ...tradeOperation, function: AlldomOperationsEnum.AlldomDelete },
      foas: pendingFoas,
    });
    render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByText('404 - route not found')).toBeInTheDocument();
  });

  it('is not reachable for a dns task id, unknown to /me/task/domain', () => {
    // null, not undefined : undefined would fall back to the default operation
    mockQueries({ operation: null, foas: pendingFoas });
    render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByText('404 - route not found')).toBeInTheDocument();
  });

  // The certification page is a plain route : a bookmark, a back navigation
  // or a hand written url must not reopen the validation of a trade that is
  // already over.
  it('is not reachable once the operation is over', () => {
    [StatusEnum.DONE, StatusEnum.CANCELLED].forEach((status) => {
      mockQueries({
        operation: { ...tradeOperation, status },
        foas: pendingFoas,
      });
      const { unmount } = render(<UpdateFoaComponent />, { wrapper });

      expect(screen.getByText('404 - route not found')).toBeInTheDocument();
      expect(usePendingFoas).toHaveBeenCalledWith(domainName, false);
      unmount();
    });
  });

  it('is not reachable when the registry forbids the designated agent', () => {
    mockQueries({ isDesignatedAgentAllowed: false });
    render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByText('404 - route not found')).toBeInTheDocument();
  });

  it('is not reachable when every foa has already been answered', () => {
    mockQueries({ foas: [{ id: 'foa-1', currentState: { CHOICE: 'ACCEPT' } }] });
    render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByText('404 - route not found')).toBeInTheDocument();
  });

  it('locks the certification and the outcomes for a non admin contact', () => {
    mockQueries();
    mockServiceInfo('other-contact-ovh');
    render(<UpdateFoaComponent />, { wrapper });

    expect(screen.getByTestId('foa-not-admin')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'domain_operations_foa_accept' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'domain_operations_foa_reject' }),
    ).not.toBeInTheDocument();
    // leaving the screen must stay possible
    expect(
      screen.getByRole('button', { name: `${NAMESPACES.ACTIONS}:cancel` }),
    ).toBeInTheDocument();
  });
});
