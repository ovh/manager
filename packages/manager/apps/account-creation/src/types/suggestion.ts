import { Company } from './company';

export type CompanySuggestion = {
  entryList: Company[];
  provider: string;
  type: string;
  hasMore?: boolean;
};

export type CompanySuggestionError = {
  class: CompanySuggestionErrorClass;
  message: number;
  details: {
    siret?: string;
  };
};
/**
 * `GET /me/suggest/germanRegistersByCourt` (contract of
 * `@ovhcloud/manager-api-types` 0.13.0 `suggest.*`, not a dependency here).
 */
export enum RegisterTypeEnum {
  GnR = 'GnR',
  GsR = 'GsR',
  HRA = 'HRA',
  HRB = 'HRB',
  PR = 'PR',
  VR = 'VR',
}

export type GermanRegisterCourt = {
  /** Court code, unique */
  code: string;
  /** Court name, not unique */
  name: string;
  /** Register types kept by the court */
  registers: RegisterTypeEnum[];
};

export type GermanRegisterCourtList = {
  courts: GermanRegisterCourt[];
  registerTypes: RegisterTypeEnum[];
};

export enum CompanySuggestionErrorClass {
  SiretInvalidFormat = 'Client::BadRequest::SiretInvalidFormat',
  SiretInactive = 'Client::BadRequest::SiretInactive',
  SiretNotFound = 'Client::NotFound::SiretNotFound',
  RateLimitExceeded = 'Client::TooManyRequests::RateLimited',
  InternalServerError = '	Server::InternalServerError::InternalError',
}
