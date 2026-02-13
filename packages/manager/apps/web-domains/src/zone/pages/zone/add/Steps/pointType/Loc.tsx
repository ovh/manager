import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { SubDomainField, TtlField } from "../../components/SubDomainAndTtl.component";
import { LocFormContent } from "./components/LocForm.component";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export default function Loc() {
  const { serviceName } = useParams();
  const { control, watch } = useFormContext<AddEntrySchemaType>();

  return (
    <div className="flex flex-col gap-2 w-full">
      <SubDomainField
        control={control}
        domainSuffix={serviceName ?? ""}
        className="w-full"
        required={false}
      />
      <TtlField control={control} watch={watch} />
      <LocFormContent />
    </div>
  );
}
