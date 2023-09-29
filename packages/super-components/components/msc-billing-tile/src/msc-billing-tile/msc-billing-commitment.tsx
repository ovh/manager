import {
  Component,
  Prop,
  h,
  Element,
  Host,
  State,
  Fragment,
} from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_CHIP_SIZE, ODS_CHIP_VARIANT } from '@ovhcloud/ods-components/chip';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { translate, formatDate, Locale } from '@ovhcloud/msc-utils';
import { ServiceDetails, Translations } from './msc-billing.types';
import { BillingTileURLs } from './urls';

enum CommitmentStatus {
  NONE = 'none',
  ENDED = 'ended',
  RENEWS = 'renews',
  REQUESTED = 'requested',
  ENDS = 'ends',
}

export interface IMscBillingCommitment {
  serviceDetails?: ServiceDetails;
  servicePath: string;
  nextBillingDate?: string;
  locale: Locale;
  localeStrings: Translations;
  urls?: BillingTileURLs;
  commitmentDataTracking?: string;
}

@Component({
  tag: 'msc-billing-commitment',
  styleUrl: 'msc-billing-commitment.scss',
  shadow: true,
})
export class MscBillingCommitment implements IMscBillingCommitment {
  @Element() host!: HTMLStencilElement;

  @Prop() servicePath: string;

  @Prop() nextBillingDate: string;

  @Prop() locale: Locale;

  @Prop() localeStrings: Translations;

  @Prop() serviceDetails?: ServiceDetails;

  @Prop() commitmentDataTracking?: string;

  @Prop() urls?: BillingTileURLs;

  @State() commitmentStatus: CommitmentStatus;

  private getCommitmentStatus() {
    if (
      new Date(this.serviceDetails?.billing.engagement?.endDate || '') <
      new Date()
    ) {
      return CommitmentStatus.ENDED;
    }
    if (
      new Date(this.serviceDetails?.billing.engagement?.endDate || '') >
      new Date()
    ) {
      return CommitmentStatus.RENEWS;
    }
    if (this.serviceDetails?.billing.engagementRequest) {
      return CommitmentStatus.REQUESTED;
    }
    if (this.serviceDetails?.billing.expirationDate) {
      return CommitmentStatus.ENDS;
    }
    return CommitmentStatus.NONE;
  }

  async componentWillLoad() {
    this.commitmentStatus = this.getCommitmentStatus();
  }

  private getDescription(): string {
    switch (this.commitmentStatus) {
      case CommitmentStatus.ENDED:
        return translate(
          this.localeStrings,
          'manager_billing_subscription_engagement_status_engaged_expired',
          {
            endDate: this.nextBillingDate,
          },
        );

      case CommitmentStatus.RENEWS:
        return translate(
          this.localeStrings,
          'manager_billing_subscription_engagement_status_engaged_renew',
          {
            endDate: this.nextBillingDate,
          },
        );
      case CommitmentStatus.REQUESTED:
        return translate(
          this.localeStrings,
          'manager_billing_subscription_engagement_status_commitement_pending',
          {
            nextBillingDate: formatDate(
              this.serviceDetails?.billing.engagementRequest
                ?.requestDate as string,
              this.locale,
            ),
          },
        );
      default:
        return '';
    }
  }

  render() {
    const description = this.getDescription();
    return (
      <Host>
        <osds-divider separator />
        <osds-text
          class="tile-title"
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._200}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {this.localeStrings.manager_billing_subscription_engagement}
        </osds-text>
        {!this.serviceDetails ? (
          <osds-skeleton />
        ) : (
          <>
            {description && (
              <osds-text
                class="tile-description"
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                {description}
              </osds-text>
            )}
            {this.commitmentStatus === CommitmentStatus.ENDS && (
              <osds-chip
                color={ODS_THEME_COLOR_INTENT.error}
                size={ODS_CHIP_SIZE.sm}
                variant={ODS_CHIP_VARIANT.flat}
                inline
              >
                {translate(
                  this.localeStrings,
                  'manager_billing_subscription_engagement_status_engaged',
                  {
                    endDate: this.nextBillingDate,
                  },
                )}
              </osds-chip>
            )}
            {this.commitmentStatus === CommitmentStatus.NONE && (
              <osds-text
                class="tile-description"
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.default}
              >
                <osds-chip
                  color={ODS_THEME_COLOR_INTENT.error}
                  size={ODS_CHIP_SIZE.sm}
                  variant={ODS_CHIP_VARIANT.flat}
                  inline
                >
                  {
                    this.localeStrings
                      .manager_billing_subscription_engagement_status_none
                  }
                </osds-chip>
                <osds-link
                  class="resub-link"
                  data-tracking={this.commitmentDataTracking}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={this.urls?.engagementCommitUrl}
                  target={OdsHTMLAnchorElementTarget._blank}
                >
                  {
                    this.localeStrings
                      .manager_billing_subscription_engagement_commit
                  }
                  <osds-icon
                    class="link-icon"
                    size={ODS_ICON_SIZE.xxs}
                    name={ODS_ICON_NAME.ARROW_RIGHT}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </osds-link>
              </osds-text>
            )}
          </>
        )}
      </Host>
    );
  }
}
