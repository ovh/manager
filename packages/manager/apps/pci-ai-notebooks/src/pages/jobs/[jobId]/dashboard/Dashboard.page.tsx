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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Configurations from './_components/Configuration.component';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import CliCodeBlock from '@/components/cli-code-block/CliCodeBlock.component';
import LifeCycle from './_components/LifeCycle.component';
import Labels from './_components/Labels.component';
import AccessLink from './_components/AccessLink.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/configuration/guide';
import { useJobData } from '../Job.context';
import { useGetCommand } from '@/hooks/api/ai/job/useGetCommand.hook';
import ResourcesSpec from '@/components/resources-spec/ResourcesSpec.component';
import BillingSupport from '@/components/biling-support/BillingSupport.component';

const Dashboard = () => {
  const { job, projectId } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/dashboard');
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
    const jobInfo = { ...job.spec };
    delete jobInfo.deletionRequested;
    delete jobInfo.shutdown;
    getCommand({ projectId, jobInfo });
  }, [job]);

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('dashboardTitle')}</h2>
        <Guides
          section={[
            GuideSections.cli,
            GuideSections.ovhaiCli,
            GuideSections.data,
            GuideSections.faq,
          ]}
        />
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
            <ResourcesSpec resources={job.spec.resources} />
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
