import {
  USER_TYPE,
  PROOF_TYPE,
  TRACKING_TASK_TAG,
  TRACKING_VARIABLES,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
  KYC_STATUS,
  DOCUMENTS_MATRIX,
} from './user-identity-documents.constant';

const replaceTrackingParams = (hit, params) => {
  if (!params) return hit;
  let formatted = hit;
  params.forEach((param) => {
    const { key, value } = Object.entries(param);
    const replaced = hit.replace(`{{${key}}}`, value);
    if (replaced) formatted = replaced;
  });
  return formatted;
};

export default class AccountUserIdentityDocumentsController {
  /* @ngInject */
  constructor($q, $http, $scope, coreConfig, coreURLBuilder, atInternet) {
    this.$q = $q;
    this.$http = $http;
    this.$scope = $scope;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.atInternet = atInternet;
    this.LEGAL_LINK1 = LEGAL_LINK1;
    this.LEGAL_LINK2 = LEGAL_LINK2;
    this.LEGAL_LINK3 =
      LEGAL_LINK3[coreConfig.getUser().ovhSubsidiary] || LEGAL_LINK3.OTHERS;
    this.KYC_STATUS = KYC_STATUS;
    this.TRACKING_TASK_TAG = TRACKING_TASK_TAG;
    this.USER_TYPE = USER_TYPE;
    this.PROOF_TYPE = PROOF_TYPE;
    this.DOCUMENTS_MATRIX = DOCUMENTS_MATRIX;
    this.isValid = false;
  }

  $onInit() {
    this.currentUser = this.coreConfig.getUser().legalform;
    this.files = [];
    this.loading = false;
    this.showUploadOption = true;
    this.displayError = false;
    this.isOpenModal = false;
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
    this.handleUploadConfirmModal(false);
    this.loading = true;
    this.displayError = false;
    this.trackClick(TRACKING_TASK_TAG.confirmSendMyDocuments);
    if (this.isValid) {
      this.getUploadDocumentsLinks(
        Object.values(this.files).flatMap(({ files }) => files).length,
      )
        .then(() => {
          this.loading = false;
          this.kycStatus.status = KYC_STATUS.OPEN;
          this.handleInformationModal(true);
        })
        .catch(() => {
          this.displayErrorBanner();
        });
    } else {
      this.files = null;
      this.displayErrorBanner();
    }
  }

  handleUploadConfirmModal(open) {
    this.isOpenModal = open;
    this.trackClick(TRACKING_TASK_TAG.clickSendMyDocuments);
    this.trackPage(TRACKING_TASK_TAG.displayPopUpSendMyDocuments);
  }

  handleInformationModal(open) {
    this.isOpenInformationModal = open;
  }

  addDocuments(proofType, documentType, files) {
    this.files[proofType] = {
      document: documentType,
      files,
    };
    this.checkValidity();
  }

  checkValidity() {
    this.isValid =
      this.user_type === this.USER_TYPE.individual
        ? this.files[this.PROOF_TYPE.aadhaar_card] ||
          (this.files[this.PROOF_TYPE.identity] &&
            this.files[this.PROOF_TYPE.address])
        : Object.keys(this.proofs).reduce(
            (acc, proofType) =>
              (acc &&
                (this.files[proofType] ||
                  proofType === this.PROOF_TYPE.authority_declaration)) ||
              (this.user_type === this.USER_TYPE.default &&
                proofType === this.PROOF_TYPE.vat),
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
    return this.$http
      .post(`/me/procedure/identity`, {
        numberOfDocuments: count,
      })
      .then(({ data: response }) => {
        const { uploadLinks } = response;
        const flattenFiles = Object.values(this.files).flatMap(
          ({ files }) => files,
        );
        return this.$q.all(
          uploadLinks.map((uploadLink, index) =>
            this.uploadDocumentsToS3usingLinks(uploadLink, flattenFiles[index]),
          ),
        );
      })
      .then(() => {
        this.$http.post(`/me/procedure/identity/finalize`);
        this.showUploadOption = false;
      })
      .catch(() => {
        this.displayErrorBanner();
      });
  }

  uploadDocumentsToS3usingLinks(uploadLink, uploadedfile) {
    return this.$http
      .put(uploadLink.link, uploadedfile, {
        headers: { ...uploadLink.headers },
      })
      .catch(() => {
        this.displayErrorBanner();
      });
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
    });
  }

  trackPage(hit, params) {
    const formatted = replaceTrackingParams(hit, params);
    this.atInternet.trackPage({
      name: formatted,
    });
  }
}
