import React from 'react';

export interface ErrorData {
  /** Optional message from API or boundary error */
  message?: string;
  /** Optional extra error details, can be string or object */
  detail?: unknown;
}

export interface ErrorMessage {
  message?: string;
  status?: number;
  detail?: {
    status: number;
  };
}

export interface ErrorHeaders {
  /** OVH query identifier header */
  ['x-ovh-queryid']?: string;
  /** Allow arbitrary headers safely */
  [key: string]: string | undefined;
}

export interface ErrorObject {
  status?: number;
  data?: ErrorData;
  headers?: ErrorHeaders;
}

export interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Error object containing status, data, and headers */
  error?: ErrorObject | null;
  /** Optional handler for home redirection */
  onRedirectHome?: () => void;
  /** Optional handler for page reload */
  onReloadPage?: () => void;
  /** Tracking label for analytics */
  labelTracking?: string;
}
