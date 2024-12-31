import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Atom,
  Link,
  RefreshCcwDot,
  Settings2,
  Tag,
  TerminalSquare,
  UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNotebookData } from '../Notebook.context';
import Resources from './_components/Resources.component';
import Configurations from './_components/Configuration.component';
import { useGetCommand } from '@/hooks/api/ai/notebook/useGetCommand.hook';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import CliCodeBlock from '@/components/cli-code-block/CliCodeBlock.component';
import OvhLink from '@/components/links/OvhLink.component';
import LifeCycle from './_components/LifeCycle.component';
import Labels from './_components/Labels.component';
import AccessLink from './_components/AccessLink.component';

const Dashboard = () => {
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  const { toast } = useToast();
  const [command, setCommand] = useState<ai.Command>();

  const { getCommand } = useGetCommand({
    onError: (err) => {
      toast({
        title: t('errorGetCommandCli'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: (cliCommand) => {
      setCommand(cliCommand);
    },
  });

  useEffect(() => {
    const filteredVolume: ai.volume.Volume[] = notebook.spec.volumes.filter(
      (vol) => vol.mountPath !== '/workspace',
    );
    const notebookInfo: ai.notebook.NotebookSpecInput = {
      ...notebook.spec,
      volumes: filteredVolume,
    };
    getCommand({ projectId, notebookInfo });
  }, [notebook]);

  return (
    <>
      <h2>{t('dashboardTitle')}</h2>
      <div className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2">
        <Card>
          <CardHeader>
            <h4>
              <Link className="size-4 inline mr-2" />
              <span>{t('accessLinkTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <AccessLink />
          </CardContent>
          <div className="border-t my-2 pt-2 mx-6"></div>
          <h4 className="px-6 mb-4">
            <Tag className="size-4 inline mr-2" />
            <span>{t('labelsTitle')}</span>
          </h4>
          <CardContent>
            <Labels />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h4>
              <RefreshCcwDot className="size-4 inline mr-2" />
              <span>{t('lifeCycleTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <LifeCycle />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h4>
              <Atom className="size-4 inline mr-2" />
              <span>{t('resourcesTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <Resources />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h4>
              <UserCheck className="inline size-4 mr-2 mb-1" />
              {t('billingSupportTitle')}
            </h4>
          </CardHeader>
          <CardContent>
            <div
              data-testid="dashboard-billing-link"
              className="flex flex-row gap-1 mt-3"
            >
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/billing`}
              >
                {t('billingLink')}
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
            <div
              data-testid="dashboard-support-link"
              className="flex flex-row gap-1 mt-2"
            >
              <OvhLink application="dedicated" path={`#/support/tickets/new`}>
                {t('supportLink')}
              </OvhLink>
              <ArrowRight className="w-4 h-4 ml-1 mt-1 text-primary" />
            </div>
          </CardContent>
          <div className="border-t my-2 pt-2 mx-6"></div>
          <h4 className="px-6 mb-4">
            <Settings2 className="inline size-4 mr-2 mb-1" />
            {t('configurationTitle')}
          </h4>

          <CardContent>
            <Configurations />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <h4>
              <TerminalSquare className="size-4 inline mr-2" />
              <span>{t('cliTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            {command && (
              <CliCodeBlock title={t('cliCodeTitle')} code={command.command} />
            )}
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
