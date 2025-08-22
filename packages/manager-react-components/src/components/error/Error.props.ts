import React from 'react';

export interface ErrorObject {
  status: number;
  data: any;
  headers: any;
}

export interface ErrorMessage {
  message?: string;
  status?: number;
  detail?: any;
}

export const TRACKING_LABELS = {
  SERVICE_NOT_FOUND: 'service_not_found',
  UNAUTHORIZED: 'unauthorized',
  PAGE_LOAD: 'error_during_page_loading',
};

export interface ErrorProps extends React.HTMLProps<HTMLDivElement> {
  error: {
    status?: number;
    data?: any;
    headers?: any;
  };
  onRedirectHome?: () => void;
  onReloadPage?: () => void;
  labelTracking?: string;
}
