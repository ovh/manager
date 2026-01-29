import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEYS } from '@/module.constants';

type ShowNoAgentEnabledMessageType = {
  showBanner: boolean;
  setNoShowBanner: () => void;
};

export const useShowNoAgentEnabledMessage = create<ShowNoAgentEnabledMessageType>()(
  persist(
    (set) => ({
      showBanner: true,
      setNoShowBanner: () => set({ showBanner: false }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.SHOW_NO_AGENT_ENABLED_MESSAGE,
    },
  ),
);
