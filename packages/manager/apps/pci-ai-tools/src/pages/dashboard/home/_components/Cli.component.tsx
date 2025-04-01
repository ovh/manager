import {
  Alert,
  Code,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  bash,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import Link from '@/components/links/Link.component';

interface CliProps {
  regions: ai.capabilities.Region[];
}

const Cli = ({ regions }: CliProps) => {
  const { t } = useTranslation('ai-tools/dashboard/home');
  const { t: tRegions } = useTranslation('regions');
  const [selectedRegion, setSelectedRegion] = useState<ai.capabilities.Region>(
    regions[0],
  );
  const toast = useToast();
  const curlUlr = `curl -s ${selectedRegion.cliInstallUrl}/install.sh | bash`;
  const userLink = './users';
  const tokenLink = './tokens';
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
        <SelectTrigger className="text-base">
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
      <Code
        label={t('codeCliTitle')}
        code={curlUlr}
        lang={bash}
        theme={githubDark}
        onCopied={() =>
          toast.toast({
            title: t('codeCliToastMessage'),
          })
        }
      />
      <Alert variant="primary" className="border-0">
        <div className="flex flex-row gap-3 items-center">
          <AlertCircle className="size-5" />
          <p>{t('alertCli')}</p>
        </div>
      </Alert>
      <h5>{t('cliAuthentificationTitle')}</h5>
      <span>
        {t('cliParagraphe3')}
        <Link className="mx-1" to={userLink}>
          {t('cliUserLink')}
        </Link>
        {t('cliParagraphe3Bis')}
        <Link className="mx-1" to={tokenLink}>
          {t('cliTokenLink')}
        </Link>
        {t('cliParagraphe3Ter')}
      </span>
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
      <div className="inline">
        <span>{t('cliCommandParagraphe1')}</span>
        <span className="text-red-600 inline"> ovhai --help </span>
        <span>{t('cliCommandParagraphe1Bis')}</span>
      </div>
    </div>
  );
};

export default Cli;
