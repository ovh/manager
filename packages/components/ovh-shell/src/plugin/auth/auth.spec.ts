import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import auth from '.';

describe('Shell Tests', () => {
  const loginFn = vi.fn();
  const logoutFn = vi.fn();

  it('Log in', () => {
    // Given: An authentication plugin

    const authPlugin = auth({
      goToLogin: loginFn,
      goToLogout: logoutFn,
    });

    (authPlugin.login as (onsuccessUrl?: string) => void)();

    expect(loginFn).toHaveBeenCalled();
  });

  it('Log out', () => {
    // Given: An authentication plugin

    const authPlugin = auth({
      goToLogin: loginFn,
      goToLogout: logoutFn,
    });

    (authPlugin.logout as () => void)();

    expect(logoutFn).toHaveBeenCalled();
  });
});
