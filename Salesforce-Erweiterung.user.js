// ==UserScript==
// @name         SalesForce-Erweiterungen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ThomasTebbe, cedteg
// @updateURL    https://github.com/123erfasst/tampermonkey-scripts/raw/master/Salesforce-Erweiterung.user.js
// @downloadURL  https://github.com/123erfasst/tampermonkey-scripts/raw/master/Salesforce-Erweiterung.user.js
// @match        https://nevaris.lightning.force.com/lightning/*
// @grant        none
// ==/UserScript==

(
        function() {
    'use strict';
setInterval(function(){check()}, 100);
}
)();
function check() {
    var input = document.getElementsByClassName('slds-rich-text-area__content');
    if(input){
        var inputField = document.getElementsByClassName('slds-rich-text-area__content')[0];
        if (inputField.innerText === 'more'){
            inputField.innerText = "";
            inputField.innerHTML = templateMoreInformation;
        }
        if (inputField.innerText === 'toIt'){
            inputField.innerText = "";
            inputField.innerHTML = toIt;
        }
    };
};

const templateMoreInformation=`<p>Zur Bearbeitung brauche ich mehr Informationen.
    - Welcher Mandant?
    - Welcher Benutzer war eingeloggt?
    - Was hat der Benutzer gemacht?
    - Wo (App / Office / Weberfassung) hat er es gemacht?
    - Wie kann ich den Fehler nachstellen?
    - Welches Verhalten wird vom Kunden erwartet?
    - Welches Verhalten tritt auf?</p>
`
const toIt=`<p><b><u>Einstufung</u></b>
<b>Betroffen:</b> (Ein Mandant / Alle Mandanten) / (Alle Mitarbeiter / Bestimmte Mitarbeiter)
<b>Sonstiges:</b> (Kundentermin am 28.02.2020, Auswirkung Lohnabrechnung 01.02.2018, Kunde im Test, etc)
<b>Umgebung:</b> (Office, App, Weberfassung Quality-App, ...)

<b><u>Betroffener Kunde:</u></b>
<b>Mandant / Betroffener Benutzer:</b>
<b>Selbsthoster:</b> (Ja / Nein)
<b>Serveradresse:</b>

<b>Wie lässt sich das Problem nachstellen</b>
1.
2.
3.

<b><u>Tatsächliches Verhalten:</u></b>


<b><u>Erwartetes Verhalten:</u></b>


<b><u>Screenshots:</u></b>


</p>`
