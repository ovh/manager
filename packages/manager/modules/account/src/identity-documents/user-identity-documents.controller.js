import {
  USER_TYPE,
  PROOF_TYPE,
  DOCUMENT_TYPE,
  TRACKING_TASK_TAG,
  TRACKING_VARIABLES,
  TRACKING_CONTEXT,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
  KYC_STATUS,
  DELAY_BETWEEN_RETRY,
  MAX_RETRIES,
  DOCUMENTS_MATRIX,
} from './user-identity-documents.constant';

const replaceTrackingParams = (hit, params) => {
  if (!params) return hit;
  let formatted = hit;
  Object.entries(params).forEach(([key, value]) => {
    formatted = formatted.replace(`{{${key}}}`, value);
  });
  return formatted;
};

export default class AccountUserIdentityDocumentsController {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $scope,
    coreConfig,
    coreURLBuilder,
    atInternet,
    ExitGuardService,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$scope = $scope;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.atInternet = atInternet;
    this.ExitGuardService = ExitGuardService;
    this.LEGAL_LINK1 = LEGAL_LINK1;
    this.LEGAL_LINK2 = LEGAL_LINK2;
    this.LEGAL_LINK3 =
      LEGAL_LINK3[coreConfig.getUser().ovhSubsidiary] || LEGAL_LINK3.OTHERS;
    this.KYC_STATUS = KYC_STATUS;
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;
    this.USER_TYPE = USER_TYPE;
    this.PROOF_TYPE = PROOF_TYPE;
    this.DOCUMENT_TYPE = DOCUMENT_TYPE;
    this.DOCUMENTS_MATRIX = DOCUMENTS_MATRIX;
    this.isValid = false;
    this.hasAadhaarCard = false;
  }

  $onInit() {
    this.currentUser = this.coreConfig.getUser().legalform;
    this.files = [];
    this.links = null;
    this.loading = false;
    this.showUploadOption = true;
    this.displayError = false;
    this.isOpenInformationModal = false;
    this.dashboardRedirectURL = this.coreURLBuilder.buildURL('hub', '');
    this.user_type = USER_TYPE[this.currentUser]
      ? USER_TYPE[this.currentUser]
      : USER_TYPE.default;

    this.proofs = this.DOCUMENTS_MATRIX[this.user_type]?.proofs;
    this.selectProofType(null);
    this.trackPage(TRACKING_TASK_TAG.dashboard);
  }

  selectProofType(proof) {
    if (proof) {
      this.currentProofType = proof;
      this.currentProof = this.proofs[proof];
      this.currentDocumentType = this.getDocumentType(proof);
      this.currentDocumentFiles = this.getDocumentFiles(proof);
      this.isListView = false;
      this.trackClick(TRACKING_TASK_TAG.openDetailView, {
        name_click:
          this.currentDocumentFiles.length === 0
            ? TRACKING_VARIABLES.TO_ADD
            : TRACKING_VARIABLES.MODIFY,
        'identity-files': proof,
      });
    } else {
      this.currentProofType = null;
      this.currentProof = null;
      this.currentDocumentType = null;
      this.currentDocumentFiles = [];
      this.isListView = true;
    }
  }

  uploadIdentityDocuments() {
    this.trackClick(TRACKING_TASK_TAG.clickSendMyDocuments);
    this.loading = true;
    this.displayError = false;
    if (this.isValid) {
      this.ExitGuardService.activate();
      const count = Object.values(this.files).flatMap(({ files }) => files)
        .length;
      const promise = this.links
        ? // We cannot re call getUploadDocumentsLinks if it answered successfully, so if we already
          // retrieve the links we directly try to "finalize" the procedure
          this.tryToFinalizeProcedure(this.links)
        : // In order to start the KYC procedure we need to request the upload links for the number of documents
          // the user wants to upload
          this.getUploadLinks(count)
            // Once we retrieved the upload links, we'll try to upload them and then "finalize" the procedure creation
            .then(({ data: { uploadLinks } }) => {
              this.links = uploadLinks;
              return this.tryToFinalizeProcedure(uploadLinks);
            });
      promise
        .then(() => {
          this.showUploadOption = false;
          this.loading = false;
          this.kycStatus.status = KYC_STATUS.OPEN;
          this.handleInformationModal(true);
          this.ExitGuardService.deactivate();
        })
        // In case of any error, we display a banner to the user to inform them
        .catch(() => {
          this.displayErrorBanner();
        });
    } else {
      this.files = null;
      this.displayErrorBanner();
    }
  }

  handleInformationModal(open) {
    this.isOpenInformationModal = open;
  }

  closeInformationModal() {
    this.handleInformationModal(false);
  }

  addDocuments(proofType, documentType, files, isReset) {
    if (isReset) {
      delete this.files[proofType];
    } else {
      this.files[proofType] = {
        document: documentType,
        files,
      };
    }
    this.checkValidity();
  }

  checkInvidualValidity() {
    this.hasAadhaarCard =
      !!this.files[this.PROOF_TYPE.aadhaar_card] ||
      !!Object.entries(this.files).find(
        ([, value]) => value.document === this.DOCUMENT_TYPE.aadhaar_card,
      );

    const isComplete =
      !!this.files[this.PROOF_TYPE.identity] &&
      !!this.files[this.PROOF_TYPE.address];

    return this.hasAadhaarCard || isComplete;
  }

  checkValidity() {
    this.isValid =
      this.user_type === this.USER_TYPE.individual
        ? this.checkInvidualValidity()
        : Object.keys(this.proofs).reduce(
            (acc, proofType) =>
              acc &&
              (!!this.files[proofType] ||
                proofType === this.PROOF_TYPE.authority_declaration ||
                (this.user_type === this.USER_TYPE.default &&
                  proofType === this.PROOF_TYPE.vat)),
            true,
          );
  }

  getDocumentType(proofType) {
    return (
      this.files[proofType]?.document ||
      Object.keys(this.proofs[proofType].documents)[0]
    );
  }

  getDocumentFiles(proofType) {
    return this.files[proofType]?.files || [];
  }

  getUploadDocumentsLinks(count) {
    return this.$http.post(`/me/procedure/identity`, {
      numberOfDocuments: count,
    });
  }

  getUploadLinks(count) {
    let remainingRetries = MAX_RETRIES;

    const attempt = () => {
      return this.getUploadDocumentsLinks(count).catch(async (error) => {
        if (remainingRetries > 0) {
          remainingRetries -= 1;
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_RETRY),
          );
          return attempt();
        }
        return this.$q.reject(error);
      });
    };

    return attempt();
  }

  tryToFinalizeProcedure(uploadLinks) {
    let remainingRetries = MAX_RETRIES;
    // First we try to upload the file using the retrieved link

    return (
      this.finalizeProcedure(uploadLinks)
        // In case of any error, we'll retry until we hit some maximum retry amount
        .catch(async () => {
          let success = false;
          // As we need to retry until the task in is success, or we exceed the max retry count, the following await
          // in a loop is valid, so we'll ignore eslint on the following loop
          while (!success && remainingRetries) {
            /* eslint-disable no-await-in-loop */
            await new Promise((resolve) => {
              setTimeout(resolve, DELAY_BETWEEN_RETRY);
            });
            try {
              /* eslint-disable no-await-in-loop */
              await this.finalizeProcedure(uploadLinks);
              success = true;
            } catch (error) {
              remainingRetries -= 1;
            }
          }
          return success ? this.$q.resolve() : this.$q.reject();
        })
    );
  }

  finalizeProcedure(uploadLinks) {
    const flattenFiles = Object.values(this.files).flatMap(
      ({ files }) => files,
    );

    return (
      this.$q
        .all(
          uploadLinks.map((uploadLink, index) =>
            this.$http.put(uploadLink.link, flattenFiles[index], {
              headers: { ...uploadLink.headers },
            }),
          ),
        )
        // If all goes well, we'll ask for the "finalization" of the procedure creation
        .then(() => this.$http.post(`/me/procedure/identity/finalize`))
    );
  }

  displayErrorBanner() {
    this.loading = false;
    this.displayError = true;
  }

  trackClick(hit, params, type = 'action') {
    const formatted = replaceTrackingParams(hit, params);
    this.atInternet.trackClick({
      name: formatted,
      type,
      ...TRACKING_CONTEXT,
    });
  }

  trackPage(hit, params) {
    const formatted = replaceTrackingParams(hit, params);
    this.atInternet.trackPage({
      name: formatted,
      ...TRACKING_CONTEXT,
    });
  }
}
