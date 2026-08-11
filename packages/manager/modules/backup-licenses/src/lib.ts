import { BackupLicensesContext } from '@/BackupLicenses.context';

import { BACKUP_LICENSES_NAMESPACES } from './BackupLicenses.translations';
import BackupLicensesRoutes from './routes/routes';

console.log('[backup-licenses] module loaded');

export { BackupLicensesRoutes, BackupLicensesContext, BACKUP_LICENSES_NAMESPACES };

export default {
  BackupLicensesRoutes,
  BackupLicensesContext,
  BACKUP_LICENSES_NAMESPACES,
};
