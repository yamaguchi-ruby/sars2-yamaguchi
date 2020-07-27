function make_table(){
    let table = document.createElement("table")
    list.append(table)
    let req = new XMLHttpRequest
    let uri = "sars2-yamaguchi-info.json"
    if(typeof(covtablef) != "undefined"){
        uri = "https://yamaguchi-ruby.github.io/sars2-yamaguchi/" + uri
    }
    req.open("GET", uri)
    req.send()
    req.onload = function(e){
        let info = JSON.parse(req.responseText)
        let citylist = {}
        let ul = document.createElement("ul")

        for(i in info["data"]){
            let tr = document.createElement("tr")
            if(!citylist[info["data"][i]["city"]]){
                citylist[info["data"][i]["city"]] = 0
            }
            citylist[info["data"][i]["city"]] += 1
            table.prepend(tr)
            let td
            tds = [
                `${1+parseInt(i)}`,
                (new Era(info["data"][i]["date"])).getWareki(),
                info["data"][i]["city"],
                info["data"][i]["age"],
                info["data"][i]["sex"],
                (info["data"][i]["from"] ? info["data"][i]["from"] : ""),
                (info["data"][i]["ps"] ? info["data"][i]["ps"] : "")
            ]
            let li = document.createElement("li");
            li.classList += "kt"
            li.innerHTML = `<table class="ktable">
                <tr><td colspan="6" style="border: none; empty-cells: hide"></td><th>番号</th><td>${tds[0]}</td></tr>
                <tr><th colspan="2">市町村</th><td colspan="6">${tds[2]}</td></tr>
                <tr><th colspan="2">公表日</th><td colspan="6">${tds[1]}</td></tr>
                <tr><th colspan="2">年代</th><td colspan="2">${tds[3]}</td><th colspan="2">性別</th><td colspan="2">${tds[4]}</td></tr>
                <tr><th colspan="2">感染経路</th><td colspan="6">${tds[5]}</td></tr>
                <tr><th colspan="8">備考</th></tr>
                <tr><td colspan="8" class="bk">​${tds[6]}</td></tr>
            </table>`
            ul.prepend(li)
        }
        document.getElementById("list").appendChild(ul)
        sum.innerHTML = `<span><ruby>現在<rt>${(new Era(info["data"][info["data"].length - 1]["date"])).getWareki()} 時点</rt></ruby> </span><span class="number">${info["data"].length}</span><span> 人</span>`
        map_yamaguchi(citylist, parseInt(p["delay"]))
    }
}

function map_yamaguchi(citylist, delay){
    if(!delay)
        delay = 0
    let req = new XMLHttpRequest
    
    let uri = "yamaguchi.svg"
    if(typeof(covtablef) != "undefined"){
        uri = "https://yamaguchi-ruby.github.io/sars2-yamaguchi/" + uri
    }
    req.open("GET", uri)
    req.send()
    req.onload = function(e){
        map.innerHTML = req.responseText
        let i = 0
        let a = setInterval(
            function(){
                let city = Object.keys(citylist)[i]
                let n = citylist[city]
                let c = document.getElementById(city)
                if(c){
                    c.style.fill = heatmap_purple(parseInt(Math.log2(n)))[0]
                    c.style.stroke = heatmap_purple(parseInt(Math.log2(n)))[1]
                }
                i++
                if(!(i < Object.keys(citylist).length))
                    clearInterval(a)
            },
            delay
        )
        hover_city(citylist)
    }
}

function heatmap_purple(i){
    // 紫色を取得
    ary = ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C"]
    fill = ""
    stroke = ""
    if(i > ary.length - 2){
        fill = ary[ary.length - 1]
        stroke = fill
    }else{
        fill = ary[i]
        stroke = ary[i+1]
    }
    return [fill, stroke]
}

function hover_city(citylist){
    let cities = document.getElementsByTagName("path")
    let city_info = document.createElement("div")
    city_info.id = "city_info"
    document.body.getElementsByTagName("article")[0].append(city_info)
    for(let i = 0; i < cities.length; i++){
        cities[i].addEventListener('mousemove', e => {
            let y = e.clientY
            let x = e.clientX
            city_info.style.top = `${y + 8}px`
            city_info.style.left = `${x + 16}px`
            city_info.innerText = `${e.target.id}\n${citylist[e.target.id] ? citylist[e.target.id] : 0}人`
        })
        document.body.addEventListener("mousemove", e => {
            if(e.target.localName == "path"){
                city_info.style.display = "block"
            }else{
                city_info.style.display = "none"
            }
        })
    }
}

function params(){
    let obj = {}
    let params = location
        .search
        .substring(1)
        .split("&")
        .map(
            function(e){
                return e.split("=")
            }
        );
    for(let i in params){
        obj[params[i][0]] = params[i][1]    
    }
    return obj
}

let p = params()
make_table()
