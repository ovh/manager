/**
 * @typedef {{
 *   resourceType: string
 *   selected: boolean
 *   value: string
 * }} Action
 *
 * @typedef {{
 *   actions?: Action[]
 *   categories: Category[]
 *   expanded: boolean
 *   searchable: boolean
 *   searchQuery: string
 *   value: string
 * }} ActionTree
 *
 * @typedef {{
 *   actions: Action[]
 *   actionTrees: ActionTrees
 *   customActionTree: ActionTree
 * }} Buffer
 *
 * @typedef {{
 *   actions: Action[]
 *   expanded: boolean
 *   selected: boolean
 *   selection: Action[]
 *   value: string
 *   unwatchActions: () => void
 * }} Category
 *
 * @typedef {{
 *   $scope: { $watch: () => () => void }
 *   actions: RawAction[]
 *   actionTrees?: ActionTrees
 *   resourceTypes: string[]
 *   selectedActions?: RawAction[]
 * }} Input
 *
 * @typedef {{
 *   action: string
 *   resourceType: string
 *   categories: string[]
 * }} RawAction
 */

import { CUSTOM_RESOURCE_TYPE } from '../../iam.constants';

export default class ActionTrees extends Array {
  /**
   * Flatten all the actions into an array
   * @returns {Action[]}
   */
  get actions() {
    return [
      ...this.flatMap(({ actions: actionTreeActions, categories }) => [
        ...(actionTreeActions || []),
        ...(categories?.flatMap(({ actions }) => actions) || []),
      ]),
    ];
  }

  /**
   * Flatten all the selected actions into an array
   * @returns {Action[]}
   */
  get selection() {
    return this.actions.filter(({ selected }) => selected);
  }

  /**
   * Add a action given its value string
   * If the action already exists, selects it
   * @param {string} value
   * @returns {{ created: boolean, action: Action }}
   */
  addAction(value) {
    const foundAction = this.findAction(value);

    if (foundAction) {
      foundAction.selected = true;
      return { action: foundAction, created: false };
    }

    // New actions are always custom actions
    const newAction = {
      resourceType: CUSTOM_RESOURCE_TYPE,
      selected: true,
      value,
    };

    this[0].actions.push(newAction);
    this[0].expanded = true;

    return { action: newAction, created: true };
  }

  /**
   * Find an action given its value
   * @param {string} value
   */
  findAction(value) {
    return this.actions.find((action) => action.value === value);
  }

  /**
   * Execute callback for each category of each actionTree
   * @param {(item: { actionTree: ActionTree, category: Category }) => void} callback
   */
  forEachCategory(callback) {
    this.forEach(
      /** @param {ActionTree} actionTree */
      (actionTree) => {
        if (actionTree.categories) {
          actionTree.categories.forEach((category) => {
            callback({ actionTree, category });
          });
        }
      },
    );
  }

  /**
   * Whether the given action is selected given its value
   * @param {string} value
   * @returns {boolean}
   */
  isActionSelected(value) {
    return this.findAction(value)?.selected || false;
  }

  /**
   * @param {Input} input
   * @returns {ActionTrees}
   */
  static create(input) {
    /**
     * Temporary data needed to format
     * @type {Buffer}
     */
    this.buffer = {};

    try {
      [
        this.unwatchCategoryActions,
        this.createActions,
        this.createCustomActionTree,
        this.limitByTypes,
        this.createActionTrees,
        this.createCategories,
        this.dispatchActions,
        this.watchCategoryActions,
        this.expandActionTrees,
      ].forEach((middleware) => middleware.call(this, input));
    } catch (error) {
      this.expandActionTrees(input);
    }

    return this.closeBuffer();
  }

  /**
   * Category's actions are watched in order to manage the category selection state
   * This state depends on the selection of the actions
   * @param {Input} input
   */
  static unwatchCategoryActions(input) {
    if (input.actionTrees) {
      input.actionTrees.forEachCategory(({ category }) => {
        category.unwatchActions();
      });
    }
  }

  /**
   * Create an actions set that merge both custom and readonly actions
   * The selection state of each action is handled by the "selected" flag
   * @param {Input} input
   */
  static createActions(input) {
    const { actions } = input;
    this.buffer.actions = [...actions]
      .sort(({ action: a }, { action: b }) => (a > b ? 1 : -1))
      .map((action) => {
        const value = action.action;
        return {
          resourceType: action.resourceType,
          selected: Boolean(
            input.selectedActions?.find(
              (rawAction) => rawAction.action === value,
            ),
          ),
          value,
        };
      });
  }

  /**
   * Create an actionTree for custom actions
   * Because custom actions exist only in the policy payload
   * We need a dedicated collapsible component
   * @param {Input} input
   */
  static createCustomActionTree(input) {
    const { actions, actionTrees, selectedActions } = input;
    const unknownActions = selectedActions
      ? selectedActions.filter(
          ({ action: selectedAction }) =>
            selectedAction !== '*' &&
            !actions.find(({ action }) => action === selectedAction),
        )
      : [];
    this.buffer.customActionTree = actionTrees
      ? actionTrees[0]
      : {
          actions: unknownActions
            .sort(({ action: a }, { action: b }) => (a > b ? 1 : -1))
            .map((action) => ({
              resourceType: CUSTOM_RESOURCE_TYPE,
              selected: true,
              searchable: false,
              value: action.action,
            })),
          expanded: false,
          value: CUSTOM_RESOURCE_TYPE,
        };
  }

  /**
   * Displaying a lot of collapsibles containing a lot of checkboxes leads to performance issues
   * We must limit the number of types to the ones selected by the user
   * @param {Input} input
   */
  static limitByTypes(input) {
    if (!input.resourceTypes?.length) {
      throw new Error('NoTypesError');
    }
  }

  /**
   * Create an ActionTrees instance
   * This instance is used to display collapsibles
   * @param {Input} input
   */
  static createActionTrees(input) {
    this.buffer.actionTrees = new ActionTrees(
      ...this.buffer.actions
        .map(({ resourceType: value }) => value)
        .filter(
          (value, index, list) =>
            Boolean(value) &&
            input.resourceTypes.includes(value) &&
            list.indexOf(value) === index,
        )
        .sort()
        .map((value) => ({
          expanded: false,
          searchable: true,
          searchQuery: input.actionTrees?.find(
            (actionTree) => actionTree.value === value,
          )?.searchQuery,
          value,
        })),
    );
  }

  /**
   * Each actionTree is given a list of categories
   * These categories are extracted from the actions whose resourceType matches the actionTree's value
   * @param {Input} input
   */
  static createCategories(input) {
    this.buffer.actionTrees.forEach((actionTree) =>
      Object.assign(actionTree, {
        categories: input.actions
          .filter(
            (action) =>
              action.resourceType === actionTree.value &&
              action.categories?.length > 0,
          )
          .reduce((list, { categories }) => [...list, ...categories], [])
          .filter((value, index, list) => list.indexOf(value) === index)
          .sort()
          .map((value) => ({
            expanded: false,
            selected: false,
            value,
          })),
      }),
    );
  }

  /**
   * Each category of each actionTree is given a list of actions
   * whose resourceType matches the actionTree's value
   * @param {Input} input
   */
  static dispatchActions(input) {
    this.buffer.actionTrees.forEachCategory(({ actionTree, category }) => {
      const actions = input.actions
        .filter(
          (action) =>
            action.resourceType === actionTree.value &&
            action.categories.includes(category.value),
        )
        .map(({ action }) =>
          this.buffer.actions.find(({ value }) => value === action),
        )
        .filter(Boolean);
      Object.assign(category, {
        actions,
        get selection() {
          return actions.filter(({ selected }) => selected);
        },
      });
    });
  }

  /**
   * Category's actions are watched in order to manage the category selection state
   * This state depends on the selection of the actions
   * A null state means the selection state is indeterminated
   * @param {Input} input
   */
  static watchCategoryActions(input) {
    const { $scope } = input;
    this.buffer.actionTrees.forEachCategory(({ category }) => {
      Object.assign(category, {
        unwatchActions: $scope.$watch(
          () =>
            category.actions.reduce(
              (selected, action) =>
                selected === action.selected ? selected : null,
              category.actions[0].selected,
            ),
          (selected) => Object.assign(category, { selected }),
        ),
      });
    });
  }

  /**
   * Expand / Collapse each actionTree and their categories based on the previously built data
   * or if the actionTree contains any selected action
   * @param {Input} input
   */
  static expandActionTrees(input) {
    /** @type {ActionTree[]} */
    const allActionTrees = [
      this.buffer.customActionTree,
      ...(this.buffer.actionTrees ?? []),
    ];

    allActionTrees.forEach((actionTree) => {
      const inputActionTree = input.actionTrees?.find(
        ({ value }) => value === actionTree.value,
      );
      const hasActionTreeSelectedActions = [
        ...(actionTree.actions || []),
        ...(actionTree.categories?.flatMap(({ actions }) => actions) || []),
      ].some(({ selected }) => selected);

      Object.assign(actionTree, {
        expanded: inputActionTree
          ? inputActionTree.expanded
          : hasActionTreeSelectedActions,
      });

      if (actionTree.categories) {
        actionTree.categories.forEach((category) => {
          const inputCategory = inputActionTree?.categories.find(
            ({ value }) => value === category.value,
          );

          Object.assign(category, {
            expanded: inputCategory
              ? inputCategory.expanded
              : category.selection.length > 0,
          });
        });
      }
    });
  }

  /**
   * Close the buffer and return the formatted data
   * @returns {ActionTrees}
   */
  static closeBuffer() {
    /** @type {ActionTree[]} */
    const allActionTrees = [
      this.buffer.customActionTree,
      ...(this.buffer.actionTrees ?? []),
    ];
    delete this.buffer;
    return new ActionTrees(...allActionTrees);
  }
}
