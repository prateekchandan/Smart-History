let list = document.getElementById("list");

// populate the popup
let historyItems = ExtensionState.GetAllHistoryItems();
for (let i = historyItems.length - 1; i >= 0; --i)
{
    mainStuff.innerHTML += `
    <div class="col-1">${historyItems[i].id}</div>
    <div class="col-1">${historyItems[i].parentId}</div>
    <div class="col-10"><p style="overflow:hidden;">${historyItems[i].url}</p></div>
    `
}

