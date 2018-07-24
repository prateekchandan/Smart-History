let list = document.getElementById("list");

// populate the popup
let historyItemList = new HistoryItemList();
let treeItemList = new TreeItemList();
let historyItems = FlattenObjectToValueArray(historyItemList.items);

let historyHour = {};
let historyToday = {};
let historyLastWeek = {};
let historyLastMonth = {};
let historyOlder = {};

let currentDate = new Date();
let currentTimeInMillis = currentDate.getTime();

function PutHistoryItemInGroup(group, historyItem)
{
    let hostname = ExtractHostname(historyItem.url);
    if(!(hostname in group))
    {
        group[hostname] = [];
    }
    group[hostname].push(historyItem);
}


for (let i = historyItems.length - 1; i >=0; i--) {
    let historyItem = historyItems[i];
    let hoursOld = Math.ceil((currentTimeInMillis - historyItem.timeStamp) / 3600000);
    let daysOld = Math.ceil(hoursOld/24);
    if(hoursOld <= 1)
        PutHistoryItemInGroup(historyHour, historyItem);
    else if (daysOld <= 1)
        PutHistoryItemInGroup(historyToday, historyItem);
    else if (daysOld <= 7)
        PutHistoryItemInGroup(historyLastWeek, historyItem);
    else if (daysOld <= 30)
        PutHistoryItemInGroup(historyLastMonth, historyItem);
    else if (daysOld <= 30)
        PutHistoryItemInGroup(historyOlder, historyItem);
}

function FillUpHistory(historyObject, parentDomId)
{
    let i = 1;
    for (var hostName in historyObject) 
    {
        if (historyObject.hasOwnProperty(hostName)) {
            let id = parentDomId.id+i;
            i++;
            parentDomId.innerHTML += `
            <a class="btn btn-outline-primary btn-block" data-toggle="collapse" href="#${id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                ${hostName}
            </a>
            <div class="collapse" id="${id}">
                <div class="card card-body history-item-element" id="${id}-card">
                </div>
            </div>
            `;
            let historyArray = historyObject[hostName];
            for (let i = historyArray.length - 1; i >= 0; --i)
            {
                let url = historyArray[i].url;
                if (url)
                {
                    let domain = historyArray[i].hostname;
                    let favicon = "../image/browseraction_icon_40.png";
                    if(historyArray[i].faviconUrl != undefined)
                    {
                        favicon = historyArray[i].faviconUrl;
                    }
                    let date = new Date(historyArray[i].timeStamp);
                    let dateString = "";
                    if(Math.ceil((currentTimeInMillis - historyArray[i].timeStamp) / 3600000) <= 24)
                    {
                        dateString = date.getHours() % 12;
                        if((date.getHours() % 12) < 10)
                        {
                            dateString = "0" + dateString;
                        }
                        dateString += ":";
                        if(date.getMinutes() < 10)
                        {
                            dateString += "0"; 
                        }
                        dateString += date.getMinutes() + " ";
                        if(date.getHours() < 12)
                        {
                            dateString+="A.M";
                        }
                        else
                        {
                            dateString+="P.M";
                        }
                    }
                    else
                    {
                        dateString = date.getDate()+ "-" + date.getMonth() + "-" + date.getFullYear();
                    }
                    document.getElementById(id + "-card").innerHTML = `
                    <div class="row">
                        <div class="col-1">
                        <img src="${favicon}" class="favicon">
                        </div>
                        <div class="col-8">
                        <div class="title-text">${historyArray[i].title}</div>
                        <div><a href="${url}" class="url-text">${url}</a></div>
                        </div>
                        <div class="col-2 time-text-parent">
                        <span class="time-text">${dateString}</span>
                        </div>
                    </div>
                    ` +  document.getElementById(id + "-card").innerHTML;
                    if( i > 0)
                    {
                        document.getElementById(id + "-card").innerHTML = '<hr>' + document.getElementById(id + "-card").innerHTML;
                    }
                }
            }
        }
    }

    if(i==1) // No items available
    {
        let id = parentDomId.id;
        id = id.substr(0, id.lastIndexOf("Items")) + "Block";
        $("#"+id).css("display","none");
    }
}

FillUpHistory(historyHour, thisHourHistoryItems);
FillUpHistory(historyToday, todayHistoryItems);
FillUpHistory(historyLastWeek, thisWeekHistoryItems);
FillUpHistory(historyLastMonth, lastMonthHistoryItems);
FillUpHistory(historyOlder, olderHistoryItems);

$("#loader").css("display","none");
$("#content").css("display","block");

// construct the suggestion engine
var pages = new Bloodhound({
  datumTokenizer: function(d) { 
    var titleTokens = Bloodhound.tokenizers.whitespace(d.title);
	var urlTokens = Bloodhound.tokenizers.nonword(d.url);

	return titleTokens.concat(urlTokens); 
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: historyItems
});

var initialized = pages.initialize();
initialized
.done(function() { console.log('ready to go!'); })
.fail(function() { console.log('err, something went wrong :('); });

$('#searchWorker').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'pages',
  source: pages
});