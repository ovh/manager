import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initAIChatbotModule } from './module-federation-runtime';
import { init } from '@module-federation/runtime';

vi.mock('@module-federation/runtime', () => ({
  init: vi.fn(),
}));

describe('module-federation-runtime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize Module Federation with aiChatbot remote', () => {
    initAIChatbotModule();

    expect(init).toHaveBeenCalledWith({
      name: 'manager-container',
      remotes: [
        {
          name: 'aiChatbot',
          entry: expect.any(String),
          type: 'module',
        },
      ],
    });
  });
});
