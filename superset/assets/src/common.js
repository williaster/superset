/* eslint global-require: 0, no-console: 0 */
import $ from 'jquery';
import { t } from './locales';
import { SupersetClient } from '@superset-ui/core';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import utils = from './modules/utils';

$(document).ready(function () {
  $(':checkbox[data-checkbox-api-prefix]').change(function () {
    const $this = $(this);
    const prefix = $this.data('checkbox-api-prefix');
    const id = $this.attr('id');
    utils.toggleCheckbox(prefix, '#' + id);
  });

  // for language picker dropdown
  $('#language-picker a').click(function (ev) {
    ev.preventDefault();

    const targetUrl = ev.currentTarget.href;
    $.ajax(targetUrl).then(() => {
      location.reload();
    });
  });
});

export function appSetup() {
  // A set of hacks to allow apps to run within a FAB template
  // this allows for the server side generated menus to function
  window.$ = $;
  window.jQuery = $;
  require('bootstrap');

  SupersetClient.configure({ host: (window.location && window.location.host) || '' })
    .init()
    .catch((error) => {
      console.warn(error);
    });
}

// Error messages used in many places across applications
export const COMMON_ERR_MESSAGES = {
  SESSION_TIMED_OUT: t('Your session timed out, please refresh your page and try again.'),
};
