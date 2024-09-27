import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { createStepperSlice, TStepperSlice } from '../slices/stepper.slice';
import { createFormSlice, TFormSlice } from '../slices/form.slice';

export const useAppStore = create<TStepperSlice & TFormSlice>()(
  devtools(
    immer((...a) => ({
      ...createStepperSlice(...a),
      ...createFormSlice(...a),
    })),
    {
      anonymousActionType: 'Store',
      name: 'appStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);
