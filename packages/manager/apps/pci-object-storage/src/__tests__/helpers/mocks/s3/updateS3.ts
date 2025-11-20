import { StorageContainerUpdate } from '@datatr-ux/ovhcloud-types/cloud/index';
import storages from '@/types/Storages';
import { mockedTag } from '../tag/tag';

export const mockedUpdateS3Data: StorageContainerUpdate = {
  encryption: {
    sseAlgorithm: storages.EncryptionAlgorithmEnum.AES256,
  },
  tags: mockedTag,
};
