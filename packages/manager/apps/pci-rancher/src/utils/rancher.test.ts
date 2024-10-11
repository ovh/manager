import { rancherMocked } from '@/_mock_/rancher';
import {
  extractDriversAndPlanFromSwitchPlanError,
  getLatestVersionAvailable,
  getLatestVersions,
  getVersion,
  isValidRancherName,
  rancherErrorManagement,
} from './rancher';
import { versionsMocked } from '@/_mock_/version';

describe('Should validate rancher name', () => {
  it('When i add a valid rancher name', () => {
    expect(isValidRancherName('rancher1234')).toBe(true);
    expect(isValidRancherName('rancher1234-_.r')).toBe(true);
    expect(isValidRancherName('rANcher')).toBe(true);
    expect(
      isValidRancherName(
        '012345678901234567890123456789012345678901234567890123456789123',
      ),
    ).toBe(true);
  });

  describe('Invalid rancher name', () => {
    it('When i add invalid character in rancher name', () => {
      expect(isValidRancherName('ranche(r1xs23___4((')).toBe(false);
      expect(isValidRancherName('rancher1234-_.@')).toBe(false);
      expect(isValidRancherName('RancheR')).toBe(false);
    });

    it('When length is not valid', () => {
      expect(isValidRancherName('ra')).toBe(false);
      expect(
        isValidRancherName(
          '01234567890123456789012345678901234567890123456789012345678912345',
        ),
      ).toBe(false);
    });
    it('When i start with invalid character', () => {
      expect(isValidRancherName('-ran')).toBe(false);
      expect(isValidRancherName('.ran')).toBe(false);
      expect(isValidRancherName('_ran')).toBe(false);
      expect(isValidRancherName('ran-')).toBe(false);
    });
  });
});

describe('Rancher version', () => {
  it('When i get rancher version', () => {
    expect(getVersion(rancherMocked)).toBe(rancherMocked.currentState.version);
  });

  describe('Check latest version', () => {
    it('Should return latest version available', () => {
      expect(getLatestVersionAvailable(rancherMocked, versionsMocked)).toBe(
        versionsMocked.slice(-1)[0],
      );
    });

    it('Should return null if there is no version available', () => {
      expect(
        getLatestVersionAvailable(rancherMocked, [
          {
            name: '2.9.7',
            status: 'UNAVAILABLE',
            changelogUrl: 'https://www.ovh.com',
          },
        ]),
      ).toBe(null);
    });
  });

  it('Should not return version if there is no higher version', () => {
    expect(
      getLatestVersionAvailable(rancherMocked, [
        {
          name: '2.0.0',
          status: 'AVAILABLE',
          changelogUrl: 'https://www.ovh.com',
        },
      ]),
    ).toBe(null);
  });

  it('Should return sorted versions by oldest to latest', () => {
    expect(
      getLatestVersions(rancherMocked, [
        {
          name: '2.8.8',
          status: 'AVAILABLE',
          changelogUrl: 'https://www.ovh.com',
        },
        {
          name: '2.9.9',
          status: 'AVAILABLE',
          changelogUrl: 'https://www.ovh.com',
        },
        {
          name: '2.8.0',
          status: 'AVAILABLE',
          changelogUrl: 'https://www.ovh.com',
        },
      ]),
    ).toStrictEqual([
      {
        changelogUrl: 'https://www.ovh.com',
        name: '2.8.0',
        status: 'AVAILABLE',
      },
      {
        changelogUrl: 'https://www.ovh.com',
        name: '2.8.8',
        status: 'AVAILABLE',
      },
      {
        changelogUrl: 'https://www.ovh.com',
        name: '2.9.9',
        status: 'AVAILABLE',
      },
    ]);
  });
});

describe('extractDriversFromSwitchPlanError', () => {
  it.each([
    [
      'Unable to switch to plan OVHCLOUD_EDITION [driver1, driver2]',
      { drivers: ['driver1', ' driver2'], plan: 'OVHCLOUD_EDITION' },
    ],
    [
      'Unable to switch to plan STANDARD [driver3, driver4]',
      { drivers: ['driver3', ' driver4'], plan: 'STANDARD' },
    ],
    [
      'Unable to switch to plan OVHCLOUD_EDITION [ driver5 , driver6 ]',
      { drivers: ['driver5 ', ' driver6'], plan: 'OVHCLOUD_EDITION' },
    ],
    [
      'Unable to switch to plan STANDARD [ driver7 , driver8 ]',
      { drivers: ['driver7 ', ' driver8'], plan: 'STANDARD' },
    ],
    ['Invalid input string', null],
    ['Unable to switch to plan [driver9, driver10]', null],
    ['Unable to switch to plan OVHCLOUD_EDITION []', null],
  ])('should return %s', (inputString, expected) => {
    expect(extractDriversAndPlanFromSwitchPlanError(inputString)).toEqual(
      expected,
    );
  });
});

describe('rancherErrorManagement', () => {
  it.each([
    [
      {
        message: 'Internal Server Error',
        class: 'Server::InternalServerError',
      },
      ['createRancherErrorInternalServerError'],
    ],
    [
      {
        message: 'Unable to switch to plan OVHCLOUD_EDITION [driver1, driver2]',
        class: 'Client::BadRequest',
      },
      [
        'createRancherErrorInternalServerBadRequestChangePlan',
        { plan: 'OVHCLOUD_EDITION', drivers: '[driver1, driver2]' },
      ],
    ],
    [
      {
        message: 'Unable to switch to plan STANDARD [driver3, driver4]',
        class: 'Client::BadRequest',
      },
      [
        'createRancherErrorInternalServerBadRequestChangePlan',
        { plan: 'STANDARD', drivers: '[driver3, driver4]' },
      ],
    ],
    [
      { message: 'Invalid input string', class: 'Client::BadRequest' },
      [
        'createRancherError',
        { rancherCreationErrorMessage: 'Invalid input string' },
      ],
    ],
    [{ message: 'Unknown error', class: 'UnknownError' }, ['']],
  ])('should return %s', (error, expected) => {
    expect(rancherErrorManagement(error)).toEqual(expected);
  });
});
