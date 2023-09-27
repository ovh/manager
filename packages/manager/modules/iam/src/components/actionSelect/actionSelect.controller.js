import { cloneDeep } from 'lodash-es';

import {
  CUSTOM_ACTION_PATTERN,
  CUSTOM_ACTION_SAMPLE,
  CUSTOM_RESOURCE_TYPE,
  TAG,
} from '../../iam.constants';

import ActionTrees from './ActionTrees.class';

export default class ActionSelectController {
  /* @ngInject */
  constructor($attrs, $filter, $scope, $timeout, $translate, IAMService) {
    this.$attrs = $attrs;
    this.$filter = $filter;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.IAMService = IAMService;

    this.CUSTOM_ACTION_SAMPLE = CUSTOM_ACTION_SAMPLE;
    this.CUSTOM_RESOURCE_TYPE = CUSTOM_RESOURCE_TYPE;

    /**
     * List of actions
     * @type {Object[]}
     */
    this.actions = [];

    /**
     * Group each action into categories and each category into resource types
     * So it can be displayed as collapsible components
     * @type {ActionTrees=}
     */
    this.actionTrees = undefined;

    /**
     * The custom action's model
     * @type {string}
     */
    this.customActionModel = '';

    /**
     * The custom action's success message, if any
     * @type {string}
     */
    this.customActionSuccessMessage = '';

    /**
     * The NgFormController created by the template by using name="$ctrl.form"
     * @type {NgFormController}
     */
    this.form = null;

    /**
     * Whether the controller is loading
     * @type {boolean}
     */
    this.isLoading = false;

    /**
     * Whether all the wildcard switch is active
     * @type {boolean}
     */
    this.isWildcardActive = false;

    /**
     * The main form's name
     * @type {string}
     */
    this.name = 'actions';

    /**
     * Whether the select is required
     * @type {boolean}
     */
    this.required = false;
  }

  /**
   * Whether the entered custom action can be added
   * @returns {boolean}
   */
  get canAddCustomAction() {
    return this.customActionModel?.length && this.form?.customAction.$valid;
  }

  /**
   * Whether the whole form is required from a user perspective
   * @returns {boolean}
   */
  get isRequired() {
    if (this.required && this.form) {
      const { [this.name]: name } = this.form;
      return name.$dirty && name.$invalid;
    }
    return false;
  }

  $onChanges(changes) {
    Object.entries(changes).forEach(([key, { currentValue: value }]) => {
      switch (key) {
        case 'required':
          this.required = value
            ? value === 'true'
            : Boolean(this.$attrs.$attr.required);
          break;

        case 'ngModel':
          if (value) {
            this.isWildcardActive = value.isWildcardActive;
            this.createActionTrees();
          }
          // The ngModel is not defined yet
          else {
            this.isWildcardActive = false;
            this.actionTrees = undefined;
          }
          break;

        case 'resourceTypes':
          this.resourceTypes = value;
          this.createActionTrees();
          break;

        default:
          this[key] = value;
      }
    });
  }

  $onInit() {
    this.isLoading = true;
    return this.IAMService.getActions()
      .then((actions) => {
        this.actions = cloneDeep(actions);
        this.createActionTrees();
        if (this.load) {
          this.load({ actions });
        }
      })
      .catch((error) => {
        this.error({ error });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * Add the user entered custom action to the model
   * - If the action does not exist, create a custom one and select it
   * - If the action already exist and is not selected, select it wherever it is
   */
  addCustomAction() {
    const { customActionModel: value } = this;
    const key = 'iam_action_select';
    const successKey = `${key}_custom_action_success`;
    const { instant: $t } = this.$translate;

    if (value === '*') {
      this.isWildcardActive = true;
      this.customActionModel = '';
      this.customActionSuccessMessage = $t(`${successKey}_wildcard`);
    } else {
      const { action, created } = this.actionTrees.addAction(value);
      const translateValues = {
        action: `<strong>${action.value}</strong>`,
        resourceType: `<strong>${this.$filter('iamResourceType')(
          action.resourceType,
        )}</strong>`,
      };

      this.customActionSuccessMessage = created
        ? $t(`${successKey}_created`, translateValues)
        : $t(`${successKey}_selected`, translateValues);
    }

    this.customActionModel = '';
    this.trackActionSelectClick(TAG.ADD_ACTION_MANUALLY);
    this.trackActionSelectPage(TAG.ADD_ACTION_MANUALLY_SUCCESS);
    this.onModelChanged();
  }

  /**
   * Re-format the action trees
   * @see {ActionTrees.create}
   */
  createActionTrees() {
    if (!this.actions.length) {
      return;
    }

    this.actionTrees = ActionTrees.create({
      $scope: this.$scope,
      actions: this.actions,
      actionTrees: this.actionTrees,
      resourceTypes: this.resourceTypes,
      selectedActions: this.ngModel?.selection || [],
    });

    // The custom form is not in the DOM yet
    this.$timeout(() => {
      const { customAction, [this.name]: name } = this.form;

      // Custom required validator for the whole component
      name.$validators.required = () =>
        this.required
          ? this.ngModel?.selection.length > 0 || this.ngModel?.isWildcardActive
          : true;

      // Custom "requirements" validator to know if a custom action meets all the requirements
      customAction.$validators.requirements = (action) => {
        const [actionWithoutParams] = action.split('?');
        const isEmpty = !action;
        const isFound = this.actions.find(
          ({ action: item, hasQueryParameters }) =>
            item === action ||
            (hasQueryParameters && item === actionWithoutParams),
        );
        const isValid = CUSTOM_ACTION_PATTERN.test(action);
        return isEmpty || isValid || isFound;
      };

      // Custom "selected" validator to know if a custom action has already been selected
      customAction.$validators.selected = (action) =>
        !action || !this.actionTrees?.isActionSelected(action);
    });
  }

  /**
   * Find the given action by its "action" key
   * @param {string} actionValue
   * @returns {{ action: string }|null}
   */
  findAction(actionValue) {
    return this.actions.find(({ action }) => action === actionValue);
  }

  /**
   * Nested form tags are not allowed, this is why we use a ngForm directive instead
   * to get access to the control instance. Nevertheless, multiple submit buttons do
   * not work also, this is why we have to handle the enter key manually
   * @param {KeyboardEvent} event
   */
  onCustomActionKeyPressed(event) {
    if (event.key.toLowerCase() === 'enter' && this.canAddCustomAction) {
      event.preventDefault();
      this.addCustomAction();
    }
  }

  /**
   * Called back when the wild card switch state has changed
   * @param {boolean} isEnabled
   */
  onIsWildcardActiveChanged(isEnabled) {
    this.trackActionSelectClick(
      isEnabled ? TAG.ENABLE_ALLOW_ALL_ACTIONS : TAG.DISABLE_ALLOW_ALL_ACTIONS,
    );
    this.onModelChanged();
  }

  /**
   * Set the required ngModel instance's value each time the model has changed
   * The ngModel is of type { action: string, resourceType?: string }[]
   */
  onModelChanged() {
    // Give time to the action selected flags to react on change
    this.$timeout(() => {
      const mappedSelection = this.actionTrees?.selection.map(
        ({ value: action, resourceType }) => ({ action, resourceType }),
      );

      this.requiredNgModel.$setViewValue({
        isWildcardActive: this.isWildcardActive,
        selection: mappedSelection || [],
      });

      // Run a manual validation
      const { customAction, [this.name]: name } = this.form;
      [customAction, name].forEach((control) => {
        control.$setDirty();
        control.$validate();
      });
    });
  }

  /**
   * Toggle a limited set of actions
   * @param {Action[]} actions
   */
  toggleActions(actions) {
    const areAllSelected = actions.reduce(
      (selected, action) => (selected === action.selected ? selected : null),
      actions[0].selected,
    );
    actions.forEach((action) =>
      Object.assign(action, {
        selected: areAllSelected === null ? true : !areAllSelected,
      }),
    );
    this.onModelChanged();
  }

  /**
   * Categories are not callapsibles because it is very buggy
   * Toggle a category as it was a collapsible
   * @param {Category} category
   * @param {boolean} force
   */
  toggleCategory(category, force) {
    Object.assign(category, {
      expanded: typeof force === 'boolean' ? force : !category.expanded,
    });
    this.triggerResize();
  }

  /**
   * Custom trackClick wrapper witch uses the tagPrefix bound property
   * @param {string} tag
   */
  trackActionSelectClick(tag) {
    this.trackClick([this.tagPrefix, tag].filter(Boolean).join('::'));
  }

  /**
   * Custom trackPage wrapper witch uses the tagPrefix bound property
   * @param {string} tag
   */
  trackActionSelectPage(tag) {
    this.trackPage([this.tagPrefix, tag].filter(Boolean).join('::'));
  }

  /*
   * This hack is a way to force the collapsibles to recalculate their height
   */
  triggerResize() {
    this.$timeout(() => {
      jQuery(window).trigger('resize');
    }, 100);
  }

  /**
   * Get the label translation key for the given category
   * @param {Category} category
   * @returns {string}
   */
  static getCategoryLabel({ actions, selection }) {
    const { length: selectionLength } = selection;
    const prefix = 'iam_action_select_category_count';
    if (selectionLength) {
      return selectionLength === 1
        ? `${prefix}_selection_one`
        : `${prefix}_selection_many`;
    }
    return actions.length === 1
      ? `${prefix}_no_selection_one`
      : `${prefix}_no_selection_many`;
  }
}
