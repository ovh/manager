/* eslint-disable @typescript-eslint/no-shadow */

import React, { useEffect, useState } from 'react';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { clsx } from 'clsx';
import { hashCode } from '../../../utils';

export type TIs = {
  open?: boolean;
  checked?: boolean;
  locked?: boolean;
};

type TOn<T, S = void> = {
  open?: (
    step: T,
    {
      stepIs,
      stepperIs,
      act,
      stepperState,
      setStepperState,
    }: {
      stepIs: TIs;
      stepperIs: Map<T, TIs>;
      act: TAct<T>;
      stepperState: S;
      setStepperState: React.Dispatch<React.SetStateAction<S>>;
    },
  ) => void;
  close?: (
    step: T,
    {
      stepIs,
      stepperIs,
      act,
      stepperState,
      setStepperState,
    }: {
      stepIs: TIs;
      stepperIs: Map<T, TIs>;
      act: TAct<T>;
      stepperState: S;
      setStepperState: React.Dispatch<React.SetStateAction<S>>;
    },
  ) => void;

  check?: (
    step: T,
    {
      stepIs,
      stepperIs,
      act,
      stepperState,
      setStepperState,
    }: {
      stepIs: TIs;
      stepperIs: Map<T, TIs>;
      act: TAct<T>;
      stepperState: S;
      setStepperState: React.Dispatch<React.SetStateAction<S>>;
    },
  ) => void;
  uncheck?: (
    step: T,
    {
      stepIs,
      stepperIs,
      act,
      stepperState,
      setStepperState,
    }: {
      stepIs: TIs;
      stepperIs: Map<T, TIs>;
      act: TAct<T>;
      stepperState: S;
      setStepperState: React.Dispatch<React.SetStateAction<S>>;
    },
  ) => void;

  lock?: (
    step: T,
    {
      stepIs,
      stepperIs,
      act,
      stepperState,
      setStepperState,
    }: {
      stepIs: TIs;
      stepperIs: Map<T, TIs>;
      act: TAct<T>;
      stepperState: S;
      setStepperState: React.Dispatch<React.SetStateAction<S>>;
    },
  ) => void;
  unlock?: (
    step: T,
    {
      stepIs,
      stepperIs,
      act,
      stepperState,
      setStepperState,
    }: {
      stepIs: TIs;
      stepperIs: Map<T, TIs>;
      act: TAct<T>;
      stepperState: S;
      setStepperState: React.Dispatch<React.SetStateAction<S>>;
    },
  ) => void;
};

export type TAct<T> = {
  open: (step: T) => void;
  close: (step: T) => void;

  check: (step: T) => void;
  uncheck: (step: T) => void;

  lock: (step: T) => void;
  unlock: (step: T) => void;
};

export type TStep<T, S = void> = {
  order?: number;
  title?:
    | string
    | JSX.Element
    | (({
        stepIs,
        stepperIs,
        act,
        stepperState,
        setStepperState,
      }: {
        stepIs: TIs;
        stepperIs: Map<T, TIs>;
        act: TAct<T>;
        stepperState: S;
        setStepperState: React.Dispatch<React.SetStateAction<S>>;
      }) => string | JSX.Element);
  content?:
    | string
    | JSX.Element
    | JSX.Element[]
    | (({
        stepIs,
        stepperIs,
        act,
        stepperState,
        setStepperState,
      }: {
        stepIs: TIs;
        stepperIs: Map<T, TIs>;
        act: TAct<T>;
        stepperState: S;
        setStepperState: React.Dispatch<React.SetStateAction<S>>;
      }) => string | JSX.Element | JSX.Element[]);
  is?: TIs;
};

export const useStepper = function useStepper<T, S = void>({
  steps,
  on,
  state,
}: {
  steps: Map<T, TStep<T, S>>;
  on?: TOn<T, S>;
  state?: S;
}) {
  let act: TAct<T>;

  const Component = () => {
    const [stepperState, setStepperState] = useState<S>(state);

    const [is, setIs] = useState<Map<T, TIs>>(new Map());

    useEffect(() => {
      if (steps) {
        const nextIs = new Map(
          [...steps.keys()].map((key) => [
            key,
            {
              open: steps.get(key).is?.open || false,
              checked: steps.get(key).is?.checked || false,
              locked: steps.get(key).is?.locked || false,
            },
          ]),
        );
        setIs(nextIs);
      }
    }, []);

    act = {
      open: (step: T) => {
        const newIs = new Map(is);
        if (newIs.has(step) && newIs.get(step).open === false) {
          newIs.get(step).open = true;
          setIs(newIs);
          if (on && on.open) {
            on.open(step, {
              stepIs: is.get(step),
              stepperIs: is,
              act,
              stepperState,
              setStepperState,
            });
          }
        }
      },
      close: (step: T) => {
        const newIs = new Map(is);
        if (newIs.has(step) && newIs.get(step).open === true) {
          newIs.get(step).open = false;
          setIs(newIs);
          if (on && on.close) {
            on.close(step, {
              stepIs: is.get(step),
              stepperIs: is,
              act,
              stepperState,
              setStepperState,
            });
          }
        }
      },
      check: (step: T) => {
        const newIs = new Map(is);
        if (newIs.has(step) && newIs.get(step).checked === false) {
          newIs.get(step).checked = true;
          setIs(newIs);
          if (on && on.check) {
            on.check(step, {
              stepIs: is.get(step),
              stepperIs: is,
              act,
              stepperState,
              setStepperState,
            });
          }
        }
      },
      uncheck: (step: T) => {
        const newIs = new Map(is);
        if (newIs.has(step) && newIs.get(step).checked === true) {
          newIs.get(step).checked = false;
          setIs(newIs);
          if (on && on.uncheck) {
            on.uncheck(step, {
              stepIs: is.get(step),
              stepperIs: is,
              act,
              stepperState,
              setStepperState,
            });
          }
        }
      },

      lock: (step: T) => {
        const newIs = new Map(is);
        if (newIs.has(step) && newIs.get(step).locked === false) {
          newIs.get(step).locked = true;
          setIs(newIs);
          if (on && on.lock) {
            on.lock(step, {
              stepIs: is.get(step),
              stepperIs: is,
              act,
              stepperState,
              setStepperState,
            });
          }
        }
      },
      unlock: (step: T) => {
        const newIs = new Map(is);
        if (newIs.has(step) && newIs.get(step).locked === true) {
          newIs.get(step).locked = false;
          setIs(newIs);
          if (on && on.unlock) {
            on.unlock(step, {
              stepIs: is.get(step),
              stepperIs: is,
              act,
              stepperState,
              setStepperState,
            });
          }
        }
      },
    };

    return (
      steps.size === is.size && (
        <section className="grid grid-cols-1 gap-4">
          {[...steps.keys()].map((key, index) => (
            <div
              key={hashCode(key)}
              className="flex flex-row border-0 border-t-[1px] border-solid border-t-[#b3b3b3] pt-5"
            >
              <div className="basis-[40px]">
                {is.get(key).checked ? (
                  <OsdsIcon
                    size={ODS_ICON_SIZE.sm}
                    name={ODS_ICON_NAME.CHECK}
                    className={'mr-2'}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                ) : (
                  <div
                    className={clsx(
                      'flex justify-center items-center font-bold border-2 border-solid rounded-full h-10 w-10',
                      is.get(key).open
                        ? 'border-[#0050d7] text-[#0050d7]'
                        : 'border-[grey] text-[grey]',
                    )}
                  >
                    {steps.get(key).order || index}
                  </div>
                )}
              </div>
              <div className="basis-full px-5">
                <div>
                  {(() => {
                    const { title } = steps.get(key);

                    if (typeof title === 'function') {
                      const TitleComponent = title as ({
                        stepIs,
                        stepperIs,
                        act,
                        stepperState,
                        setStepperState,
                      }: {
                        stepIs: TIs;
                        stepperIs: Map<T, TIs>;
                        act: TAct<T>;
                        stepperState: S;
                        setStepperState: React.Dispatch<
                          React.SetStateAction<S>
                        >;
                      }) => JSX.Element;
                      return (
                        <TitleComponent
                          stepIs={is.get(key)}
                          stepperIs={is}
                          act={act}
                          stepperState={stepperState}
                          setStepperState={setStepperState}
                        />
                      );
                    }
                    return title;
                  })()}
                </div>
                <div
                  className={clsx(
                    'mt-5',
                    is.get(key).locked &&
                      'cursor-not-allowed pointer-events-none opacity-50',
                    !is.get(key).open && 'hidden',
                  )}
                >
                  {(() => {
                    const { content } = steps.get(key);

                    if (typeof content === 'function') {
                      const ContentComponent = content as ({
                        stepIs,
                        stepperIs,
                        act,
                        stepperState,
                        setStepperState,
                      }: {
                        stepIs: TIs;
                        stepperIs: Map<T, TIs>;
                        act: TAct<T>;
                        stepperState: S;
                        setStepperState: React.Dispatch<
                          React.SetStateAction<S>
                        >;
                      }) => JSX.Element;
                      return (
                        <ContentComponent
                          stepIs={is.get(key)}
                          stepperIs={is}
                          act={act}
                          stepperState={stepperState}
                          setStepperState={setStepperState}
                        />
                      );
                    }
                    return content;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </section>
      )
    );
  };

  return {
    act,
    Component,
  };
};
