import { ReactNode } from "react";

export enum GuidePlacement {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export type GuideStep = {
  route: string;
  text: ReactNode;
  anchor: string;
  placement?: GuidePlacement;
  /**
   * Called before showing the step, after the route has been navigated to
   */
  onBeforeEnter?: () => Promise<void> | void;
  /**
   * Called after showing the step
   */
  onAfterEnter?: () => Promise<void> | void;
};
