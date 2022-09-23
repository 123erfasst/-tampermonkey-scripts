// ==UserScript==
// @name         Salesforce List Auto Update with notification
// @namespace    http://tampermonkey.net/
// @version      1.2
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/salesfoce-auto-update-list-with-notification.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/salesfoce-auto-update-list-with-notification.user.js
// @description  Automatically update Salesforce lists so tickets are up to date
// @author       Sven Heidemann, Benno Pohl
// @grant        GM_notification
// @grant        GM.setValue
// @grant        GM.getValue
// @match        https://nevaris.lightning.force.com/lightning/o/Case/list*
// ==/UserScript==


'use strict';
function getTicketCount() {
    var select = document.querySelector('#brandBand_1 > div > div > div > div > div.slds-grid.listDisplays.safari-workaround-anchor > div > div.slds-col.slds-no-space.forceListViewManagerPrimaryDisplayManager > div.undefined.forceListViewManagerGrid > div.listViewContent.slds-table--header-fixed_container > div.uiScroller.scroller-wrapper.scroll-bidirectional.native > div > div > table > tbody');
    return select.querySelectorAll('tr').length
}

setTimeout(async () => {
    if (!window.location.href.includes("https://nevaris.lightning.force.com/lightning/o/Case/list")) {
        return;
    }
    await GM.setValue('TicketCount', getTicketCount());
    location.reload();
    var oldTicketCount = await GM.getValue('TicketCount');
    var newTicketCount = getTicketCount();
    if (newTicketCount == oldTicketCount) {
        return;
    }

    if (newTicketCount > oldTicketCount) {
        GM_notification({ title: 'SF neue Tickets', text: `Es sind ${newTicketCount - oldTicketCount} neue Tickets vorhanden`});
    } else if (newTicketCount < oldTicketCount) {
        GM_notification({ title: 'SF weniger Tickets', text: `Es sind ${oldTicketCount - newTicketCount} weniger Tickets vorhanden`});
    }
}, 30 * 1000);
