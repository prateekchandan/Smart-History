let list = document.getElementById("list");

// populate the popup
let historyItems = ExtensionState.GetAllHistoryItems();

let historyToday = [];
let historyLastWeek = [];
let historyLastMonth = [];

let currentDate = new Date();
let currentTimeInMillis = currentDate.getTime();

historyItems.map((historyItem) =>
{
    switch (Math.ceil((currentTimeInMillis - historyItem.timeStamp) / 86400000))
    {
        case 1:
            historyToday.push(historyItem);
            break;
        case 7:
            historyLastWeek.push(historyItem);
            break;
        case 30:
            historyLastMonth.push(historyItem);
            break;
        default:
            historyLastMonth.push(historyItem);
            break;
    }
})

// I know I could've just written a function but meh

for (let i = historyToday.length - 1; i >= 0; --i)
{
    todayHistory.innerHTML += `
    <div class="col-1">${historyToday[i].id}</div>
    <div class="col-1">${historyToday[i].parentId}</div>
    <div class="col-10"><p style="overflow:hidden;">${historyToday[i].url}</p></div>
    `
}

for (let i = historyLastWeek.length - 1; i >= 0; --i)
{
    thisWeekHistory.innerHTML += `
    <div class="col-1">${historyLastWeek[i].id}</div>
    <div class="col-1">${historyLastWeek[i].parentId}</div>
    <div class="col-10"><p style="overflow:hidden;">${historyLastWeek[i].url}</p></div>
    `
}

for (let i = historyLastMonth.length - 1; i >= 0; --i)
{
    lastMonthHistory.innerHTML += `
    <div class="col-1">${historyLastMonth[i].id}</div>
    <div class="col-1">${historyLastMonth[i].parentId}</div>
    <div class="col-10"><p style="overflow:hidden;">${historyLastMonth[i].url}</p></div>
    `
}