import { OdsLink, OdsText } from "@ovhcloud/ods-components/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TOngoingOperations } from "@/interface";
import { ODS_TEXT_PRESET } from "@ovhcloud/ods-components";

interface SubHeaderProps {
  domain: TOngoingOperations;
}

export default function SubHeader({domain} : SubHeaderProps) {

  const navigate = useNavigate();
  return (
    <section className="mb-4 flex flex-col gap-y-2">
      <OdsLink
        href="“#"
        icon="arrow-left"
        iconAlignment="left"
        label="Back"
        onClick={() => navigate('..')}
      />
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        Track domain transfer {domain?.domain}
      </OdsText>
    </section>
  )
}
