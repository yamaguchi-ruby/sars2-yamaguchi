function make_table(){
    let table = document.createElement("table")
    list.append(table)
    let req = new XMLHttpRequest
    req.open("GET", "sars2-yamaguchi-info.json")
    req.send()
    req.onload = function(e){
        let info = JSON.parse(req.responseText)
        let tr = document.createElement("tr")
        table.append(tr)
        let th
        ths = ["番号", "公表日", "市町村", "年代", "性別", "国籍"]
        for(i in ths){
            th = document.createElement("th")
            tr.append(th)
            th.innerText = ths[i]
        }
        for(i in info){
            let tr = document.createElement("tr")
            table.append(tr)
            let td
            tds = [
                `${1+parseInt(i)}`,
                info[i]["date"],
                info[i]["city"],
                info[i]["age"],
                info[i]["sex"],
                (!!info[i]["country"] ? info[i]["country"] : "")
            ]
            for(j in tds){
                td = document.createElement("td")
                tr.append(td)
                td.innerText = tds[j]
            }
        }
    }
}

make_table()