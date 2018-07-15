let list = document.getElementById("list");

// populate the popup
let historyItems = ExtensionState.GetAllHistoryItems();
for (let i = historyItems.length - 1; i >= 0; --i)
{
    list.innerHTML += "<li><a href=" + historyItems[i].url + ">" + historyItems[i].url + "</a></li>";
}

