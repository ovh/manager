import { vi } from 'vitest';

let mockUser = {
  ovhSubsidiary: 'FR',
  kycValidated: true,
};

const mockPlugins = vi.hoisted(() => ({
  environment: {
    getEnvironment: () => ({
      getRegion: vi.fn(() => 'EU'),
      getUser: vi.fn(() => mockUser),
    }),
  },
  navigation: {
    getURL: vi.fn(
      (app, hash) => `https://manager.eu.ovhcloud.com/#/${hash.replace('#', app)}`,
    ),
    navigateTo: vi.fn(() => {}),
  },
  tracking: {
    trackClick: vi.fn(),
  },
  ux: {
    openLiveChat: vi.fn(),
  },
}));

const mockShell = vi.hoisted(() => ({
  shell: {
    getPlugin: (plugin: string) => {
      return mockPlugins[plugin as keyof typeof mockPlugins];
    },
  },
}));

export { mockPlugins, mockShell, mockUser };
