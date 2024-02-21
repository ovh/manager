import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BillingConsumption() {
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
          <Button
            className="font-semibold hover:bg-primary-100 hover:text-primary ml-4"
            variant="link"
            size="sm"
            asChild
          >
            <Link to="./billing">
              View attached data
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
