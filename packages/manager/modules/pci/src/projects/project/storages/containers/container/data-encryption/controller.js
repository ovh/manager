import { NO_ENCRYPTION_VALUE } from '../../containers.constants';

export default class PciProjectStorageDataEncryptionController {
  $onInit() {
    this.setEncryptionOptions();
    this.encryption.sseAlgorithm =
      this.encryption.sseAlgorithm ?? this.options[0].value;
  }

  $onChanges(changes) {
    if (
      changes.containerRegion?.currentValue !== null &&
      changes.containerRegion?.currentValue !==
        changes.containerRegion?.previousValue
    ) {
      this.setEncryptionOptions();
    }
  }

  setEncryptionOptions() {
    // sort the list to get the default value in first position (no encryption -> plaintext)
    const encryptionValues = this.encryptionAlgorithms.filter(
      (value) => value !== NO_ENCRYPTION_VALUE,
    );

    encryptionValues.unshift(NO_ENCRYPTION_VALUE);

    this.options = encryptionValues.map((value) => {
      const label = `pci_projects_project_storages_containers_data_encryption_${value.toLowerCase()}`;
      return {
        value,
        label,
        tooltip: value !== NO_ENCRYPTION_VALUE ? `${label}_tooltip` : null,

        // temporary because actually there is no encryption algorithm for AP-SOUTH-MUM
        disabled:
          value !== NO_ENCRYPTION_VALUE &&
          this.containerRegion?.name === 'AP-SOUTH-MUM',
      };
    });
  }

  trackClickOnTooltip(event, value) {
    this.trackEncryptionAction(value);
    event.stopPropagation();
  }
}
