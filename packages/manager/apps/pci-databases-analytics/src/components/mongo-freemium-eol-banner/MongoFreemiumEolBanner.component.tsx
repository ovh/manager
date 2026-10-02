import { Alert, AlertDescription } from '@datatr-ux/uxlib';
import { AlertTriangle } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import A from '@/components/links/A.component';
import Link from '@/components/links/Link.component';
import { useLocale } from '@/hooks/useLocale';
import { getDocumentationUrl, LINKS } from '@/configuration/documentation';

interface MongoFreemiumEolBannerProps {
  migrateTo: string;
  className?: string;
}

const MongoFreemiumEolBanner = ({
  migrateTo,
  className,
}: MongoFreemiumEolBannerProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/components/mongo-freemium-eol-banner',
  );
  const locale = useLocale();
  return (
    <Alert
      variant="warning"
      data-testid="mongo-freemium-eol-banner"
      className={className}
    >
      <div className="flex items-center gap-4">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <AlertDescription>
          <Trans
            t={t}
            i18nKey="endOfLife"
            components={{
              procedureLink: (
                <A
                  data-testid="mongo-freemium-eol-procedure-link"
                  href={getDocumentationUrl(
                    LINKS.MONGODB_BACKUP_RESTORE,
                    locale,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              migrateLink: (
                <Link
                  data-testid="mongo-freemium-eol-migrate-link"
                  to={migrateTo}
                />
              ),
            }}
          />
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default MongoFreemiumEolBanner;
