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
  bash,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import Configurations from './_components/Configuration.component';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import ai from '@/types/AI';
import LifeCycle from './_components/LifeCycle.component';
import Labels from './_components/Labels.component';
import AppGeneralInfo from './_components/GeneralInformation.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/configuration/guide';
import { useAppData } from '../App.context';
import ResourcesSpec from '@/components/resources-spec/ResourcesSpec.component';
import BillingSupport from '@/components/biling-support/BillingSupport.component';
import ScalingStrat from './_components/Scaling.component';
import DockerCommand from './_components/DockerCommand.component';
import { useGetCommand } from '@/data/hooks/ai/app/useGetCommand.hook';

const Dashboard = () => {
  const { app, projectId } = useAppData();
  const { t } = useTranslation('ai-tools/apps/app/dashboard');
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
    const appInfo = {
      command: app.spec?.command,
      defaultHttpPort: app.spec?.defaultHttpPort,
      envVars: app.spec?.envVars,
      grpcPort: app.spec?.grpcPort,
      image: app.spec?.image,
      labels: app.spec?.labels,
      name: app.spec?.name,
      partnerId: app.spec?.partnerId,
      region: app.spec?.region,
      resources: app.spec?.resources,
      unsecureHttp: app.spec?.unsecureHttp,
      volumes: app.spec?.volumes,
    };

    getCommand({ projectId, appInfo });
  }, [app]);

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
              <span>{t('generalInfoTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <AppGeneralInfo />
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
          {!app.spec.partnerId && (
            <CardContent>
              <DockerCommand />
            </CardContent>
          )}
        </Card>
        <Card>
          <CardHeader>
            <h4>
              <Atom className="size-4 inline mr-2" />
              <span>{t('resourcesTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <ScalingStrat />
          </CardContent>
          <div className="border-t my-2 pt-2 mx-6"></div>
          <CardContent>
            <ResourcesSpec resources={app.spec.resources} allowUpdate={true} />
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
            )}
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
