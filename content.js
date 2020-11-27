let channelID = "UCiP9VFdM5qKsZ_9JiAAGtvw";

const domain = "https://www.youtube.com/";
const hrefs = ["", "feed/trending", "feed/subscriptions", "channel/UCqVDpXKLmKeBU_yyt_QkItQ", "feed/library", "feed/history", "feed/purchases", "playlist?list=WL", "playlist?list=LL"];
const directLinks = ["https://studio.youtube.com/channel/" + channelID + "/videos", "https://music.youtube.com/"];

let sections = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-guide-entry-renderer");
// let expanderItem = document.getElementById("expander-item");
// expanderItem.addEventListener('click', expanderItemClicked);

function applyFilter(arr) {
    if (typeof arr === 'undefined') {
        chrome.runtime.sendMessage({name: 'undefined'});
        return;
    }

    if (arr.includes(directLinks[0]) || arr.includes(directLinks[1])) {
        let links = arr.filter(elem => directLinks.includes(elem) == true);
        let hrefs = arr.filter(elem => directLinks.includes(elem) == false);
        hrefs = hrefs.map(href => domain + href);
        arr = [...hrefs, ...links];
    } else {
        arr = arr.map(href => domain + href);
    }

    for (let section of sections) {
        section.hidden = arr.includes(section.href) ? true : false; 
    }
}

// function expanderItemClicked() {
//     chrome.runtime.sendMessage({name: 'expander'})
// }

chrome.runtime.onMessage.addListener(function(message) {
    if (message.name == 'content') {
        applyFilter(message.filterArray);
    }
});