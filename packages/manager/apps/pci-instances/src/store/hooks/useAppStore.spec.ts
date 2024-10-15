import { describe, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './useAppStore';
import { TStep, TStepId, TSteps } from '../slices/stepper.slice';
import { TRegionItem } from '../slices/form.slice';

describe('Considering the useAppStore hook', () => {
  describe("Considering the 'FormSlice'", () => {
    // test data
    type Data = {
      modelName: string;
      expectedModelName: string;
      region: TRegionItem;
      expectedRegion: TRegionItem;
    };
    const fakeModelName1 = 'b3-8';
    const fakeModelName2 = 'b2-7';

    const fakeRegion1: TRegionItem = {
      name: 'GRA7',
      datacenter: 'GRA',
    };

    const expectedModelName1 = fakeModelName1;
    const expectedModelName2 = fakeModelName2;

    const expectedRegion1 = fakeRegion1;

    describe.each`
      modelName         | expectedModelName     | region         | expectedRegion
      ${fakeModelName1} | ${expectedModelName1} | ${fakeRegion1} | ${expectedRegion1}
      ${fakeModelName2} | ${expectedModelName2} | ${null}        | ${null}
    `(
      'Given a modelName <$modelName> and a region <$region>',
      ({ modelName, expectedModelName, region, expectedRegion }: Data) => {
        describe(`When invoking useAppStore hook,`, () => {
          const { result } = renderHook(() => useAppStore());
          test(`Then, expect model name to be ${JSON.stringify(
            expectedModelName,
          )}`, () => {
            expect(result.current).toHaveProperty('form');
            expect(result.current.modelName()).toBeNull();
            act(() => {
              result.current.setModelName(modelName);
            });
            expect(result.current.modelName()).toStrictEqual(expectedModelName);
          });

          test(`Then, expect region to be ${JSON.stringify(
            expectedRegion,
          )}`, () => {
            expect(result.current.region()).toBeNull();
            act(() => {
              result.current.setRegion(region);
            });
            expect(result.current.region()).toStrictEqual(expectedRegion);
          });
        });
      },
    );
  });

  describe('Considering the Stepper slice', () => {
    type Data1 = {
      stepId: TStepId;
      expectedStepById: TStep;
    };

    type Data2 = {
      validateStepId?: TStepId;
      expectedValidatedStepById?: TStep;
      editStepId: TStepId;
      expectedEditedStepById: TStep;
    };

    const initialSteps: TSteps = new Map<TStepId, TStep>([
      [
        'model',
        {
          isOpen: true,
          isChecked: false,
          isLocked: false,
          order: 1,
        },
      ],
      [
        'region',
        {
          isOpen: false,
          isChecked: false,
          isLocked: false,
          order: 2,
        },
      ],
    ]);

    const expectedStep1: TStep = {
      order: 1,
      isChecked: false,
      isLocked: false,
      isOpen: true,
    };

    const expectedStep2: TStep = {
      order: 2,
      isChecked: false,
      isLocked: false,
      isOpen: false,
    };

    const expectedValidatedStep1: TStep = {
      order: 1,
      isChecked: true,
      isLocked: true,
      isOpen: false,
    };

    const expectedEditedStep1: TStep = {
      order: 2,
      isChecked: false,
      isLocked: false,
      isOpen: true,
    };

    const expectedEditedStep2: TStep = {
      order: 1,
      isChecked: false,
      isLocked: false,
      isOpen: true,
    };

    test('Should create the steppe slice with initial steps', () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current).toHaveProperty('steps');
      expect(result.current.steps).toBeInstanceOf(Map);
      expect(result.current.steps).toStrictEqual(initialSteps);
    });

    test.each`
      stepId       | expectedStepById
      ${undefined} | ${undefined}
      ${'model'}   | ${expectedStep1}
      ${'region'}  | ${expectedStep2}
    `(
      'Given a stepId parameter <$stepId>, expect stepById() query function to return <$expectedStepById>',
      ({ stepId, expectedStepById }: Data1) => {
        const { result } = renderHook(() => useAppStore());
        expect(result.current.stepById()(stepId)).toStrictEqual(
          expectedStepById,
        );
      },
    );

    test.each`
      validateStepId | expectedValidatedStepById | editStepId   | expectedEditedStepById
      ${undefined}   | ${undefined}              | ${undefined} | ${undefined}
      ${'model'}     | ${expectedValidatedStep1} | ${'region'}  | ${expectedEditedStep1}
      ${undefined}   | ${undefined}              | ${'model'}   | ${expectedEditedStep2}
    `(
      `Given a validateStepId parameter <$validateStepId> to validate a editStepId parameter <$editStepId> to edit, 
      expect stepById() query function to return the validated step <$expectedValidatedStepById> and the edited step <$expectedEditedStepById>`,
      ({
        validateStepId,
        expectedValidatedStepById,
        editStepId,
        expectedEditedStepById,
      }: Data2) => {
        const { result } = renderHook(() => useAppStore());
        if (validateStepId) {
          act(() => result.current.validateStep(validateStepId));
          expect(result.current.stepById()(validateStepId)).toStrictEqual(
            expectedValidatedStepById,
          );
          expect(result.current.stepById()(editStepId)).toStrictEqual(
            expectedEditedStepById,
          );
        }
        act(() => result.current.editStep(editStepId));
        expect(result.current.stepById()(editStepId)).toStrictEqual(
          expectedEditedStepById,
        );
      },
    );
  });
});
