// ==UserScript==
// @name         Pr0ShitSkipper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       GoldeneGabel
// @match        https://pr0gramm.com/*
// @grant        none
// @updateURL    https://github.com/GoldeneGabel/Pr0ShitSkipper/raw/master/Pr0ShitSkipper.user.js
// @downloadURL  https://github.com/GoldeneGabel/Pr0ShitSkipper/raw/master/Pr0ShitSkipper.user.js
// ==/UserScript==

(function() {
    'use strict';
    var benisCache = [];
    async function fetchBenis() {
        try{
            var username = jQuery("div.item-details>a.user")[0].text;
            var url = "https://pr0gramm.com/api/profile/info?name="+username;
            if(!benisCache[username]) {
                var response = await jQuery.getJSON(url);
                benisCache[username] = response.user.score;
            }
            return benisCache[username];
        } catch(e) {
            return 0;
        }
    }
    async function skipFliese(direction) {
        if((await fetchBenis()) < -10000) {
            if(direction < 0) {
                prevPost();
                return true;
            } else {
                nextPost();
                return true;
            }
        }
        return false;
    }
    function skipBad(direction) {
        if(Number(jQuery('.score').get(0)?.textContent || 0) < -100) {
            if(direction < 0) {
                prevPost();
                return true;
            } else {
                nextPost();
                return true;
            }
        }
        return false;
    }
    function isTiktok() {
        var tags = jQuery('.tag').get();
        for(var i in tags) {
            var ratio = (tags.length-i)/tags.length;
            var tagText = tags[i].textContent.toLowerCase().trim();
            if(tagText.startsWith('tiktok') || tagText.startsWith('tik tok')) {
                if(ratio > 0.2) {
                   return true;
                }
            }
        }
        return false
    }
    function skipTiktok(direction) {
        if(isTiktok()) {
            if(direction < 0) {
                prevPost();
                return true;
            } else {
                nextPost();
                return true;
            }
        }
        return false;
    }
    function voteDown() {
        jQuery('.vote-down').click();
    }
    function nextPost() {
        jQuery('.stream-next-icon').click();
    }
    function prevPost() {
        jQuery('.stream-prev-icon').click();
    }
    async function skipShit() {
        if(window['doNotSkip']) return false;
        return (await skipFliese()) || (skipTiktok() || skipBad());
    }

    window['skipShit'] = skipShit;

    setInterval(skipShit, 500);
})();

jQuery(document).keydown(
	(e) => {
		if(e.keyCode == 9){
			console.log(doNotSkip=true);
			e.preventDefault();
			e.stopPropagation();
		}
	}
);
jQuery(document).keyup(
	(e) => {
		if(e.keyCode == 9){
			console.log(doNotSkip=false);
			e.preventDefault();
			e.stopPropagation();
		}
	}
);
