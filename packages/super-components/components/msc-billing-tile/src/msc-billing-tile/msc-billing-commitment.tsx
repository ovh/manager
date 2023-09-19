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
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import {
  OdsIconName,
  OdsIconSize,
  OdsChipSize,
  OdsHTMLAnchorElementTarget,
  OdsChipVariant,
} from '@ovhcloud/ods-core';
import { translate, formatDate, Locale } from '@ovhcloud/msc-utils';
import { ServiceDetails, Translations } from './msc-billing.types';
import { getEngagementCommitUrl } from './urls';

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
          level={OdsThemeTypographyLevel.heading}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.text}
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
                level={OdsThemeTypographyLevel.body}
                size={OdsThemeTypographySize._200}
                color={OdsThemeColorIntent.default}
              >
                {description}
              </osds-text>
            )}
            {this.commitmentStatus === CommitmentStatus.ENDS && (
              <osds-chip
                color={OdsThemeColorIntent.error}
                size={OdsChipSize.sm}
                variant={OdsChipVariant.flat}
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
                level={OdsThemeTypographyLevel.body}
                size={OdsThemeTypographySize._200}
                color={OdsThemeColorIntent.default}
              >
                <osds-chip
                  color={OdsThemeColorIntent.error}
                  size={OdsChipSize.sm}
                  variant={OdsChipVariant.flat}
                >
                  {
                    this.localeStrings
                      .manager_billing_subscription_engagement_status_none
                  }
                </osds-chip>
                <osds-link
                  class="resub-link"
                  data-tracking={this.commitmentDataTracking}
                  color={OdsThemeColorIntent.primary}
                  href={getEngagementCommitUrl(this.servicePath)}
                  target={OdsHTMLAnchorElementTarget._blank}
                >
                  {
                    this.localeStrings
                      .manager_billing_subscription_engagement_commit
                  }
                  <osds-icon
                    class="link-icon"
                    size={OdsIconSize.xxs}
                    name={OdsIconName.ARROW_RIGHT}
                    color={OdsThemeColorIntent.primary}
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
