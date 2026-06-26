import VcdaFeatureGuard from '@/components/vcda/VcdaFeatureGuard.component';
import MigrationContent from './_components/MigrationContent.component';

export default function MigrationPage() {
  return (
    <VcdaFeatureGuard>
      <MigrationContent />
    </VcdaFeatureGuard>
  );
}
