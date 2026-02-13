import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { SubDomainField, TtlField } from "../../components/SubDomainAndTtl.component";
import { SpfFormContent } from "./SpfForm.component";
import { SpfFormHeader } from "./SpfFormHeader";
import { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export default function Spf() {
  const { serviceName } = useParams();
  const { control, watch } = useFormContext<AddEntrySchemaType>();

  return (
    <div className="flex flex-col gap-2 w-full">
      <SpfFormHeader serviceName={serviceName ?? ""} />
      <SubDomainField
        control={control}
        domainSuffix={serviceName ?? ""}
        className="w-full"
        required={false}
      />
      <TtlField control={control} watch={watch} />
      <SpfFormContent />
    </div>
  );
}