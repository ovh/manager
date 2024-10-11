import { describe, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './useAppStore';
import { TStep, TStepId } from '../slices/stepper.slice';
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
