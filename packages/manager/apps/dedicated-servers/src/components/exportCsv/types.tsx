import { SetStateAction, Dispatch } from 'react';

export type SetStateType<T> = Dispatch<SetStateAction<T>>;

export enum ExportCsvStateEnum {
  initial = 'initial',
  exportConsent = 'exportConsent',
  onExport = 'onExport',
  exportCompleted = 'exportCompleted',
}
