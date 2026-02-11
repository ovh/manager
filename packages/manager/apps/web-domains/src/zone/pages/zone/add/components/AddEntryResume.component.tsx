import { Datagrid, DatagridColumn } from "@ovh-ux/muk";
import { Message, MESSAGE_COLOR, Text, TEXT_PRESET } from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const RECORD_TYPES_AS_TXT = ["SPF", "DKIM", "DMARC"] as const;

export interface ConflictingRecord extends Record<string, unknown> {
  domainToDisplay: string;
  fieldType: string;
  targetToDisplay: string;
}

export interface AddEntryResumeProps {
  recordType: string;
  resumeDomain: string;
  hasSubDomain?: boolean;
  ttlSelect?: string;
  ttl?: number | string;
  targetValue: string;
  recordConflicts: boolean;
  conflictingRecords?: ConflictingRecord[];
}

export function AddEntryResume({
  recordType,
  resumeDomain,
  hasSubDomain = false,
  ttlSelect,
  ttl,
  targetValue,
  recordConflicts,
  conflictingRecords = [],
}: AddEntryResumeProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const conflictingRecordsColumns: DatagridColumn<ConflictingRecord>[] = useMemo(
    () => [
      {
        id: "domainToDisplay",
        accessorKey: "domainToDisplay",
        header: t("zone_page_add_entry_modal_step_3_table_field"),
        cell: ({ row }) => (
          <span className="break-all">{row.original.domainToDisplay}</span>
        ),
      },
      {
        id: "fieldType",
        accessorKey: "fieldType",
        header: t("zone_page_add_entry_modal_step_3_table_type"),
      },
      {
        id: "targetToDisplay",
        accessorKey: "targetToDisplay",
        header: t("zone_page_add_entry_modal_step_3_table_target"),
        cell: ({ row }) => (
          <span className="break-all">{row.original.targetToDisplay}</span>
        ),
      },
    ],
    [t],
  );
  const displayType = (RECORD_TYPES_AS_TXT as readonly string[]).includes(recordType)
    ? "TXT"
    : recordType;
  const showTtl = ttlSelect === "custom" && ttl != null && ttl !== "";

  return (
    <div className="w-full space-y-4">
      <Text preset={TEXT_PRESET.paragraph}>
        {t("zone_page_add_entry_modal_step_3_info")}
      </Text>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm md:gap-x-6">
        <Text preset={TEXT_PRESET.caption}>
          {t("zone_page_add_entry_modal_step_1_type")}
        </Text>
        <Text className="break-words">{displayType}</Text>

        <Text preset={TEXT_PRESET.caption}>
          {t("zone_page_add_entry_modal_step_1_domain")}
        </Text>
        <Text className="break-all">{resumeDomain}</Text>

        {showTtl && (
          <>
            <Text preset={TEXT_PRESET.caption}>
              {t("zone_page_add_entry_modal_step_1_ttl")}
            </Text>
            <Text>{String(ttl)}</Text>
          </>
        )}

        <Text preset={TEXT_PRESET.caption}>
          {t("zone_page_add_entry_modal_step_1_target")}
        </Text>
        <Text className="break-all">{targetValue}</Text>
      </dl>

      {!recordConflicts && (
        <>
        <Message color={MESSAGE_COLOR.critical} className="w-full" dismissible={false}>
          <span>{t("zone_page_add_entry_modal_step_3_check_warning_info")}</span>
          <span>
            {" "}
            {recordType === "CNAME" && hasSubDomain
              ? t("zone_page_add_entry_modal_step_3_check_warning2")
              : t("zone_page_add_entry_modal_step_3_check_warning3")}
          </span>
        </Message>
         {recordType === "CNAME" && conflictingRecords.length > 0 && (
          <div className="mt-3">
            <Datagrid<ConflictingRecord>
              columns={conflictingRecordsColumns}
              data={conflictingRecords}
              containerHeight={Math.min(conflictingRecords.length * 50 + 56, 500)}
            />
          </div>
        )}
        </>
      )}

      {recordConflicts && (
        <Message color={MESSAGE_COLOR.information} className="w-1/2" dismissible={false}>
          {t("zone_page_add_entry_modal_step_3_alert")}
        </Message>
      )}
    </div>
  );
}
