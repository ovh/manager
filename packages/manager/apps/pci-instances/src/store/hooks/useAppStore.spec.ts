import { describe, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './useAppStore';
import { TStep, TStepId } from '../slices/stepper.slice';

describe('Considering the useAppStore hook', () => {
  describe("Considering the 'FormSlice'", () => {
    // test data
    type Data = {
      modelName: string;
      expectedModelName: string;
    };
    const fakeModelName1 = 'b3-8';
    const fakeModelName2 = 'b2-7';

    const expectedModelName1 = fakeModelName1;
    const expectedModelName2 = fakeModelName2;

    describe.each`
      modelName         | expectedModelName
      ${fakeModelName1} | ${expectedModelName1}
      ${fakeModelName2} | ${expectedModelName2}
    `(
      'Given a modelName <$modelName>',
      ({ modelName, expectedModelName }: Data) => {
        describe(`When invoking useAppStore hook,`, () => {
          test(`Then, expect model name to be ${JSON.stringify(
            expectedModelName,
          )}`, () => {
            const { result } = renderHook(() => useAppStore());
            expect(result.current).toHaveProperty('form');
            expect(result.current.modelName()).toBeNull();
            act(() => {
              result.current.setModelName(modelName);
            });
            expect(result.current.modelName()).toStrictEqual(expectedModelName);
          });
        });
      },
    );
  });

  describe("Considering the 'StepperSlice'", () => {
    // test data
    type Data = {
      stepId: TStepId;
      updatedStep?: TStep;
      updatedStepId?: TStepId;
      expectedStep: TStep;
      expectedUpdatedStep?: TStep;
    };
    const stepId1: TStepId = 'model';
    const updatedStepId1: TStepId = stepId1;
    const updatedStepId2 = 'foo';

    const expectedStep1: TStep = {
      isChecked: false,
      isLocked: false,
      isOpen: true,
    };

    const updatedStep1: TStep = {
      isChecked: true,
      isLocked: true,
      isOpen: false,
    };

    const expectedUpdatedStep1 = updatedStep1;

    describe.each`
      stepId       | expectedStep     | updatedStepId     | updatedStep     | expectedUpdatedStep
      ${undefined} | ${undefined}     | ${undefined}      | ${undefined}    | ${undefined}
      ${stepId1}   | ${expectedStep1} | ${undefined}      | ${undefined}    | ${undefined}
      ${stepId1}   | ${expectedStep1} | ${updatedStepId1} | ${updatedStep1} | ${expectedUpdatedStep1}
      ${stepId1}   | ${expectedStep1} | ${updatedStepId2} | ${updatedStep1} | ${expectedStep1}
    `(
      'Given a stepId <$stepId>',
      ({
        stepId,
        expectedStep,
        updatedStep,
        expectedUpdatedStep,
        updatedStepId,
      }: Data) => {
        describe(`When invoking useAppStore hook`, () => {
          test(`Then, expect step to be ${JSON.stringify(
            expectedStep,
          )}`, () => {
            const { result } = renderHook(() => useAppStore());
            expect(result.current).toHaveProperty('steps');
            expect(result.current.steps).toBeInstanceOf(Map);
            expect(result.current.stepStateById()(stepId)).toStrictEqual(
              expectedStep,
            );
            if (updatedStep && updatedStepId) {
              act(() => {
                result.current.updateStep(updatedStepId, updatedStep);
              });
              expect(result.current.stepStateById()(stepId)).toStrictEqual(
                expectedUpdatedStep,
              );
            }
          });
        });
      },
    );
  });
});
