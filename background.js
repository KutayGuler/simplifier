let optionsIsOpen = false; 
let extensionUrl = 'chrome-extension://cgecigbfjdbfehebjkmokgknnbfcapoh/options.html'

chrome.tabs.onUpdated.addListener(function (tabId, object, tab) {
    chrome.tabs.query({url: "*://www.youtube.com/*"}, function (tabs) {
        if (tabs.length === 0 && optionsIsOpen) {
            chrome.tabs.query({url: extensionUrl}, function (extensionTabs) {
                if (extensionTabs.length > 0) {
                    chrome.tabs.remove(extensionTabs[0].id);
                    optionsIsOpen = false;
                }
            })
        }
    })

    if (typeof object.url !== 'undefined' && !optionsIsOpen) {
        if (object.url.includes('www.youtube.com')) {
            chrome.tabs.query({url: extensionUrl}, function (tabs) {
                if (tabs.length === 0) {
                    chrome.tabs.create({index: 0, url: 'options.html', active: false, pinned: true});
                    optionsIsOpen = true;
                }
            })
        }
    }
})

chrome.tabs.onRemoved.addListener(function () {
    chrome.tabs.query({url: "*://www.youtube.com/*"}, function (tabs) {
        if (tabs.length === 0 && optionsIsOpen) {
            chrome.tabs.query({url: extensionUrl}, function (extensionTabs) {
                if (extensionTabs.length > 0) {
                    chrome.tabs.remove(extensionTabs[0].id);
                    optionsIsOpen = false;    
                }
            })
        }
    })
})

chrome.windows.onCreated.addListener(function (window) {
    chrome.tabs.query({url: "*://www.youtube.com/*"}, function (tabs) {
        if (tabs.length === 0) {
            chrome.tabs.query({url: extensionUrl}, function (extensionTabs) {
                if (extensionTabs.length > 0) {
                    if (extensionTabs[0].windowId == window.id) {
                        chrome.tabs.remove(extensionTabs[0].id);
                        optionsIsOpen = false;
                    }
                }
            })
        }
    })
})