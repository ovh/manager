export default class EditNameCtrl {
  /* @ngInject */
  constructor($translate, NutanixNode) {
    this.$translate = $translate;
    this.NutanixNode = NutanixNode;
  }

  onUpdateDisplayNameFormSubmit() {
    if (!this.actionEnabled) {
      return this.goBack();
    }
    console.log(this.nodeId, this.dedicatedServer.name, this.displayName);
    this.loading.update = true;

    return this.NutanixNode.updateDisplayName({
      serviceId: this.dedicatedServer.serviceId,
      serviceName: this.dedicatedServer.name,
      displayName: this.displayName,
    })
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'nutanix_node_server_displaname_edit_displayname_success',
          ),
        );
      })
      .catch(({ data }) => {
        this.goBack(
          this.$translate.instant(
            'nutanix_node_server_displaname_edit_displayname_error',
            { message: data?.message || data.err?.message },
          ),
          'error',
        );
      })
      .finally(() => {
        this.loading.update = false;
      });
  }

  $onInit() {
    this.loading = {
      update: false,
    };
    this.actionEnabled = true;

    if (this.server.state === 'OK') {
      this.dedicatedServer = this.server;
      this.displayName = this.server.displayName;
    } else {
      this.actionEnabled = false;
    }
  }
}
