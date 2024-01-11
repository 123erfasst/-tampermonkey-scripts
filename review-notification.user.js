// ==UserScript==
// @name         Review/Rework-Notification
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  get someone to review pls
// @author       Sascha Bultmann
// @match        https://jira.nevaris.com/secure/RapidBoard.jspa?rapidView=286*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nevaris.com
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/review-notification.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/review-notification.user.js
// ==/UserScript==

(function() {
    'use-strict'

    const NAME = "Bultmann, Sascha"; // TODO: change this to your name
    const LINK_TEMPLATE = "https://jira.nevaris.com/browse/ERF-"
    const NOTIFY_IF_OLDER_THAN_HOURS = 3
    const COLUMN_ID_REVIEW = 3026
    const COLUMN_ID_REWORK = 3005

    const getHtml = (url) => fetch(url).then(x => x.text())

    const extractUpdateDate = (html) => {
        const regex = /Aktualisiert:[\s\S]*?datetime="([0-9\-T:+]+)"/;
        const match = html.match(regex);
        return match ? match[1] : null;
    }

    const getDateDiffInMinutes = (date1, date2) => {
        const diff = Math.abs(date1 - date2)
        return Math.floor((diff / 1000) / 60)
    }

    const needsNotification = async (link) => {
        const updateDateString = await getHtml(link).then(html => extractUpdateDate(html))
        const updateDate = new Date(updateDateString)

        const diffInMinutes = getDateDiffInMinutes(new Date(), updateDate)

        return diffInMinutes / 60 > NOTIFY_IF_OLDER_THAN_HOURS
    }

    const collectLinks = (columnid) => {debugger;
        const lists = $(`[data-column-id='${columnid}']`)
        let result = []
        for (let i = 0; i < lists.length; i++) {
            var tickets = $(lists[i]).find(".js-detailview").filter((i, x) => $(x).find(`[title="Bearbeiter: ${NAME}"]`).length > 0).find(".ghx-key-link-issue-num")
            for (var j = 0; j < tickets.length; j++) {
                result.push(LINK_TEMPLATE + $(tickets[j]).text().substring(1))
            }
        }
        return result
    }

    const showNotification = (link, title) => {
        Notification.requestPermission().then(function(permission) {
            if (permission === "granted") {
                var notification = new Notification(title, {
                    body: link
                })
                notification.onclick = () => {
                    window.open(link, "_blank")
                }
            }
        });
    }

    const check = async (column_id, title) => {
        const links = collectLinks(column_id)
        for (var i = 0; i < links.length; i++) {
            if (await needsNotification(links[i])) showNotification(links[i], title)
        }
    }

    const runReviews = () => {
        check(COLUMN_ID_REVIEW, "Dein Ticket braucht nen Review!")
    }

    const runReworks = () => {
        check(COLUMN_ID_REWORK, "Dein Ticket ist in Rework!")
    }

    const run = () => {
        runReviews()
        runReworks()
    }

    setTimeout(run, 2000)
    setInterval(run, 60 * 60 * 1000)
})()