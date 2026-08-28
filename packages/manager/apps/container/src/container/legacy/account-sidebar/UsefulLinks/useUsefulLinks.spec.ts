import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DIGITAL_AGENT_URL } from '@/container/common/digital-agent';

import useUsefulLinks from './useUsefulLinks';

const mocks = vi.hoisted(() => ({
  user: { ovhSubsidiary: 'FR' },
  region: 'EU',
  openLiveChat: vi.fn(),
  isLivechatEnabled: true,
}));

vi.mock('@/context/useApplicationContext', () => ({
  useShell: () => ({
    getPlugin: (plugin: string) =>
      ({
        environment: {
          getEnvironment: () => ({
            getRegion: () => mocks.region,
            getUser: () => mocks.user,
          }),
        },
        navigation: { getURL: (app: string, hash: string) => `${app}${hash}` },
        ux: { openLiveChat: mocks.openLiveChat },
      }[plugin]),
  }),
}));

vi.mock('@/core/container', () => ({
  default: () => ({
    isLivechatEnabled: mocks.isLivechatEnabled,
    setChatbotReduced: vi.fn(),
  }),
}));

const getLink = (id: string) =>
  renderHook(() => useUsefulLinks())
    .result.current.getUsefulLinks()
    .find((link) => link.id === id);

describe('useUsefulLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.region = 'EU';
    mocks.user = { ovhSubsidiary: 'FR' };
    mocks.isLivechatEnabled = true;
  });

  it('points the create ticket and live chat links to the digital agent for FR on EU', () => {
    expect(getLink('createTicket')).toMatchObject({
      href: DIGITAL_AGENT_URL,
      external: false,
    });
    expect(getLink('chatbot')).toMatchObject({
      href: DIGITAL_AGENT_URL,
      external: false,
    });
    expect(getLink('chatbot').action).toBeUndefined();
  });

  it('keeps the help center links for the other subsidiaries', () => {
    mocks.user = { ovhSubsidiary: 'GB' };

    expect(getLink('createTicket')).toMatchObject({
      href:
        'https://help.ovhcloud.com/csm?id=csm_get_help&ovhSubsidiary=GB',
      external: true,
    });
    expect(getLink('chatbot').href).toBeUndefined();

    getLink('chatbot').action();
    expect(mocks.openLiveChat).toHaveBeenCalled();
  });

  it('keeps the help center links for FR customers outside of the EU manager', () => {
    mocks.region = 'CA';

    expect(getLink('createTicket')).toMatchObject({
      href:
        'https://help.ovhcloud.com/csm?id=csm_get_help&ovhSubsidiary=FR',
      external: true,
    });
    expect(getLink('chatbot').href).toBeUndefined();
  });
});
