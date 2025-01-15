import { OdsLink, OdsText } from "@ovhcloud/ods-components/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TOngoingOperations } from "@/interface";

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
      <OdsText preset="heading-3">
        Track domain transfer {domain?.domain}
      </OdsText>
    </section>
  )
}
