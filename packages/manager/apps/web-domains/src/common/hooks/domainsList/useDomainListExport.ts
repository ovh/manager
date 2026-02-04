import { useState } from 'react';

interface ExportProgress {
  current: number;
  total: number;
  percentage: number;
}

interface ExportDone {
  filename: string;
  downloadUrl: string;
  total: number;
}

export const useDomainListExport = () => {
  const [isDrawerExportOpen, setIsDrawerExportOpen] = useState(false);
  const [modalServiceNames, setModalServiceNames] = useState<string[]>([]);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null,
  );
  const [exportDone, setExportDone] = useState<ExportDone | null>(null);
  const [exportAllServices, setExportAllServices] = useState(false);

  const openDrawer = (serviceNames: string[]) => {
    setModalServiceNames(serviceNames);
    setIsDrawerExportOpen(true);
    setExportAllServices(serviceNames?.length === 0);
  };

  const closeDrawer = () => {
    setIsDrawerExportOpen(false);
  };

  return {
    isDrawerExportOpen,
    modalServiceNames,
    exportProgress,
    exportDone,
    exportAllServices,
    openDrawer,
    closeDrawer,
    setExportProgress,
    setExportDone,
    setIsDrawerExportOpen,
  };
};
