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
    this.loading = true;
    this.ovhManagerResourceTaggingService
      .unassignTags(this.resourceUrn, this.tagsToRemove)
      .then(() => {
        this.goBack(true).then(() => {
          this.loading = false;
          this.Alerter.success(
            this.$translate.instant(
              'manager_components_resource_tagging_unassign_modal_success',
            ),
            'resourcetagging.manager',
          );
          this.ovhManagerResourceTaggingService.trackPage(
            `${this.trackingPrefix}banner-info::unassign-tag_success`,
          );
        });
      })
      .catch((error) => {
        this.loading = false;
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
        this.ovhManagerResourceTaggingService.trackPage(
          `${this.trackingPrefix}banner-info::unassign-tag_error`,
        );
      });
  }
}
