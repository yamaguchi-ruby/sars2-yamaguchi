function active_covid19(global){
    let req = new XMLHttpRequest
    let uri = "350001_yamaguchi_covid19_hospitalization.csv"
    if(typeof(global) != "undefined"){
        uri = "https://yamaguchi-ruby.github.io/sars2-yamaguchi/" + uri
    }
    req.open("GET", uri)
    req.send()
    req.onload = function(e){
        let a = req.response
        let b = a.split("\r\n")[a.split("\r\n").length - 1].split(",")
        let c = b[4]
        let d = new Date(Date.parse(b[0]))
        console.log(c, d)
        let s = document.getElementById("sum")
        let el = document.createElement("div")
        el.innerText = `入院: ${c}人 (${(new Era(d)).getWareki()}時点)`
        s.after(el)
    }
}

active_covid19(true)