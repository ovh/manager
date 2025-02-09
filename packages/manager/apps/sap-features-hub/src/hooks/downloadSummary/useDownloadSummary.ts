import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { getSummaryJSON, getSummaryFileName } from '@/utils/summaryExport';

export const useDownloadSummary = () => {
  const { values } = useInstallationFormContext();
  const jsonData = getSummaryJSON(values);
  const fileName = getSummaryFileName(values.sapSid);

  const downloadSummary = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return { downloadSummary };
};
