import React from 'react';

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SupportConversation } from '@/types/support.type';

import { useHubSupportTickets } from './useHubSupportTickets';

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(() => 'EU'),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
  hubSupport: { data: undefined, isLoading: false, error: null, refetch: vi.fn() } as Record<
    string,
    unknown
  >,
  conversations: { data: undefined, isLoading: false, error: null, refetch: vi.fn() } as Record<
    string,
    unknown
  >,
  useFetchHubSupport: vi.fn(),
  useSupportConversations: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({ environment: mocks.environment }),
}));

vi.mock('@/data/hooks/apiHubSupport/useHubSupport', () => ({
  useFetchHubSupport: (options: { enabled: boolean }) => {
    mocks.useFetchHubSupport(options);
    return mocks.hubSupport;
  },
}));

vi.mock('@/data/hooks/apiSupportConversation/useSupportConversations', () => ({
  useSupportConversations: (options: { enabled: boolean }) => {
    mocks.useSupportConversations(options);
    return mocks.conversations;
  },
}));

const conversation = (id: string, number: string): SupportConversation => ({
  id,
  name: `subject ${number}`,
  createdOn: '2026-08-01T10:00:00+02:00',
  modifiedOn: '2026-08-02T10:00:00+02:00',
  state: 'awaiting-info',
  type: 'standard',
  ticket: { number },
});

describe('useHubSupportTickets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.environment.getRegion.mockReturnValue('EU');
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'FR' });
    mocks.hubSupport.data = undefined;
    mocks.conversations.data = undefined;
  });

  it('sources FR customers on EU from /support/conversation only', () => {
    mocks.conversations.data = [conversation('uuid-1', 'CS123')];

    const { result } = renderHook(() => useHubSupportTickets());

    expect(mocks.useFetchHubSupport).toHaveBeenCalledWith({ enabled: false });
    expect(mocks.useSupportConversations).toHaveBeenCalledWith({ enabled: true });
    expect(result.current.isDigitalAgent).toBe(true);
    expect(result.current.tickets).toEqual([
      {
        key: 'uuid-1',
        label: '#CS123',
        subject: 'subject CS123',
        // awaiting-info has no V6 translation: the query only asks for open states
        state: 'open',
        ticketId: 'CS123',
        conversationId: 'uuid-1',
      },
    ]);
    expect(result.current.count).toBe(1);
  });

  it('drops conversations without a ticket', () => {
    mocks.conversations.data = [
      { ...conversation('uuid-1', 'CS123'), ticket: null },
      conversation('uuid-2', 'CS456'),
    ];

    const { result } = renderHook(() => useHubSupportTickets());

    expect(result.current.tickets.map((t) => t.key)).toEqual(['uuid-2']);
  });

  it('keeps /hub/support for the other subsidiaries', () => {
    mocks.environment.getUser.mockReturnValue({ ovhSubsidiary: 'GB' });
    mocks.hubSupport.data = {
      count: 7,
      data: [{ ticketId: 123, serviceName: 'Service A', subject: 'Subject A', state: 'open' }],
    };

    const { result } = renderHook(() => useHubSupportTickets());

    expect(mocks.useFetchHubSupport).toHaveBeenCalledWith({ enabled: true });
    expect(mocks.useSupportConversations).toHaveBeenCalledWith({ enabled: false });
    expect(result.current.isDigitalAgent).toBe(false);
    expect(result.current.tickets).toEqual([
      {
        key: '123',
        label: 'Service A',
        subject: 'Subject A',
        state: 'open',
        ticketId: '123',
      },
    ]);
    // the 2api count is the grand total, not the page size
    expect(result.current.count).toBe(7);
  });

  it('keeps /hub/support for FR customers outside of the EU manager', () => {
    mocks.environment.getRegion.mockReturnValue('CA');

    renderHook(() => useHubSupportTickets());

    expect(mocks.useFetchHubSupport).toHaveBeenCalledWith({ enabled: true });
    expect(mocks.useSupportConversations).toHaveBeenCalledWith({ enabled: false });
  });

  it('reports the state of the active query only', () => {
    mocks.conversations.isLoading = true;
    mocks.hubSupport.isLoading = false;

    const { result } = renderHook(() => useHubSupportTickets());

    expect(result.current.isLoading).toBe(true);
    mocks.conversations.isLoading = false;
  });
});
