// ==UserScript==
// @name         Salesforce List Auto Update
// @namespace    http://tampermonkey.net/
// @version      1.0
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/salesfoce-auto-update-list.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/salesfoce-auto-update-list.user.js
// @description  Automatically update Salesforce lists so tickets are up to date
// @author       cedteg
// @match        https://nevaris.lightning.force.com/lightning/o/Case/list*
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(function () {
        if (window.location.href.includes("https://nevaris.lightning.force.com/lightning/o/Case/list")) {
            location.reload();
        }
    }, 20 * 1000);
})();