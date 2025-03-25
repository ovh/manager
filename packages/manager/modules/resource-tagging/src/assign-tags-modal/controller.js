import { defineCustomElement as defineCombobox } from '@ovhcloud/ods-components/dist/components/ods-combobox';
import { TAG_REGEX } from './constants';

export default class ovhManagerResourceTaggingAssignModalController {
  /* @ngInject */
  constructor(
    ovhManagerResourceTaggingService,
    $timeout,
    $element,
    Alerter,
    $translate,
  ) {
    defineCombobox();
    this.$timeout = $timeout;
    this.$element = $element;
    this.$translate = $translate;
    this.ovhManagerResourceTaggingService = ovhManagerResourceTaggingService;
    this.Alerter = Alerter;
    this.loading = true;
    this.model = {};
  }

  $onInit() {
    this.TAG_REGEX = TAG_REGEX;
    this.ovhManagerResourceTaggingService.getAllUserTags().then((tags) => {
      this.tags = tags;
      this.keys = tags.map((tag) => tag.key);
      this.values = [];
      this.loading = false;
    });
  }

  updateModel(event) {
    if (event.detail.name === 'tag-key') {
      this.model.key = event.detail.value;
      this.model.value = '';
      this.values =
        this.tags.find((tag) => tag.key === event.detail.value)?.values || [];
    }
    if (event.detail.name === 'tag-value')
      this.model.value = event.detail.value;

    this.addTagForm[event.detail.name].$setValidity(
      'pattern',
      TAG_REGEX.test(event.detail.value),
    );

    this.$element.scope().$apply();
  }

  $postLink() {
    this.addTagForm['tag-key'].$setValidity('pattern', false);
    this.addTagForm['tag-value'].$setValidity('pattern', false);
    this.$timeout(() => {
      this.$element.on('odsChange', (evt) => {
        this.updateModel(evt);
      });
    });
  }

  assignTag() {
    this.ovhManagerResourceTaggingService
      .assignTag(this.resourceUrn, this.model.key, this.model.value)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant(
            'manager_components_resource_tagging_assign_modal_success',
          ),
          'resourcetagging.assign',
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant(
            'manager_components_resource_tagging_assign_modal_error',
            {
              message: error?.data?.message || error.message,
              requestId: error.headers('X-Ovh-Queryid'),
            },
          ),
          'resourcetagging.assign',
        );
      });
  }

  cancel() {
    this.goBack();
  }
}
