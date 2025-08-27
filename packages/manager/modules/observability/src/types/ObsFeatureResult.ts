import * as Either from '@effect/data/Either';
import { ObsFeatureType } from './enums/ObsFeatureType';

export type ObsFeatureResult = Either.Either<
  'invalid' | 'undefined',
  ObsFeatureType
>;
