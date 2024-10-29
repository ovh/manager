import { renderHook } from '@testing-library/react';
import { StepsEnum, useCreateStore } from '@/pages/create/store';

export const useTestUtils = () => {
  const { result } = renderHook(() => useCreateStore());

  const prepareStep = (step: StepsEnum) => {
    result.current.open(step);
  };
};
