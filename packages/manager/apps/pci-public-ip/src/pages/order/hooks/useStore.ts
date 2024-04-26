import { create } from 'zustand';
import { IPTypeEnum, TFormState } from '@/api/types';

type Store = {
  form: TFormState;
  setForm: (newForm: TFormState) => void;
};

export const useOrderStore = create<Store>()((set) => {
  return {
    form: {
      ipType: IPTypeEnum.FAILOVER,
      failoverCountry: null,
      floatingRegion: null,
      instance: null,
      ipAddress: null,
      floatingGatewaySize: null,
    },
    setForm: (newForm: TFormState) =>
      set((state) => {
        return {
          ...state,
          form: { ...newForm },
        };
      }),
  };
});
