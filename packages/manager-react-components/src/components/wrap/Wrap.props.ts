import React from 'react';

export interface WrapComponentProps {
  children: React.ReactNode;
  preset?: WrapPreset;
  className?: string;
}

export enum WrapPreset {
  subtitle = 'heading-3',
  title = 'heading-1',
}
