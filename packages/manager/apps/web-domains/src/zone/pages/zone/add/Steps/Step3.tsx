import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import type { AddEntrySchemaType } from "../../../../utils/formSchema.utils";
import { getResumeDomain, getTargetDisplayValue } from "../../../../utils/formSchema.utils";
import { AddEntryResume } from "../components/AddEntryResume.component";

export default function Step3() {
  const { watch } = useFormContext<AddEntrySchemaType>();
  const { serviceName } = useParams();
  const formValues = watch() as Partial<AddEntrySchemaType>;
  const recordType = String(formValues?.recordType ?? "");
  const subDomain = formValues?.subDomain as string | undefined;
  const ttlSelect = formValues?.ttlSelect as string | undefined;
  const ttl = formValues?.ttl as number | string | undefined;
  const domainName = serviceName ?? "";
  const resumeDomain = getResumeDomain(subDomain, domainName);
  const targetValue = getTargetDisplayValue(recordType, formValues ?? {});
  const hasSubDomain = String(subDomain ?? "").trim() !== "";

  return (
    <AddEntryResume
      recordType={recordType}
      resumeDomain={resumeDomain}
      hasSubDomain={hasSubDomain}
      ttlSelect={ttlSelect}
      ttl={ttl}
      targetValue={targetValue}
      recordConflicts={true}
      conflictingRecords={[]}
    />
  );
}
