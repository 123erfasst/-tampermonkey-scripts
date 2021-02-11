// ==UserScript==
// @name         add Ip to Google Cloudplatform Firewall
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description
// @author       Cedric Tegenkamp
// @match        https://console.cloud.google.com/networking/firewalls/details/*-home*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/add_ip_to_google_cloudplatform_firewall.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/add_ip_to_google_cloudplatform_firewall.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function() {
        var c = document.getElementsByClassName("ace-icon ace-icon-edit ace-icon-size-small")
        c[0].click();
        fetch("https://api.ipify.org?format=json").then(function(response) {
            return response.json();
        }).then(function(data) {

            var x = document.getElementsByClassName("ace-icon ace-icon-size-small mat-mdc-chip-remove mat-mdc-chip-trailing-icon mat-mdc-focus-indicator mdc-chip__icon mdc-chip__icon--trailing ace-icon-cancel");
            x[0].click();
            document.getElementById("mat-mdc-chip-list-input-0").focus();
            document.getElementById("mat-mdc-chip-list-input-0").value = data.ip;
            document.getElementById("mat-mdc-chip-list-input-0").blur();
            jQuery("button[type='submit']").trigger("click")
        })
    }, 3000);
})();