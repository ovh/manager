import { AlertCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from '@/components/links/Link.component';
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

interface CliProps {
  regions: ai.capabilities.Region[];
}

const Cli = ({ regions }: CliProps) => {
  const { t } = useTranslation('pci-ai-dashboard/home');
  const { t: tRegions } = useTranslation('regions');
  const [selectedRegion, setSelectedRegion] = useState<ai.capabilities.Region>(
    regions[0],
  );
  const toast = useToast();

  const curlUlr = `curl -s ${selectedRegion.cliInstallUrl}/install.sh | bash`;
  const userLink = './users';
  const tokenLink = './tokens';
  const handleCopyPass = (valueToCopy: string) => {
    navigator.clipboard.writeText(valueToCopy);
    toast.toast({
      title: t('cliCopy'),
    });
  };
  return (
    <div className="flex flex-col gap-2">
      <p>{t('cliParagraphe1')}</p>
      <h5>{t('cliInstallationTitle')}</h5>
      <p>{t('cliParagraphe2')}</p>
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
      <div className="relative my-2 rounded bg-black">
        <Button
          data-testid="cli-curl-copy-button"
          onClick={() => handleCopyPass(curlUlr)}
          className="absolute top-0 right-0 m-2 p-2 text-sm
           bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
        >
          <Copy className="size-4" />
          <span className="sr-only">copy</span>
        </Button>
        <pre className="p-4 bg-black rounded text-white overflow-auto">
          <code>{curlUlr}</code>
        </pre>
      </div>
      <Alert variant="info">
        <div className="flex flex-row gap-3 items-center">
          <AlertCircle className="size-6" />
          <p>{t('alertCli')}</p>
        </div>
      </Alert>
      <h5>{t('cliAuthentificationTitle')}</h5>
      <span>
        {t('cliParagraphe3')}
        <Link to={userLink}>{t('cliUserLink')}</Link>
        {t('cliParagraphe3Bis')}
        <Link to={tokenLink}>{t('cliTokenLink')}</Link>
        <p>{t('cliParagraphe3Ter')}</p>
      </span>
      <span></span>
      <p>{t('cliParagraphe4')}</p>
      <ul className="list-disc pl-8">
        <li>
          <div className="flex flex row gap-1">
            <span>{t('cliList1')}</span>
            <p className="text-red-600">ovhai login</p>
          </div>
        </li>
        <li>{t('cliList2')}</li>
        <li>{t('cliList3')}</li>
        <li>{t('cliList4')}</li>
      </ul>
      <h5>{t('cliCommandsTitle')}</h5>
      <div className="flex flex-row gap-1">
        <p>{t('cliCommandParagraphe1')}</p>
        <p className="text-red-600">ovhai --help</p>
        <p>{t('cliCommandParagraphe1Bis')}</p>
      </div>
    </div>
  );
};

export default Cli;
