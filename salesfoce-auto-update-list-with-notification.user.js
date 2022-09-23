// ==UserScript==
// @name         Salesforce List Auto Update with notification
// @namespace    http://tampermonkey.net/
// @version      1.4
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/salesfoce-auto-update-list-with-notification.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/salesfoce-auto-update-list-with-notification.user.js
// @description  Automatically update Salesforce lists so tickets are up to date
// @author       Sven Heidemann, Benno Pohl
// @grant        GM_notification
// @grant        GM_log
// @grant        GM.setValue
// @grant        GM.getValue
// @match        https://nevaris.lightning.force.com/lightning/o/Case/list*
// ==/UserScript==


'use strict';
function getTicketList() {
    return document.querySelector('#brandBand_1 > div > div > div > div > div.slds-grid.listDisplays.safari-workaround-anchor > div > div.slds-col.slds-no-space.forceListViewManagerPrimaryDisplayManager > div.undefined.forceListViewManagerGrid > div.listViewContent.slds-table--header-fixed_container > div.uiScroller.scroller-wrapper.scroll-bidirectional.native > div > div > table > tbody')
}

function getTicketCount() {
    return getTicketList().querySelectorAll('tr').length
}

function getTicketIds() {
    var ids = [];
    var ticketListLinks = getTicketList().querySelectorAll('tr > td:nth-child(4) > span > a');
    ticketListLinks.forEach(element => {
        ids.push(element.innerText || element.textContent);
    });
    return ids;
}

function compareTickets(oldTickets, newTickets) {
    var closedTickets = [];
    var openedTickets = [];
    newTickets.forEach(newID => {
        if (!oldTickets.includes(newID)) {
            openedTickets.push(newID);
        }
    });
    oldTickets.forEach(newID => {
        if (!newTickets.includes(newID)) {
            closedTickets.push(newID);
        }
    });
    return {
        closed: closedTickets,
        opened: openedTickets
    };
}

function notify(closed, opened) {
    if (closed.length > 0) {
        GM_notification({ title: 'SF geschlossene Tickets', text: `Geschlossene Tickets (${closed.length}): ${closed.toString()}`});
    }

    if (opened.length > 0) {
        GM_notification({ title: 'SF geöffnete Tickets', text: `Geöffnete Tickets (${opened.length}): ${opened.toString()}`});
    }
}

async function validateTicketCount() {
    if (!window.location.href.includes("https://nevaris.lightning.force.com/lightning/o/Case/list")) {
        return;
    }
    GM_log('tampermonkey: Compare tickets');
    var oldTickets = await GM.getValue('Tickets');
    var newTickets = getTicketIds();
    await GM.setValue('Tickets', newTickets);
    var result = compareTickets(oldTickets, newTickets);
    notify(result.closed, result.opened);
}

setTimeout(async () => {
    await validateTicketCount();
}, await GM.getValue('CompareTicketsDelaySeconds', 10) * 1000);

setTimeout(() => {
    if (!window.location.href.includes("https://nevaris.lightning.force.com/lightning/o/Case/list")) {
        return;
    }
    GM_log('tampermonkey: reload');
    location.reload();
}, await GM.getValue('ReloadDelaySeconds', 30) * 1000);
