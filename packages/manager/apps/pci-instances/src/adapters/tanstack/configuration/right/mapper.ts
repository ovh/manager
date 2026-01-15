import {
  TSshKey,
  TBackupConfiguration,
  TBackupPrice,
} from '@/domain/entities/configuration';
import { TSshKeyDTO, TBackupConfigurationDTO } from './dto.type';

export const mapSshKeyDtoToSshKeyEntity = (
  sshKeysDTO: TSshKeyDTO[],
): TSshKey[] =>
  sshKeysDTO.map(({ name, regions }) => ({
    name,
    regions,
  }));

export const mapBackupConfigurationDtoToEntity = (
  backupConfigurationDTO: TBackupConfigurationDTO,
): TBackupConfiguration[] => {
  const backupModel = backupConfigurationDTO.models.find(
    (model) => model.name === 'instanceBackup',
  );

  if (!backupModel) {
    return [];
  }

  return backupConfigurationDTO.regions.map((region) => {
    const prices: TBackupPrice[] = backupModel.pricings
      .filter(({ regions }) => regions.includes(region.name))
      .map((pricing) => ({
        currencyCode: pricing.price.currencyCode,
        priceInUcents: pricing.price.priceInUcents,
        text: pricing.price.text,
        value: pricing.price.value,
        type: pricing.interval,
      }));

    return {
      region: region.name,
      autoBackupEnabled: region.distantAutoBackupEnabled,
      prices,
    };
  });
};
