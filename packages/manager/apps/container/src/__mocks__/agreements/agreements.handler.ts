import { Handler } from "@ovh-ux/manager-core-test-utils";
import { agreementsToValidate, agreementsValidated } from "./agreements.data";

export const getAgreementsMocks = (params: {
  withAgreementsToValidate?: boolean;
  withAgreedAgreements?: boolean;
} = {}): Handler[] => {
  const {
    withAgreementsToValidate = false,
    withAgreedAgreements = false,
  } = params;

  if (!(withAgreementsToValidate || withAgreedAgreements)) {
    return [
      {
        url: 'me/agreements',
        response: [],
        api: 'v6',
        delay: 0,
      },
    ];
  }

  return [
    {
      url: 'me/agreements',
      response: [
        ...(withAgreementsToValidate ? agreementsToValidate : []),
        ...(withAgreedAgreements ? agreementsValidated : []),
      ],
      api: 'v6',
      delay: 0,
    },
  ];
};
