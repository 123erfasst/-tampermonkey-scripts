// ==UserScript==
// @name         EasyCommitCopyForRevert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to copy all commits to clipboard in order for revert
// @author       You
// @match        https://github.com/123erfasst/123erfasst/pull/*
// @icon         https://www.google.com/s2/favicons?domain=nevaris.com
// @grant        GM_setClipboard
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/github-copyCommits.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/github-copyCommits.user.js
// ==/UserScript==

(function() {
    'use strict';
    const getHeader = () => document.querySelector(".gh-header-meta")
    const getCommits = () => [...document.querySelectorAll(".js-commits-list-item clipboard-copy")].map(x => x.value)
    const createButton = (commits) => {
      const button = document.createElement("button")
      button.innerText = "Commits kopieren"
      button.id = "commitCopyButton"
      button.className = "btn btn-sm d-inline-block float-none m-0 mr-md-0"
      button.onclick = () => GM_setClipboard([...commits].reverse().join(' '))
      return button
    }
    const existsButton = () => document.querySelector("#commitCopyButton") != null
    const addButton = () => {
        const commits = getCommits();
        if (commits.length > 0 && !existsButton()) getHeader().appendChild(createButton(commits))
    }
    new MutationObserver(addButton).observe(document.querySelector("body"), { subtree: true, childList: true, characterData: true });
})();