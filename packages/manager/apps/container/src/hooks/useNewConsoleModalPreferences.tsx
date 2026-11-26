import { useMutation, useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { Preference } from '@/types/preferences';
import { NEW_CONSOLE_MODAL_PREFERENCE_KEY } from '@/components/new-console-modal/newConsoleModal.constants';

export type NewConsoleModalChoice = 'discover' | 'close';

export type NewConsoleModalPreferences = {
  lastShowDate: number;
  lastChoice: NewConsoleModalChoice;
};

const preferenceUrl = `/me/preferences/manager/${NEW_CONSOLE_MODAL_PREFERENCE_KEY}`;
const queryKey = ['new-console-modal-preferences'];

// Resolves to null when the user has never answered the modal.
export const fetchNewConsoleModalPreferences = (): Promise<NewConsoleModalPreferences | null> =>
  v6
    .get<Preference>(preferenceUrl)
    .then(({ data }) => JSON.parse(data.value) as NewConsoleModalPreferences)
    .catch((error) => {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    });

// Same flow as the guided tour preference: create the key the first time,
// update it afterwards.
export const saveNewConsoleModalPreferences = ({
  data,
  exists,
}: {
  data: NewConsoleModalPreferences;
  exists: boolean;
}) => {
  const payload = {
    key: NEW_CONSOLE_MODAL_PREFERENCE_KEY,
    value: JSON.stringify(data),
  };
  return exists
    ? v6.put(preferenceUrl, payload)
    : v6.post('/me/preferences/manager', payload);
};

export const useNewConsoleModalPreferences = ({ enabled }: { enabled?: boolean }) =>
  useQuery({
    queryKey,
    queryFn: fetchNewConsoleModalPreferences,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled,
  });

// The cached query is deliberately not invalidated: the modal decides once per
// page load, and a refetch would re-run that decision while it is closing.
export const useSaveNewConsoleModalPreferences = () =>
  useMutation({ mutationFn: saveNewConsoleModalPreferences });
