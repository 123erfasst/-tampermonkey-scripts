// ==UserScript==
// @name         YouTrackTicketCopy
// @version      1.0
// @description  kopieren von JiraTickets
// @author       Richard Pfeifer
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/YouTrackTicketCopy.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/YouTrackTicketCopy.user.js
// @include      https://123erfasst.myjetbrains.com/youtrack/agiles/*
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// ==/UserScript==
(function() {
    document.addEventListener ('keypress', function(e) {
        if (e.ctrlKey && e.keyCode === 25) {

            var ticketsSelected = ((x  = document.querySelectorAll('.yt-agile-card_selected')) => x.length ? x : document.querySelector('.yt-agile-card_focused'))();
            if(ticketsSelected.length)
            {
              const charLimit = 99900;
              var names = [];
              var links = [];
              var boardName = document.querySelector('.yt-search-panel__context__button__text').firstChild.wholeText.trim();
              ticketsSelected.forEach(x => {
                  names.push(x.querySelector('span').firstChild.wholeText);
                  links.push(`https://123erfasst.myjetbrains.com/youtrack/${x.querySelector('[href]').getAttribute('href')}`);
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
            else
            {
              GM_setClipboard(`${ticketsSelected.querySelector('span').firstChild.wholeText} https://123erfasst.myjetbrains.com/youtrack/${ticketsSelected.querySelector('[href]').getAttribute('href')}`, "text");
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