import { useContext } from 'react';

import { BackupAgentContext } from '@/BackupAgent.context';
import { FEATURE_AVAILABILITY } from '@/module.constants';
import { Feature } from '@/types/Feature.type';

export const useGetFeaturesAvailabilityNames = <T extends readonly Feature[]>(
  features: T,
): Record<T[number], string> => {
  const { appName } = useContext(BackupAgentContext);

  return features.reduce<Record<Feature, string>>(
    (acc, feature) => {
      acc[feature] = `${appName}:${FEATURE_AVAILABILITY[feature]}`;
      return acc;
    },
    {} as Record<T[number], string>,
  );
};
