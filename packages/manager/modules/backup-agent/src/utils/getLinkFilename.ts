export const getLinkFilename = (downloadLink: string) => {
  try {
    return new URL(downloadLink).pathname.split('/').pop();
  } catch {
    return '';
  }
};
