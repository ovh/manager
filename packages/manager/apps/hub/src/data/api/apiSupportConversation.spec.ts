import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSupportConversations } from './apiSupportConversation';

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }));

vi.mock('@ovh-ux/manager-core-api', () => ({ v6: { get: getMock } }));

describe('getSupportConversations', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({ data: [] });
  });

  it('calls apiv6 with the same query as the V7 dashboard', async () => {
    await getSupportConversations();

    expect(getMock).toHaveBeenCalledTimes(1);
    const [url, config] = getMock.mock.calls[0] as [
      string,
      { params: URLSearchParams; headers: Record<string, string> },
    ];

    expect(url).toBe('/support/conversation');
    // repeated `state` params, no `state[]` brackets
    expect(config.params.toString()).toBe(
      'ticketCreated=true&type=standard&state=new&state=open&state=awaiting-info&sort=modified-on-desc',
    );
    expect(config.headers).toEqual({
      'X-Pagination-Size': '4',
      'X-Pagination-Cursor': '1',
    });
  });

  it('returns the conversation list as-is', async () => {
    const conversations = [{ id: 'uuid-1' }];
    getMock.mockResolvedValue({ data: conversations });

    await expect(getSupportConversations()).resolves.toBe(conversations);
  });
});
