import { ObsFeatureType } from './enums/ObsFeatureType';
import { Result } from './Result';

export type ObsFeatureResult = Result<ObsFeatureType, 'invalid' | 'undefined'>;
