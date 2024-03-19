import { NO_ENCRYPTION_VALUE } from '../../containers.constants';

export default class PciProjectStorageDataEncryptionController {
  $onInit() {
    this.setEncryptionOptions();
    this.encryption.sseAlgorithm =
      this.encryption.sseAlgorithm ?? this.options[0].value;
  }

  setEncryptionOptions() {
    // reverse the list to get the default value (no encryption -> plaintext)
    this.options = this.encryptionAlgorithms.reverse().map((value) => {
      const label = 'pci_projects_project_storages_containers_data_encryption_';
      const key = value.toLowerCase();
      return {
        value,
        label: `${label}${key}`,
        tooltip:
          value !== NO_ENCRYPTION_VALUE ? `${label}${key}_tooltip` : null,
      };
    });
  }
}
