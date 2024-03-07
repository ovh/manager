import { ENCRYPTION_ALGORITHMS } from '../../../containers.constants';

export default class PciProjectStorageDataEncryptionController {
  $onInit() {
    this.ENCRYPTION_ALGORITHMS = ENCRYPTION_ALGORITHMS;
    this.encryption.sseAlgorithm =
      this.encryption.sseAlgorithm ?? ENCRYPTION_ALGORITHMS.NONE;
  }
}
