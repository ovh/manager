export const TITLE = {
  MAIN: 'server_export_csv_title',
  COMPLETED: 'server_export_csv_export_completed_title',
};

export enum ExportCsvStateEnum {
  INITIAL = 'initial',
  EXPORT_CONSENT = 'exportConsent',
  ON_EXPORT_CSV = 'onExportCsv',
  EXPORT_COMPLETED = 'exportCompleted',
}
