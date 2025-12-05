import { TSshKey } from '@/domain/entities/configuration';
import { TSshKeyDTO } from './dto.type';

export const mapSshKeyDtoToSshKeyEntity = (
  sshKeysDTO: TSshKeyDTO[],
): TSshKey[] =>
  sshKeysDTO.map(({ id, name, fingerPrint, publicKey, region }) => ({
    id,
    name,
    fingerPrint,
    publicKey,
    region,
  }));
