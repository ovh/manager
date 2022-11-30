import { loadFeature, defineFeature } from 'jest-cucumber';
import auth from '../../../src/plugin/auth';

const feature = loadFeature('../../../features/plugin/auth/auth.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let authPlugin;
  const loginFn = jest.fn();
  const logoutFn = jest.fn();

  test('Log in', ({ given, when, then }) => {
    given('An authentication plugin', () => {
      authPlugin = auth({
        goToLogin: loginFn,
        goToLogout: logoutFn,
      });
    });

    when('I try to log in', () => {
      authPlugin.login();
    });

    then('I should go to the login page', () => {
      expect(loginFn).toHaveBeenCalled();
    });
  });

  test('Log out', ({ given, when, then }) => {
    given('An authentication plugin', () => {
      authPlugin = auth({
        goToLogin: loginFn,
        goToLogout: logoutFn,
      });
    });

    when('I try to log out', () => {
      authPlugin.logout();
    });

    then('I should go to the logout page', () => {
      expect(logoutFn).toHaveBeenCalled();
    });
  });
});
