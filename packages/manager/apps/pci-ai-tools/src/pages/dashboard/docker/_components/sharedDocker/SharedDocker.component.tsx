import { AlertTriangleIcon, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import {
  Alert,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import OvhLink from '@/components/links/OvhLink.component';
import CodeBlock from '@/components/code-block/CodeBlock.component';

interface SharedDockerProps {
  regions: ai.capabilities.Region[];
}

const SharedDocker = ({ regions }: SharedDockerProps) => {
  const { t } = useTranslation('ai-tools/dashboard/docker');
  const { t: tRegions } = useTranslation('regions');
  const { projectId } = useParams();
  const [selectedRegion, setSelectedRegion] = useState<ai.capabilities.Region>(
    regions[0],
  );
  const userPath = `#/pci/project/${projectId}/users`;
  const dockerLogin = `docker login ${selectedRegion.registryUrl}/${projectId}`;
  const dockerTag = `docker tag <image> ${selectedRegion.registryUrl}/${projectId}/<image>`;
  const dockerPush = `docker push ${selectedRegion.registryUrl}/${projectId}/<image>`;

  return (
    <>
      <h4 data-testid="shared-docker-title">{t('titleSharedDocker')}</h4>
      <Alert variant="warning">
        <div className="flex flex-row gap-3 items-center">
          <AlertTriangleIcon className="size-6 shrink-0" />
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
        <SelectTrigger
          className="text-base"
          data-testid="select-region-trigger"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem className="text-base" key={region.id} value={region.id}>
              {tRegions(`region_${region.id}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <h5>{t('sharedDockerParagraphe2')}</h5>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="size-4" />
            </PopoverTrigger>
            <PopoverContent>
              <p>{t('sharedDockerParagraphe2Info')}</p>
            </PopoverContent>
          </Popover>
        </div>
        <p>{selectedRegion.registryUrl}</p>
      </div>
      <div className="flex flex-col">
        <h5>{t('sharedDockerParagraphe3')}</h5>
        <p>{projectId}</p>
      </div>
      <p>{t('sharedDockerParagraphe4')}</p>

      <CodeBlock code={dockerLogin} />
      <span>
        {t('sharedDockerParagraphe5')}
        <OvhLink
          className="mx-1"
          application="public-cloud"
          path={userPath}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('sharedDockerParagraphe5bis')}
        </OvhLink>
        {t('sharedDockerParagraphe5ter')}
      </span>
      <p>{t('sharedDockerParagraphe6')}</p>
      <CodeBlock code={dockerTag} />
      <CodeBlock code={dockerPush} />
      <p>{t('sharedDockerParagraphe7')}</p>
    </>
  );
};
export default SharedDocker;
