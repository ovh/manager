import { defineCustomElement as defineCombobox } from '@ovhcloud/ods-components/dist/components/ods-combobox';
import { TAG_ASSIGN_FORM, TAG_REGEX } from './constants';

export default class ovhManagerResourceTaggingAssignModalController {
  /* @ngInject */
  constructor(
    ovhManagerResourceTaggingService,
    $timeout,
    $element,
    $scope,
    Alerter,
    $translate,
  ) {
    defineCombobox();
    this.$timeout = $timeout;
    this.$element = $element;
    this.$translate = $translate;
    this.$scope = $scope;
    this.ovhManagerResourceTaggingService = ovhManagerResourceTaggingService;
    this.Alerter = Alerter;
    this.loading = true;
    this.model = {};
    this.tags = {};
  }

  $onInit() {
    this.TAG_ASSIGN_FORM = TAG_ASSIGN_FORM;
    this.TAG_REGEX = TAG_REGEX;
    this.selectedTags = [];
    this.ovhManagerResourceTaggingService.getAllUserTags().then((tags) => {
      this.tags = Object.groupBy(tags, ({ type }) => type);
      this.values = [];
      this.loading = false;
    });
  }

  updateModel({ detail: { name, value } }, apply = true) {
    if (name === TAG_ASSIGN_FORM.KEY) {
      this.model = {
        key: value,
        value: '',
      };
      const allTags = Object.values(this.tags).reduce(
        (prev, curr) => [...prev, ...curr],
        [],
      );
      this.values = allTags.find(({ key }) => key === value)?.values || [];
    }
    if (name === TAG_ASSIGN_FORM.VALUE) this.model.value = value;

    this.addTagForm[name].$setValidity('pattern', TAG_REGEX.test(value));

    if (apply) {
      this.$scope.$apply();
    }
  }

  $postLink() {
    this.addTagForm[TAG_ASSIGN_FORM.KEY].$setValidity('pattern', false);
    this.addTagForm[TAG_ASSIGN_FORM.VALUE].$setValidity('pattern', false);
    this.$timeout(() => {
      this.$element.on('odsChange', (evt) => {
        this.updateModel(evt);
      });
    });
  }

  addTagToList() {
    const index = this.selectedTags.findIndex(
      (tag) => tag.key === this.model.key,
    );
    if (index !== -1) {
      this.selectedTags[index].value = this.model.value;
    } else {
      this.selectedTags.push({
        key: this.model.key,
        value: this.model.value,
      });
    }
    this.updateModel(
      {
        detail: {
          name: TAG_ASSIGN_FORM.KEY,
          value: '',
        },
      },
      false,
    );
    this.addTagForm.$setPristine();
    this.addTagForm.$setUntouched();
  }

  removeSelectedTag(tag) {
    this.selectedTags = this.selectedTags.filter((t) => t.key !== tag.key);
  }

  assignTag() {
    this.loading = true;
    this.ovhManagerResourceTaggingService
      .assignMultipleTags(this.resourceUrn, this.selectedTags)
      .then(() => {
        this.goBack(true).then(() => {
          this.loading = false;
          const successMessage =
            this.selectedTags.length > 1
              ? this.$translate.instant(
                  'manager_components_resource_tagging_assign_modal_success_multiple',
                )
              : this.$translate.instant(
                  'manager_components_resource_tagging_assign_modal_success',
                );
          this.Alerter.success(successMessage, 'resourcetagging.manager');
          this.ovhManagerResourceTaggingService.trackPage(
            `${this.trackingPrefix}banner-info::assign-tag_success`,
          );
        });
      })
      .catch((error) => {
        this.loading = false;
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
        this.ovhManagerResourceTaggingService.trackPage(
          `${this.trackingPrefix}banner-info::assign-tag_error`,
        );
      });
  }

  cancel() {
    this.loading = true;
    this.goBack().then(() => {
      this.loading = false;
    });
  }
}
