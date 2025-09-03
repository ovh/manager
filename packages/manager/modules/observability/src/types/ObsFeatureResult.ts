import { Effect } from 'effect';
import { ObsFeatureType } from './enums/ObsFeatureType';

export type ObsFeatureResult = Effect.Effect<
  ObsFeatureType,
  'undefined' | 'invalid'
>;
