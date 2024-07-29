import { AlertTriangleIcon, Copy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';

interface SharedDockerProps {
  regions: ai.capabilities.Region[];
}

const SharedDocker = ({ regions }: SharedDockerProps) => {
  const { t } = useTranslation('pci-ai-dashboard/docker');
  const { t: tRegions } = useTranslation('regions');
  const { projectId } = useParams();
  const [selectedRegion, setSelectedRegion] = useState<ai.capabilities.Region>(
    regions[0],
  );
  const toast = useToast();

  const dockerLogin = `docker login ${selectedRegion.registryUrl}/${projectId}`;
  const dockerTag = `docker tag <image> ${selectedRegion.registryUrl}/${projectId}/<image>`;
  const dockerPush = `docker push ${selectedRegion.registryUrl}/${projectId}/<image>`;

  const handleCopyPass = (valueToCopy: string) => {
    navigator.clipboard.writeText(valueToCopy);
    toast.toast({
      title: t('sharedDockerCopy'),
    });
  };
  return (
    <>
      <h4 data-testid="shared-docker-title">{t('titleSharedDocker')}</h4>
      <Alert variant="warning">
        <div className="flex flex-row gap-3 items-center">
          <AlertTriangleIcon className="size-8" />
          <p>{t('alertSharedDocker')}</p>
        </div>
      </Alert>

      <p>{t('sharedDockerParagraphe1')}</p>

      <Select
        value={selectedRegion.id}
        onValueChange={(region) =>
          setSelectedRegion(regions.find((reg) => reg.id === region))
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {tRegions(`region_${region.id}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col">
        <h5>{t('sharedDockerParagraphe2')}</h5>
        <p>{selectedRegion.registryUrl}</p>
      </div>
      <div className="flex flex-col">
        <h5>{t('sharedDockerParagraphe3')}</h5>
        <p>{projectId}</p>
      </div>
      <p>{t('sharedDockerParagraphe4')}</p>
      <div className="relative my-2 rounded bg-gray-100">
        <Button
          data-testid="shared-docker-login-copy-button"
          onClick={() => handleCopyPass(dockerLogin)}
          className="absolute top-0 right-0 m-2 p-2 text-sm
           bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
        >
          <Copy className="size-4" />
          <span className="sr-only">copy</span>
        </Button>
        <pre className="p-4 bg-gray-100 rounded overflow-auto">
          <code>{dockerLogin}</code>
        </pre>
      </div>
      <p>{t('sharedDockerParagraphe5')}</p>
      <p>{t('sharedDockerParagraphe6')}</p>
      <div className="relative my-2 rounded bg-gray-100">
        <Button
          data-testid="shared-docker-tag-copy-button"
          onClick={() => handleCopyPass(dockerTag)}
          className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
        >
          <Copy className="size-4" />
          <span className="sr-only">copy</span>
        </Button>
        <pre className="p-4 bg-gray-100 rounded overflow-auto">
          <code>{dockerTag}</code>
        </pre>
      </div>
      <div className="relative my-2 rounded bg-gray-100">
        <Button
          data-testid="shared-docker-push-copy-button"
          onClick={() => handleCopyPass(dockerPush)}
          className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
        >
          <Copy className="size-4" />
          <span className="sr-only">copy</span>
        </Button>
        <pre className="p-4 bg-gray-100 rounded overflow-auto">
          <code>{dockerPush}</code>
        </pre>
      </div>
      <p>{t('sharedDockerParagraphe7')}</p>
    </>
  );
};
export default SharedDocker;
