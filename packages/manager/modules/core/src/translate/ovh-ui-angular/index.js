import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { set } from 'lodash-es';

const moduleName = 'ovhManagerCoreOuiAngularTranslations';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    (
      $transitions,
      $translate,
      ouiClipboardConfiguration,
      ouiCriteriaAdderConfiguration,
      ouiDatagridConfiguration,
      ouiFieldConfiguration,
      ouiFileConfiguration,
      ouiNavbarConfiguration,
      ouiPaginationConfiguration,
      ouiPasswordConfiguration,
      ouiStepperConfiguration,
    ) => {
      $translate.refresh().then(() => {
        set(ouiClipboardConfiguration, 'translations', {
          copyToClipboardLabel: $translate.instant(
            'common_clipboard_copy_to_clipboard',
          ),
          copiedLabel: $translate.instant('common_clipboard_copied'),
          notSupported: $translate.instant('common_clipboard_not_supported'),
        });

        set(ouiCriteriaAdderConfiguration, 'translations', {
          filter_label: $translate.instant(
            'common_criteria_adder_filter_label',
          ),
          column_label: $translate.instant(
            'common_criteria_adder_column_label',
          ),
          operator_label: $translate.instant(
            'common_criteria_adder_operator_label',
          ),

          operator_boolean_is: $translate.instant(
            'common_criteria_adder_operator_boolean_is',
          ),
          operator_boolean_isNot: $translate.instant(
            'common_criteria_adder_operator_boolean_isNot',
          ),

          operator_string_contains: $translate.instant(
            'common_criteria_adder_operator_string_contains',
          ),
          operator_string_containsNot: $translate.instant(
            'common_criteria_adder_operator_string_containsNot',
          ),
          operator_string_startsWith: $translate.instant(
            'common_criteria_adder_operator_string_startsWith',
          ),
          operator_string_endsWith: $translate.instant(
            'common_criteria_adder_operator_string_endsWith',
          ),
          operator_string_is: $translate.instant(
            'common_criteria_adder_operator_string_is',
          ),
          operator_string_isNot: $translate.instant(
            'common_criteria_adder_operator_string_isNot',
          ),

          operator_number_is: $translate.instant(
            'common_criteria_adder_operator_number_is',
          ),
          operator_number_smaller: $translate.instant(
            'common_criteria_adder_operator_number_smaller',
          ),
          operator_number_bigger: $translate.instant(
            'common_criteria_adder_operator_number_bigger',
          ),

          operator_date_is: $translate.instant(
            'common_criteria_adder_operator_date_is',
          ),
          operator_date_isBefore: $translate.instant(
            'common_criteria_adder_operator_date_isBefore',
          ),
          operator_date_isAfter: $translate.instant(
            'common_criteria_adder_operator_date_isAfter',
          ),

          operator_options_is: $translate.instant(
            'common_criteria_adder_operator_options_is',
          ),
          operator_options_isNot: $translate.instant(
            'common_criteria_adder_operator_options_isNot',
          ),

          true_label: $translate.instant('common_criteria_adder_true_label'),
          false_label: $translate.instant('common_criteria_adder_false_label'),

          value_label: $translate.instant('common_criteria_adder_value_label'),
          submit_label: $translate.instant(
            'common_criteria_adder_submit_label',
          ),
        });

        set(ouiDatagridConfiguration, 'translations', {
          emptyPlaceholder: $translate.instant('common_datagrid_nodata'),
        });

        set(ouiFieldConfiguration, 'translations', {
          errors: {
            required: $translate.instant('common_field_error_required'),
            number: $translate.instant('common_field_error_number'),
            email: $translate.instant('common_field_error_email'),
            min: $translate.instant('common_field_error_min', {
              min: '{{min}}',
            }),
            max: $translate.instant('common_field_error_max', {
              max: '{{max}}',
            }),
            minlength: $translate.instant('common_field_error_minlength', {
              minlength: '{{minlength}}',
            }),
            maxlength: $translate.instant('common_field_error_maxlength', {
              maxlength: '{{maxlength}}',
            }),
            pattern: $translate.instant('common_field_error_pattern'),
          },
        });

        set(ouiFileConfiguration, 'translations', {
          attachmentsHeading: $translate.instant(
            'common_file_attachmentsHeading',
          ),
          dropArea: $translate.instant('common_file_dropArea'),
          dropAreaSelector: $translate.instant('common_file_dropAreaSelector'),
          fileSelector: $translate.instant('common_file_fileSelector'),
          filesSelector: $translate.instant('common_file_filesSelector'),
          maxsizeError: $translate.instant('common_file_maxsizeError'),
          removeFile: $translate.instant('common_file_removeFile'),
        });

        set(ouiNavbarConfiguration, 'translations', {
          notification: {
            errorInNotification: $translate.instant(
              'common_navbar_notification_error_in_notification',
            ),
            errorInNotificationDescription: $translate.instant(
              'common_navbar_notification_error_in_notification_description',
            ),
            markRead: $translate.instant(
              'common_navbar_notification_mark_as_read',
            ),
            markUnread: $translate.instant(
              'common_navbar_notification_mark_as_unread',
            ),
            noNotification: $translate.instant(
              'common_navbar_notification_none',
            ),
            noNotificationDescription: $translate.instant(
              'common_navbar_notification_none_description',
            ),
          },
        });

        set(ouiPaginationConfiguration, 'translations', {
          resultsPerPage: $translate.instant(
            'common_pagination_resultsperpage',
          ),
          ofNResults: $translate
            .instant('common_pagination_ofnresults')
            .replace('TOTAL_ITEMS', '{{totalItems}}'),
          currentPageOfPageCount: $translate
            .instant('common_pagination_currentpageofpagecount')
            .replace('CURRENT_PAGE', '{{currentPage}}')
            .replace('PAGE_COUNT', '{{pageCount}}'),
          previousPage: $translate.instant('common_pagination_previous'),
          nextPage: $translate.instant('common_pagination_next'),
        });

        set(ouiPasswordConfiguration, 'translations', {
          allRulesValidLabel: $translate.instant(
            'common_password_all_rules_met',
          ),
          ariaHidePasswordLabel: $translate.instant(
            'common_password_hide_password',
          ),
          ariaShowPasswordLabel: $translate.instant(
            'common_password_show_password',
          ),
          ariaValidRuleLabel: $translate.instant('common_password_valid_rule'),
          ariaInvalidRuleLabel: $translate.instant(
            'common_password_invalid_rule',
          ),
          riskyPasswordLabel: $translate.instant(
            'common_password_risky_password',
          ),
          badPasswordLabel: $translate.instant('common_password_bad_password'),
          weakPasswordLabel: $translate.instant(
            'common_password_weak_password',
          ),
          goodPasswordLabel: $translate.instant(
            'common_password_good_password',
          ),
          strongPasswordLabel: $translate.instant(
            'common_password_strong_password',
          ),
        });

        set(ouiStepperConfiguration, 'translations', {
          optionalLabel: $translate.instant('common_stepper_optional_label'),
          modifyThisStep: $translate.instant('common_stepper_modify_this_step'),
          skipThisStep: $translate.instant('common_stepper_skip_this_step'),
          nextButtonLabel: $translate.instant(
            'common_stepper_next_button_label',
          ),
          submitButtonLabel: $translate.instant(
            'common_stepper_submit_button_label',
          ),
          cancelButtonLabel: $translate.instant(
            'common_stepper_cancel_button_label',
          ),
        });
      });
    },
  );

export default moduleName;
