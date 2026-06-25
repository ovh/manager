import VcdaFeatureGuard from '@/components/vcda/VcdaFeatureGuard.component';
import TerminateMigrationContent from './_components/TerminateMigrationContent.component';

export default function TerminateMigrationPage() {
  return (
    <VcdaFeatureGuard>
      <TerminateMigrationContent />
    </VcdaFeatureGuard>
  );
}
