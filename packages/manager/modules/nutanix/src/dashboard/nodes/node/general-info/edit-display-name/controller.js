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
    this.loading.update = true;

    return this.NutanixNode.updateDisplayName({
      serviceId: this.dedicatedServer.serviceId,
      serviceName: this.dedicatedServer.name,
      displayName: this.displayName,
    })
      .then(() => {
        this.dedicatedServer.displayName = this.displayName;
        this.handleSuccess(
          this.$translate.instant(
            'nutanix_node_server_displaname_edit_displayname_success',
          ),
          this.displayName,
        );
      })
      .catch(({ data }) => {
        this.loading.update = false;
        this.goBack(
          this.$translate.instant(
            'nutanix_node_server_displaname_edit_displayname_error',
            { message: data?.message || data.err?.message },
          ),
          'error',
        );
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
