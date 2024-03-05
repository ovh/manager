import { ovhUrl } from '@/components/ovhNavigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BillingProps {
  projectId: string;
  jobUsage: number;
  appUsage: number;
  notebookUsage: number;
  nextPaiement: string;
}

export default function BillingConsumption({
  projectId,
  jobUsage,
  appUsage,
  notebookUsage,
  nextPaiement,
}: BillingProps) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center text-primary font-semibold border-primary-100 border bg-primary-100">
          <p className="text-lg py-2">AI Tools billing</p>
        </div>
        <div className="border-primary-100 border h-48 max-h-96">
          <div className="ml-4">
            <div className="flex flex-row">
              <div className="w-2/3">
                <p className="font-semibold mt-3">Next payment date</p>
                <p>{nextPaiement}</p>
                <p className="font-semibold text-3xl text-green-600 mt-6">
                  €{notebookUsage + appUsage + jobUsage} ex. VAT
                </p>
              </div>
              <div className="w-1/3 text-right mr-4">
                <p className="font-semibold mt-3">Notebooks : €{notebookUsage}</p>
                <p className="font-semibold">Jobs : €{jobUsage}</p>
                <p className="font-semibold">Apps : €{appUsage}</p>
              </div>
            </div>
          </div>
          <div className="border-slate-200 border-t mx-5 my-3"></div>
          <Button className="ml-2" variant="linkBis" size="sm" asChild>
            <a
              href={ovhUrl(
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
