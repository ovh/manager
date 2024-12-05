import { useTranslation } from 'react-i18next';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import * as ai from '@/types/cloud/project/ai';

interface NotebookTabsProps {
  notebook: ai.notebook.Notebook;
}

const NotebookTabs = ({ notebook }: NotebookTabsProps) => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');

  const tabs = [
    { href: '', label: t('dashboardTab'), end: true },
    { href: 'attach-data', label: t('dataTab') },
    { href: 'backup', label: t('backupTab') },
    { href: 'logs', label: t('logsTab') },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default NotebookTabs;
