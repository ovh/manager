import ActionTrees from '../../../../../modules/iam/src/components/actionSelect/ActionTrees.class.js';
import { CUSTOM_RESOURCE_TYPE } from '../../../../../modules/iam/src/iam.constants';

describe('ActionTrees', () => {
  let actionTrees;

  beforeEach(() => {
    actionTrees = new ActionTrees({
      actions: [
        { value: 'action1', selected: false, resourceType: 'type1' },
        { value: 'action2', selected: true, resourceType: 'type1' },
      ],
      categories: [
        {
          value: 'category1',
          actions: [
            { value: 'action3', selected: false },
            { value: 'action4', selected: true },
          ],
        },
      ],
      expanded: false,
      searchable: true,
      searchQuery: '',
      value: 'type1',
    });
  });

  describe('actions getter', () => {
    it('should flatten all actions into an array', () => {
      const { actions } = actionTrees;
      expect(actions).toEqual([
        { value: 'action1', selected: false, resourceType: 'type1' },
        { value: 'action2', selected: true, resourceType: 'type1' },
        { value: 'action3', selected: false },
        { value: 'action4', selected: true },
      ]);
    });
  });

  describe('selection getter', () => {
    it('should return only selected actions', () => {
      const { selection } = actionTrees;
      expect(selection).toEqual([
        { value: 'action2', selected: true, resourceType: 'type1' },
        { value: 'action4', selected: true },
      ]);
    });
  });

  describe('addAction', () => {
    it('should add a new action if it does not exist', () => {
      const result = actionTrees.addAction('newAction');
      expect(result).toEqual({
        action: {
          resourceType: CUSTOM_RESOURCE_TYPE,
          selected: true,
          value: 'newAction',
        },
        created: true,
      });
      expect(actionTrees.actions).toContainEqual(result.action);
    });

    it('should select an existing action if it already exists', () => {
      const result = actionTrees.addAction('action1');
      expect(result).toEqual({
        action: { value: 'action1', selected: true, resourceType: 'type1' },
        created: false,
      });
    });
  });

  describe('tagAllEmbeddedActions', () => {
    it('should tag all matching actions as embedded and selected', () => {
      actionTrees.tagAllEmbeddedActions({ value: 'action', selected: true });
      expect(actionTrees.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            resourceType: 'type1',
            selected: false,
            value: 'action1',
          }),
          expect.objectContaining({
            resourceType: 'type1',
            selected: true,
            value: 'action2',
          }),
          expect.objectContaining({
            selected: false,
            value: 'action3',
          }),
          expect.objectContaining({
            selected: true,
            value: 'action4',
          }),
        ]),
      );
    });
  });

  describe('findAction', () => {
    it('should find an action by its value', () => {
      const action = actionTrees.findAction('action1');
      expect(action).toEqual({
        value: 'action1',
        selected: false,
        resourceType: 'type1',
      });
    });

    it('should return undefined if the action does not exist', () => {
      const action = actionTrees.findAction('nonexistent');
      expect(action).toBeUndefined();
    });
  });

  describe('findAllActions', () => {
    it('should find all actions matching a wildcard pattern', () => {
      const actions = actionTrees.findAllActions('action*');
      expect(actions).toEqual([
        { value: 'action1', selected: false, resourceType: 'type1' },
        { value: 'action2', selected: true, resourceType: 'type1' },
        { value: 'action3', selected: false },
        { value: 'action4', selected: true },
      ]);
    });

    it('should return an empty array if no actions match', () => {
      const actions = actionTrees.findAllActions('nonexistent');
      expect(actions).toEqual([]);
    });
  });

  describe('isActionSelected', () => {
    it('should return true if the action is selected', () => {
      expect(actionTrees.isActionSelected('action2')).toBe(true);
    });

    it('should return false if the action is not selected', () => {
      expect(actionTrees.isActionSelected('action1')).toBe(false);
    });
  });
});
