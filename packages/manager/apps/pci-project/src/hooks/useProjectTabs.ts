import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROJECT_TABS } from '@/constants/tabs.constant';

export type ProjectTabWithFullPath = {
  name: string;
  titleKey: string;
  title: string;
  to: string; // Full path instead of relative path
};

/**
 * Hook to build complete paths for project tabs
 * Fixes the issue where TabsPanel doesn't activate tabs correctly due to path mismatch
 */
export const useProjectTabs = (): ProjectTabWithFullPath[] => {
  const { t } = useTranslation('project');
  const { projectId } = useParams<{ projectId: string }>();

  return PROJECT_TABS.map((tab) => ({
    ...tab,
    title: t(tab.titleKey),
    // Construct full path based on the route structure
    to:
      tab.to === ''
        ? `/pci/projects/${projectId}` // Home tab (empty string)
        : `/pci/projects/${projectId}/${tab.to}`, // Settings tab ('edit')
  }));
};
