import React from 'react';

export type GeneralInfoItem = {
  id: string;
  label?: string;
  value: React.ReactNode;
};

export type GeneralInfoTile = {
  title: string;
  help?: string;
  items: GeneralInfoItem[];
};

export type GeneralInformationProps = {
  tiles: GeneralInfoTile[];
};
