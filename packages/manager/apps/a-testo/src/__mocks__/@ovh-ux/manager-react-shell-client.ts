import React from 'react';
import { vi } from 'vitest';

// Create a mock ShellContext
export const ShellContext = React.createContext(null);

// Mock types
export type ShellContextType = {
  shell: any;
  environment: any;
  tracking?: any;
};

export type TrackingContextParams = any;

// Mock functions
const trackClickMock = vi.fn();
export const useOvhTracking = () => ({ trackClick: trackClickMock });
export const initShellContext = vi.fn();
export const initI18n = vi.fn();
export const PageType = {} as any;

