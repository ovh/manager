import React from 'react';
import clsx from 'clsx';
import { Meta } from '@storybook/react';
import { v4 as uuidv4 } from 'uuid';
import {
  OsdsButton,
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import StepComponent from '../step/Step.component';
import { TAct, TIs, TStep, useStepper } from './useStepper';
import TilesInputComponent from '../../input/tiles/TilesInput.component';
import { StepsEnum } from '../../../_mock_/stepper';
import {
  countries as allCountries,
  TCountry,
} from '../../../_mock_/tiles-input';

export default {
  title: 'Components/Stepper',
  component: StepComponent,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive stepper component.',
      },
    },
  },
} as Meta;

// <editor-fold description="Default">

type TDefaultState = {
  step?: StepsEnum;
  action?: ActionsEnum;
  logs: string[];
};

const defaultSteps: Map<StepsEnum, TStep<StepsEnum, TDefaultState>> = new Map(
  Object.keys(StepsEnum)
    .slice(0, 5)
    .map((key, index) => [
      key as StepsEnum,
      {
        title: ({ stepIs, act }) => (
          <div className="flex w-full">
            <div className="w-full">
              {index % 2 ? (
                `Title ${index + 1} as string`
              ) : (
                <h2>
                  <b>
                    <i>{`Title ${index + 1} as JSX`}</i>
                  </b>
                </h2>
              )}
              (open : {stepIs.open ? 'true' : 'false'}) - (checked :{' '}
              {stepIs.checked ? 'true' : 'false'}) - (locked :{' '}
              {stepIs.locked ? 'true' : 'false'})
            </div>
            {stepIs.locked && (
              <div className="w-3/5">
                <OsdsLink
                  className="float-left md:float-right"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  onClick={() => {
                    const stepsArr = Object.keys(StepsEnum).map(
                      (s) => s as StepsEnum,
                    );
                    stepsArr.forEach((step, i) => {
                      if (i >= index && i !== stepsArr.length - 1) {
                        act.uncheck(step);
                        act.unlock(step);
                        if (i > index) act.close(step);
                      }
                    });
                  }}
                >
                  Edit this step
                </OsdsLink>
              </div>
            )}
          </div>
        ),
        order: index + 1,
        Content: ({ stepIs, act }: { stepIs: TIs; act: TAct<StepsEnum> }) => {
          const stepsArr = Object.keys(StepsEnum).map((s) => s as StepsEnum);
          const [step, nextStep] = [
            key as StepsEnum,
            index < stepsArr.length - 1 ? stepsArr[index + 1] : undefined,
          ];

          return (
            <div>
              <div>this is content of step {key}</div>
              {index !== stepsArr.length - 1 ? (
                <div>
                  {stepIs.checked && (
                    <OsdsButton
                      color={ODS_THEME_COLOR_INTENT.info}
                      size={ODS_BUTTON_SIZE.sm}
                      inline={true}
                      className="float-right"
                      onClick={() => {
                        act.lock(step);
                        if (nextStep) act.open(nextStep);
                      }}
                    >
                      Next
                    </OsdsButton>
                  )}
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.success}
                    size={ODS_BUTTON_SIZE.sm}
                    inline={true}
                    className={clsx('float-right', stepIs.checked && 'mr-2')}
                    onClick={() => {
                      act.check(step);
                    }}
                  >
                    Validate
                  </OsdsButton>
                </div>
              ) : (
                <div>
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.accent}
                    size={ODS_BUTTON_SIZE.sm}
                    inline={true}
                    className="float-right"
                    onClick={() => {
                      act.check(step);
                    }}
                  >
                    Validate
                  </OsdsButton>
                </div>
              )}
              {index === stepsArr.length - 1 && stepIs.checked && (
                <div className="mt-4">
                  <OsdsMessage color={ODS_THEME_COLOR_INTENT.success}>
                    The stepper has been validated
                  </OsdsMessage>
                </div>
              )}
            </div>
          );
        },
        is: {
          open: key === StepsEnum.FIRST_STEP,
        },
      },
    ]),
).set(StepsEnum.FIFTH_STEP, {
  order: 5,
  is: {
    open: true,
  },
  title: 'Logs',
  Content: ({
    stepperState,
    stepperIs,
  }: {
    stepperState: TDefaultState;
    stepperIs: Map<StepsEnum, TIs>;
  }) => (
    <div className="flex">
      <fieldset className="w-1/2 border rounded p-2">
        <legend>Logs:</legend>
        <ul>
          {stepperState.logs.map((log) => (
            <li key={uuidv4()}>{log}</li>
          ))}
        </ul>
      </fieldset>
      <fieldset className="w-1/2 border rounded p-2">
        <legend>State</legend>
        <ul>
          {Array.from(stepperIs.keys()).map((key) => (
            <li key={uuidv4()}>
              {`${key} => `}
              <pre>{JSON.stringify(stepperIs.get(key), null, 2)}</pre>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  ),
});

const DefaultTemplate = () => {
  const { Component: Stepper } = useStepper<StepsEnum, TDefaultState>({
    steps: defaultSteps,
    on: {
      open: (step: StepsEnum, { setStepperState }) => {
        setStepperState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ open`],
        }));
      },
      close: (step: StepsEnum, { setStepperState }) => {
        setStepperState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ close`],
        }));
      },
      check: (step: StepsEnum, { setStepperState }) => {
        setStepperState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ check`],
        }));
      },
      uncheck: (step: StepsEnum, { setStepperState }) => {
        setStepperState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ uncheck`],
        }));
      },
      lock: (step: StepsEnum, { setStepperState }) => {
        setStepperState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ lock`],
        }));
      },
      unlock: (step: StepsEnum, { setStepperState }) => {
        setStepperState((prev) => ({
          ...prev,
          logs: [...prev.logs, `Step __${step}__ unlock`],
        }));
      },
    },
    state: {
      step: undefined,
      action: undefined,
      logs: [],
    },
  });

  return (
    <div>
      <Stepper />
    </div>
  );
};

export const DefaultDemo = DefaultTemplate.bind({});

DefaultDemo.args = {};

// </editor-fold >

// <editor-fold description="With tiles input">

type TInputState = {
  name: string;
  country: TCountry;
  continent: string;
};

const inputSteps: Map<StepsEnum, TStep<StepsEnum, TInputState>> = new Map([
  [
    StepsEnum.FIRST_STEP,
    {
      order: 1,
      is: {
        open: true,
      },
      title: ({
        act,
        stepIs,
        setStepperState,
      }: {
        act: TAct<StepsEnum>;
        stepIs: TIs;
        setStepperState: React.Dispatch<React.SetStateAction<TInputState>>;
      }) => (
        <div className="flex w-full">
          <div className="w-full">
            <h1>Select a name</h1>
          </div>
          {stepIs.locked && (
            <div className="w-3/5">
              <OsdsLink
                className="float-left md:float-right"
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  setStepperState((prev) => ({ ...prev, country: undefined }));

                  act.uncheck(StepsEnum.SECOND_STEP);
                  act.unlock(StepsEnum.SECOND_STEP);
                  act.close(StepsEnum.SECOND_STEP);

                  act.uncheck(StepsEnum.THIRD_STEP);
                  act.unlock(StepsEnum.THIRD_STEP);
                  act.close(StepsEnum.THIRD_STEP);

                  act.unlock(StepsEnum.FIRST_STEP);
                }}
              >
                Edit this step
              </OsdsLink>
            </div>
          )}
        </div>
      ),
      Content: ({
        act,
        stepperState,
        setStepperState,
      }: {
        act: TAct<StepsEnum>;
        stepperState: TInputState;
        setStepperState: React.Dispatch<React.SetStateAction<TInputState>>;
      }) => (
        <>
          <div>
            <input
              className="border"
              value={stepperState.name}
              onChange={(event) =>
                setStepperState((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
            <div>
              {stepperState.name && (
                <OsdsButton
                  color={ODS_THEME_COLOR_INTENT.info}
                  size={ODS_BUTTON_SIZE.sm}
                  inline={true}
                  className="float-right"
                  onClick={() => {
                    act.check(StepsEnum.FIRST_STEP);
                    act.lock(StepsEnum.FIRST_STEP);
                    act.open(StepsEnum.SECOND_STEP);
                  }}
                >
                  Next
                </OsdsButton>
              )}
            </div>
          </div>
        </>
      ),
    },
  ],
  [
    StepsEnum.SECOND_STEP,
    {
      order: 2,
      title: ({
        act,
        stepIs,
        setStepperState,
      }: {
        act: TAct<StepsEnum>;
        stepIs: TIs;
        setStepperState: React.Dispatch<React.SetStateAction<TInputState>>;
      }) => (
        <div className="flex w-full">
          <div className="w-full">
            <h1>Select a name</h1>
          </div>
          {stepIs.locked && (
            <div className="w-3/5">
              <OsdsLink
                className="float-left md:float-right"
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  act.uncheck(StepsEnum.THIRD_STEP);
                  act.unlock(StepsEnum.THIRD_STEP);
                  act.close(StepsEnum.THIRD_STEP);

                  act.unlock(StepsEnum.SECOND_STEP);
                }}
              >
                Edit this step
              </OsdsLink>
            </div>
          )}
        </div>
      ),
      Content: ({
        act,
        stepperState,
        setStepperState,
      }: {
        act: TAct<StepsEnum>;
        stepperState: TInputState;
        setStepperState: React.Dispatch<React.SetStateAction<TInputState>>;
      }) => {
        return (
          <>
            <TilesInputComponent<TCountry, string, string>
              items={allCountries}
              value={stepperState?.country}
              label={(country: TCountry) => country?.name}
              group={{
                by: (country: TCountry) => country.continent,
                label: (continent: string, countries: TCountry[]) => (
                  <OsdsText
                    breakSpaces={false}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                    color={
                      continent === stepperState.continent
                        ? ODS_THEME_COLOR_INTENT.text
                        : ODS_THEME_COLOR_INTENT.primary
                    }
                  >
                    <div
                      className={clsx(
                        continent === stepperState.continent && 'font-bold',
                        'whitespace-nowrap px-2 text-lg',
                      )}
                    >
                      {continent === undefined
                        ? 'All countries'
                        : countries[0].continent}
                    </div>
                  </OsdsText>
                ),
                showAllTab: true,
                onChange: (continent: string) => {
                  setStepperState((prev) => ({ ...prev, continent }));
                },
              }}
              stack={{
                by: (country: TCountry) => country?.language,
                label: (language: string, countries: TCountry[]) => {
                  return `${language} (${countries?.length})`;
                },
                title: (language: string, countries: TCountry[]) =>
                  `Countries of ${language}(${countries?.length}):`,
              }}
              onInput={(country) => {
                setStepperState((prev) => ({ ...prev, country }));
              }}
            />
            {stepperState.country && (
              <div className="mt-4">
                {stepperState.name && (
                  <OsdsButton
                    color={ODS_THEME_COLOR_INTENT.info}
                    size={ODS_BUTTON_SIZE.sm}
                    inline={true}
                    className="float-right"
                    onClick={() => {
                      act.check(StepsEnum.SECOND_STEP);
                      act.lock(StepsEnum.SECOND_STEP);
                      act.open(StepsEnum.THIRD_STEP);
                    }}
                  >
                    Next
                  </OsdsButton>
                )}
              </div>
            )}
          </>
        );
      },
    },
  ],
  [
    StepsEnum.THIRD_STEP,
    {
      order: 3,
      title: <h2>Validate</h2>,
      Content: ({ stepperState }: { stepperState: TInputState }) => {
        return (
          <>
            <div>State is:</div>
            <div>{JSON.stringify(stepperState, null, 2)}</div>
          </>
        );
      },
    },
  ],
]);

const InputTemplate = () => {
  const { Component: Stepper } = useStepper<StepsEnum, TInputState>({
    steps: inputSteps,
    state: { country: undefined, name: '', continent: undefined },
  });

  return (
    <>
      <Stepper />
    </>
  );
};

export const InputDemo = InputTemplate.bind({});

InputDemo.args = {};
// </editor-fold>
