import { describe, it, expect } from 'vitest';
import { mockedBackupConfigurationEntity } from '@/__mocks__/instance/constants';
import { selectLocalBackupConfigurations } from '../backupConfigurationViewModel';

describe('selectLocalBackupConfigurations ViewModel', () => {
  it('should return null when microRegion is null', () => {
    const result = selectLocalBackupConfigurations(null)(
      mockedBackupConfigurationEntity,
    );
    expect(result).toBeNull();
  });

  it('should return null when backupConfigurations is not defined', () => {
    const result = selectLocalBackupConfigurations('GRA11')([]);
    expect(result).toBeNull();
  });

  it('should return null when microRegion is not found in backupConfiguration', () => {
    const result = selectLocalBackupConfigurations('NONEXISTENT')(
      mockedBackupConfigurationEntity,
    );
    expect(result).toBeNull();
  });

  it('should return configuration object when microRegion is found', () => {
    const result = selectLocalBackupConfigurations('GRA11')(
      mockedBackupConfigurationEntity,
    );
    expect(result).toStrictEqual({
      items: [
        {
          rotation: '7',
          isEnabled: true,
        },
        {
          rotation: '14',
          isEnabled: true,
        },
        {
          rotation: 'custom',
          isEnabled: false,
          badge: 'Coming soon',
        },
      ],
      price: 10000 * 730,
    });
  });
});
