export const downloadContent = ({
  fileContent,
  fileName,
  downloadType,
}: {
  fileContent: string;
  fileName: string;
  downloadType: string;
}) => {
  const blob = new Blob([fileContent], { type: downloadType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
