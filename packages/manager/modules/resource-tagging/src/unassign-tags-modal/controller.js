export default class ovhManagerResourceTaggingUnassignModalController {
  /* @ngInject */
  constructor(ovhManagerResourceTaggingService, Alerter, $translate) {
    this.$translate = $translate;
    this.ovhManagerResourceTaggingService = ovhManagerResourceTaggingService;
    this.Alerter = Alerter;
    this.loading = true;
  }

  $onInit() {
    this.loading = false;
  }

  cancel() {
    this.goBack();
  }

  unassignTags() {
    this.ovhManagerResourceTaggingService
      .unassignTags(this.resourceUrn, this.tagsToRemove)
      .then(() => {
        this.goBack().then(() => {
          console.log(
            'MESSAGE',
            this.$translate.instant(
              'manager_components_resource_tagging_unassign_modal_success',
            ),
          );
          this.Alerter.success(
            this.$translate.instant(
              'manager_components_resource_tagging_unassign_modal_success',
            ),
            'resourcetagging.manager',
          );
        });
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant(
            'manager_components_resource_tagging_unassign_modal_error',
            {
              message: error?.data?.message || error.message,
              requestId: error.headers('X-Ovh-Queryid'),
            },
          ),
          'resourcetagging.unassign',
        );
      });
  }
}
