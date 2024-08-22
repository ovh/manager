import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v6 } from "@ovh-ux/manager-core-api";

export type OnboardingPreferences = {
    lastShowDate?: number;
    numberOfDisplay: number;
    showOnboarding: boolean;
}
type MutationProps = {
    onSuccess?: () => void;
}

const onboardingPreferencesKey = 'OVH_MANAGER_NAVIGATION_GUIDED_TOUR';

const fetchOnboardingPreferences = () => v6.get<OnboardingPreferences>(`/me/preferences/manager/${onboardingPreferencesKey}`)
    .then((response) => {
        const data: any = response.data;
        return JSON.parse(data.value) as OnboardingPreferences;
    }).catch(error => {
        if (error.response.status === 404) {
            return {
                lastShowDate: undefined,
                numberOfDisplay: 1,
                showOnboarding: true
            } as OnboardingPreferences
        }
        throw error;
    });

const updateOnboardingPreferences = (data: OnboardingPreferences) =>
    v6.put(`/me/preferences/manager/${onboardingPreferencesKey}`,
        {
            key: onboardingPreferencesKey,
            value: JSON.stringify(data),
        });

const createOnboardingPreferences = (data: OnboardingPreferences) =>
    v6.post('/me/preferences/manager',
        {
            key: onboardingPreferencesKey,
            value: JSON.stringify(data),
        });


const fetchQueryKey = 'onboarding-preferences'
export const useOnboardingPreferences = ({ enabled }: { enabled?: boolean }) => useQuery({
    queryKey: [fetchQueryKey],
    queryFn: fetchOnboardingPreferences,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: enabled
});

export const useCreateOnboardingPreferences = ({ onSuccess }: MutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOnboardingPreferences,
        onSuccess: () => {
            onSuccess?.();
            queryClient.invalidateQueries({ queryKey: [fetchQueryKey] });
        },
    });
};

export const useUpdateOnboardingPreferences = ({ onSuccess }: MutationProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOnboardingPreferences,
        onSuccess: () => {
            onSuccess?.();
            queryClient.invalidateQueries({ queryKey: [fetchQueryKey] });
        },
    });
};