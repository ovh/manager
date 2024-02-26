import { Button } from '@/components/ui/button';
import { useNavigate } from '@/hooks/useNavigation';
import { ArrowRight } from 'lucide-react';

interface BillingProps {
  projectId: string;
}

export default function BillingConsumption({projectId} : BillingProps) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center text-primary font-semibold border-primary-100 border bg-primary-100">
          <p className="text-lg py-2">AI Tools billing</p>
        </div>
        <div className="border-primary-100 border h-48 max-h-96">
          <div className="ml-4">
            <p className="font-semibold mt-3">Next payment date</p>
            <p>1 Mar 2024</p>
            <p className="font-semibold text-3xl text-green-600 mt-6">
              €183 ex. VAT
            </p>
          </div>
          <div className="border-slate-200 border-t mx-5 my-3"></div>
          <Button className="ml-2" variant="linkBis" size="sm" asChild>
          <a
            href={useNavigate(
              'public-cloud',
              `#/pci/project/${projectId}/billing`,
              {},
            )}
          >
            View billing details
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
        </div>
      </div>
    </>
  );
}
