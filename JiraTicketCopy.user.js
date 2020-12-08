// ==UserScript==
// @name         JiraTicketCopy
// @version      1.0
// @description  kopieren von JiraTickets
// @author       Richard Pfeifer
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/JiraTicketCopy.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/JiraTicketCopy.user.js
// @include      https://jira.nevaris.com/secure/RapidBoard.jspa?*
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// ==/UserScript==
(function() {
    document.addEventListener ('keypress', function(e) {
        if (e.ctrlKey && e.keyCode === 25) {

            var ticketsSelected = document.querySelectorAll('.ghx-selected .ghx-issue-content');
            if(ticketsSelected.length)
            {
              const charLimit = 99900;
              var names = [];
              var links = [];
              var boardName = document.querySelector('#ghx-board-name').firstChild.wholeText.trim();
              ticketsSelected.forEach(x => {
                  names.push(x.querySelector('.ghx-summary').firstChild.textContent.replace(/"/g,"'"));
                  links.push(x.querySelector('.ghx-key').firstChild.href);
              });

              var charLinks = 0;
              links.forEach(x => charLinks += x.length);
              var nameLimit = Math.ceil((charLimit - charLinks - names.length * 2 - names.length * 3) / names.length);
              for(var x = 0; x < names.length; ++x)
              {
		  		names[x] = names[x].slice(0, nameLimit);
              }

              GM_setClipboard(`/poll "Test ${boardName}" ${names.map((x, y) => `"${x}... ${links[y]}"`.trim()).join(' ')}`, "text");
            }
            $(ticketsSelected).notify(
                "Kopiert!",
                { position:"right" ,
                  showDuration: 200,
                  className: 'success'}
            );
        }
    });
})();