// ==UserScript==
// @name         ERFifier
// @version      1.5
// @description  Githubs ERFs werden zum Link
// @match        https://github.com/123erfasst/123erfasst/pull/*
// @match        https://github.com/123erfasst/123quality/pull/*
// @match        https://github.com/123erfasst/123telematics/pull/*
// @match        https://github.com/123erfasst/123trackingdummy/pull/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/github-erfifier.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/github-erfifier.user.js
// @grant        none
// @author       Sascha Bultmann
// ==/UserScript==
(function() {
    'use strict';
    const getTitleElement = () => document.querySelector("#partial-discussion-header .markdown-title")
    const getCommentElements = () => document.querySelectorAll(".comment-body")
    const getErf = (el) => (el.innerHTML.match(new RegExp("ERF-[0-9]{1,5}")) || [])[0]
    const replaceErfWithLink = (el, erf) => el.innerHTML = el.innerHTML.replace(erf, `<a href="https://nevaris-gmbh.atlassian.net/browse/${erf}" target="_blank">${erf}</a>`)
    const alreadyContainsLink = (el) => el.innerHTML.indexOf("<a href") !== -1
    const addLinkToElement = (el) => {
        const erf = getErf(el)
        if (erf && !alreadyContainsLink(el)) replaceErfWithLink(el, erf)
    }
    const addLinkToTitle = () => addLinkToElement(getTitleElement())
    const addLinkToComments = () => getCommentElements().forEach(addLinkToElement)
    const getJenkinsDetailButtons = () => document.querySelectorAll(".status-actions")
    const addTargetBlankToJenkinsDetailButton = (el) => el.setAttribute('target', '_blank')
    const addTargetBlankToJenkinsDetailButtons = () => getJenkinsDetailButtons().forEach(addTargetBlankToJenkinsDetailButton)
    const addLinks = () => {
        addLinkToTitle()
        addLinkToComments()
        addTargetBlankToJenkinsDetailButtons()
    }
    new MutationObserver(addLinks).observe(document.querySelector("body"), { subtree: true, childList: true, characterData: true });
})();
