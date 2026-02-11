import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { SubDomainField } from "../../components/SubDomainAndTtl.component";
import { DkimFormContent } from "./DkimForm.component";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export default function Dkim() {
  const { serviceName } = useParams();
  const { control } = useFormContext<AddEntrySchemaType>();

  return (
    <div className="flex flex-col gap-2 w-full">
      <SubDomainField
        control={control}
        domainSuffix={serviceName ?? ""}
        className="w-full"
        required={false}
      />
      <DkimFormContent />
    </div>
  );
}
