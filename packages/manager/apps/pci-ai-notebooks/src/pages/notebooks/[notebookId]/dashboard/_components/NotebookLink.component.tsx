import {
  Activity,
  ArrowUpRightFromSquare,
  NotebookPenIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { Button } from '@/components/ui/button';

import A from '@/components/links/A.component';

const NotebookLink = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');

  return (
    <>
      <div className="flex flex-row gap-2 items-center mb-2">
        <h5>{t('liveCodeEditorTitle')}</h5>
        <NotebookPenIcon className="size-4" />
      </div>
      <Button className="w-full" type="button" variant="default">
        <A href={notebook.status.url} target="_blank" rel="noopener noreferrer">
          <div className="flex flex-row gap-1 items-center text-white capitalize">
            {notebook.spec.env.editorId}
            <ArrowUpRightFromSquare className="size-4" />
          </div>
        </A>
      </Button>
      <div className="flex flex-row gap-2 items-center mt-4 mb-2">
        <h5>{t('grafanaTitle')}</h5>
        <Activity className="size-4" />
      </div>
      <Button className="w-full" type="button" variant="outline">
        <A
          href={notebook.status.monitoringUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-row gap-1 items-center ">
            {t('grafanaButton')}
            <ArrowUpRightFromSquare className="size-4" />
          </div>
        </A>
      </Button>
    </>
  );
};

export default NotebookLink;
