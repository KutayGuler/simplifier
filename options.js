let arr = new Array();
let buttons = document.getElementsByClassName('btn');
// let selectAllButton = document.getElementById('select-all');

document.addEventListener('DOMContentLoaded', restore_options);
Array.from(buttons).forEach(function(button) {button.addEventListener('click', save_options);});

// selectAllButton.onclick = function () {
//     let checkbox = selectAllButton.firstElementChild;
//     checkbox.checked = !checkbox.checked;

//     if (checkbox.checked) {
//         selectAllButtons();
//         selectAllButton.innerHTML = selectAllButton.innerHTML.replace('Select','Unselect');
//     } else {
//         unselectAllButtons();
//         selectAllButton.innerHTML = selectAllButton.innerHTML.replace('Unselect','Select');
//     }
//     save_options();
// }

function selectAllButtons() {
    for (let button of buttons) {
        let checkbox = button.firstElementChild;
        checkbox.checked = true;
    }

    arr = [];
}

function unselectAllButtons() {
    for (let button of buttons) {
        let checkbox = button.firstElementChild;
        checkbox.checked = false;
        arr.push(checkbox.value);
    }
}

for (let button of buttons) {
    button.onclick = toggleButton;
}

function toggleButton() {
    let checkbox = this.firstElementChild;
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked && arr.includes(checkbox.value)) {
        arr = arr.filter(value => value != checkbox.value);
    } else if (!checkbox.checked) {
        arr.push(checkbox.value);
    }
}

function save_options() {
    chrome.storage.sync.set({filterArray: arr});
    chrome.tabs.query({url: "*://www.youtube.com/*"}, function(tabs) {
        if (typeof tabs[0] !== 'undefined') {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {name: 'content', filterArray: arr});
            }
        }
      });
}

function restore_options() {
    chrome.storage.sync.get(['filterArray'], function(result) {
        if (typeof result.filterArray === 'undefined') {
            chrome.storage.sync.set({filterArray: arr});
        } else {
            arr = result.filterArray;
        } 
        updateUI(arr);
    });
}

function updateUI(arr) {
    for (let button of buttons) {
        let checkbox = button.firstElementChild;
        checkbox.checked = arr.includes(checkbox.value) ? false : true;
    }
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message.name === 'undefined') {
        save_options();
    }
})

chrome.tabs.onUpdated.addListener(function () {
    save_options();
});

//TODO: OAuth login to YouTube
//TODO: applyFilter when expander item is clicked (figure it out with mutations)
//TODO: also hide the elements when they get minimal (also figure outable with mutations)