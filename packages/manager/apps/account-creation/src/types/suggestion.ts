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
export enum CompanySuggestionErrorClass {
  SiretInvalidFormat = 'Client::BadRequest::SiretInvalidFormat',
  SiretInactive = 'Client::BadRequest::SiretInactive',
  SiretNotFound = 'Client::NotFound::SiretNotFound',
  RateLimitExceeded = 'Client::TooManyRequests::RateLimited',
  InternalServerError = '	Server::InternalServerError::InternalError',
}
