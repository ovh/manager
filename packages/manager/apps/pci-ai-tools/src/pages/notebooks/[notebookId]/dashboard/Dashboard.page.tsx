import { useTranslation } from 'react-i18next';
import {
  Atom,
  Link,
  RefreshCcwDot,
  Settings2,
  Tag,
  TerminalSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Code,
  Skeleton,
  bash,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import { useNotebookData } from '../Notebook.context';
import Resources from './_components/Resources.component';
import Configurations from './_components/Configuration.component';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import LifeCycle from './_components/LifeCycle.component';
import Labels from './_components/Labels.component';
import AccessLink from './_components/AccessLink.component';
import { VOLUMES_CONFIG } from '@/components/order/volumes/volume.const';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/configuration/guide';
import ai from '@/types/AI';
import { useGetCommand } from '@/data/hooks/ai/notebook/useGetCommand.hook';
import BillingSupport from '@/components/biling-support/BillingSupport.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import {
  EmulatorRoadmapLinks,
  NotebookRoadmapLinks,
} from '@/configuration/roadmap-changelog.constants';
import { useQuantum } from '@/hooks/useQuantum.hook';

const Dashboard = () => {
  const { notebook, projectId } = useNotebookData();
  const isQuantum = useQuantum();

  const { t } = useTranslation('ai-tools/notebooks/notebook/dashboard');
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
      (vol) => vol.mountPath !== VOLUMES_CONFIG.mountDirectory.savedPath,
    );
    const notebookInfo: ai.notebook.NotebookSpecInput = {
      ...notebook.spec,
      volumes: filteredVolume,
    };
    getCommand({ projectId, notebookInfo });
  }, [notebook]);

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('dashboardTitle')}</h2>
        <div className="flex flex-row gap-2">
          <RoadmapChangelog
            links={isQuantum ? EmulatorRoadmapLinks : NotebookRoadmapLinks}
          />
          <Guides
            section={[
              GuideSections.cli,
              GuideSections.ovhaiCli,
              GuideSections.data,
              GuideSections.faq,
            ]}
          />
        </div>
      </div>
      <div
        className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2"
        data-testid="dashboard-container"
      >
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
          <BillingSupport />
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
            {command ? (
              <Code
                label={t('cliCodeTitle')}
                code={command.command}
                theme={githubDark}
                lang={bash}
                onCopied={() =>
                  toast({
                    title: t('cliEquivalentToastMessage'),
                  })
                }
                lineNumbers={true}
              />
            ) : (
              <Skeleton className="w-full h-52" />
            )}
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
