/**
 * @type directive
 * @name ovhDirectives:loginForm
 * @version 0.0.1
 * @description
 * Provide the login form
 * @param {string} action the uri to the login page
 * @param {string} method must be POST
 * @param {html element} input#nichandle[type='text'] the login input
 * @param {html element} input#password[type='password'] the password input
 * @param {html element} input#login[type='submit']
 * @example
 * <code:html>
 *   <form name="loginform" class="form-inline" data-login-form action="api/auth/login" method="POST">
 *
 *         <label for="nichandle" class="form-label" data-ng-bind="i18n.login_name"></label>
 *         <!-- input with id MUST exist -->
 *         <input id="nichandle" type="text" name="login" data-ng-disabled="loginInProgress" autocomplete="on">
 *         <span class="add-on">-ovh</span>
 *     </div>
 *
 *     <div class="span6">
 *          <label for="password" class="form-label" data-ng-bind="i18n.login_password"></span>
 *          <input id="password" name="password" type="password" data-ng-disabled="loginInProgress" autocomplete="on" >
 *     </div>
 *
 *     <div id="error" class="alert alert-block alert-error" style="display: none;">
 *          <span data-ng-bind="i18n.login_login_or_password_invalid"></span>
 *     </div>
 *
 *      <input type="submit" id="login" class="btn btn-primary" value="{{i18n.login_login}}">
 *      <a href="{{i18n.login_forgot_your_password_url}}" data-ng-bind="i18n.login_forgot_your_password" class="pull-right btn btn-link"></a>
 *   </form>
 * </code>
 */
angular.module('ua.loginForm').directive('loginForm', function () {
    "use strict";
    return {
        restrict   : 'A',
        replace    : false,
        controller : 'LoginFormCtrl',
        link       : function ($scope, $elm) {
            var form = $elm,
                loginInput = form.find('#nichandle'),
                passwordInput = form.find('#password'),
                loginButton = form.find('#login'),
                timeoutId;

            function checkOnTimeout () {
                timeoutId = window.clearTimeout(timeoutId);
                if (loginInput.val() !== '' && passwordInput.val() !== '') {
                    loginButton.removeAttr('disabled');
                } else {
                    loginButton.attr('disabled', 'disabled');
                }
                timeoutId = window.setTimeout(checkOnTimeout, 250);
            }


            $scope.errors = [];
            if ($.cookie('X-OVH-V6-LOGGED') === "false") {
                $('#error').css('display', 'block');
            }
            (function () {

                loginButton.click(function () {
                    timeoutId = window.clearTimeout(timeoutId);
                });

                loginInput.bind('keypress change', function () {
                    loginInput.attr('required', 'required');
                    $('#error').css('display', 'none');
                    $.removeCookie('X-OVH-V6-LOGGED', {path:'/'});
                    if (timeoutId === undefined) {
                        checkOnTimeout();
                    }
                });
                loginInput.focus(function () {
                    loginInput.removeAttr('required');
                    $.removeCookie('X-OVH-V6-LOGGED', {path:'/'});
                });

                passwordInput.bind('keypress change', function () {
                    passwordInput.attr('required', 'required');
                    $('#error').css('display', 'none');
                    $.removeCookie('X-OVH-V6-LOGGED', {path:'/'});
                    if (timeoutId === undefined) {
                        checkOnTimeout();
                    }
                });
                passwordInput.focus(function () {
                    passwordInput.removeAttr('required');
                    $.removeCookie('X-OVH-V6-LOGGED', {path:'/'});
                });
            })();

            checkOnTimeout();

            form.append($('<input type="hidden" id="redirectTo" name="redirectTo" value="' + (window.location.hash || '#/') + '">'));
        }// end Link
    };//end return
});
