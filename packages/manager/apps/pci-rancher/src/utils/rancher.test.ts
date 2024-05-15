import { rancherMocked } from '@/_mock_/rancher';
import {
  getLatestVersionAvailable,
  getVersion,
  isValidRancherName,
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
});
