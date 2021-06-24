// ==UserScript==
// @name         ERFifier
// @version      0.9
// @description  Githubs ERFs werden zum Link
// @match        https://github.com/123erfasst/123erfasst/pull/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/github-erfifier.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/github-erfifier.user.js
// @grant        none
// @author       Sascha Bultmann
// ==/UserScript==
(function() {
    'use strict';
    const getTitleElement = () => document.querySelector("#partial-discussion-header span.markdown-title")
    const getCommentElements = () => document.querySelectorAll("td.comment-body")
    const getErf = (el) => (el.innerHTML.match(new RegExp("ERF-[0-9]{1,4}")) || [])[0]
    const replaceErfWithLink = (el, erf) => el.innerHTML = el.innerHTML.replace(erf, `<a href="https://jira.nevaris.com/browse/${erf}" target="_blank">${erf}</a>`)
    const alreadyContainsLink = (el) => el.innerHTML.indexOf("<a href") !== -1
    const addLinkToElement = (el) => {
        const erf = getErf(el)
        if (erf && !alreadyContainsLink(el)) replaceErfWithLink(el, erf)
    }
    const addLinkToTitle = () => addLinkToElement(getTitleElement())
    const addLinkToComments = () => getCommentElements().forEach(addLinkToElement)
    const addLinks = () => {
        addLinkToTitle()
        addLinkToComments()
    }
    new MutationObserver(addLinks).observe(document.querySelector("body"), { subtree: true, childList: true, characterData: true });
})();
