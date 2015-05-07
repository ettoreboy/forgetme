
//Add elements to page
function addInfoElement(content) {
    var newdiv = document.createElement('div');
    newdiv.className = "panel panel-info";
    newdiv.innerHTML = content;
    $("#info").append(newdiv);
    return true;
}

//Retrieve accounts informations
function getSites(url) {
    $("#results").empty();

    return $.getJSON(url).then(function (data) {
        var founds = [];
        if (data.person) {
            $.each(data.person.urls, function (k, v) {
                var name, domain, url;
                $.each(this, function (k, v) {
                    if (k === "@domain") {
                        domain = v;
                        console.log(v + " URL:");
                    }
                    if(k === "@name"){
                        name = v;
                    }
                    if (k === "url"){
                        url = v;
                        console.log(v);

                    }
                });
                founds.push([name, domain, url]);
            });
        } else {
            addInfoElement("<h2>There are no exact public matches for this email, you are invisible on the Internet!<br> Try to add your name..</h2>");
        }
        return founds;
    })
            .fail(function () {
                addInfoElement("<h2>Ups! Somenthing went wrong, try again.</h2>");
            });

}

//Create a labelled item depending on the rate
function addSiteFound (name, domain, rate, info){
   var newa = document.createElement("a");
    switch (rate){
        case "easy":
        newa.className="list-group-item list-group-success";        
        break;
    case "hard":
        newa.className="list-group-item list-group-item-warning";
        break;
    case "impossible":
        newa.className="list-group-item list-group-item-danger";
        break;
    }
    if(!info){
        info="No available information about how to delete from this website";
    }
    var news = document.createElement("span");
    news.innerHTML = rate;
    newa.innerHTML = "<b>"+name+"</b>" + info + news;
    newa.href = domain ;
   
    
    
    $("#list-group").append(newa);
}

//Update string parameter, if present
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}
//Check input and submit
function checkAndSubmit(event) {
    event.preventDefault();
    var email = $('#inputEmail').val();
    var name = $('#inputName').val();
    var last = $('#inputLastname').val();
    if (email === "") {

        return false;
    }

    var piplAPI = 'http://api.pipl.com/search/v4/' + "?email=" + email + "&key=kdrphm4hv87tab5q34v2sf5n" + "&callback=?";
    if (name) {
        piplAPI = updateQueryStringParameter(piplAPI, "first_name", name);
    }
    if (last) {
        piplAPI = updateQueryStringParameter(piplAPI, "last_name", last);
    }

    console.log("Request to: " + piplAPI);
    document.getElementById("info")
    $("#info").empty();
    return getSites(piplAPI).then(function (founds) {
        foundsLength = founds.length;
        console.log("FOUNDED: " + foundsLength);
        addInfoElement("Founded "+foundsLength+ " site/s registered under "+"<b>"+email+"</b>");
        $.getJSON('sites.json').then(function (sitesdata) {
            var current;
            $.each(sitesdata, function (k, v) {
                current = v;
                $.each(founds, function (k, domainFounded) {
                    console.log("Checking:" + domainFounded[1] + " = " + current.domains);
                    if (domainFounded[1] == current.domains) {
                        console.log(domainFounded[0] +" " + domainFounded[1] + " " + current.difficulty);
                        addSiteFound(domainFounded[0] +" - "+ domainFounded[1] , current.url, current.difficulty, current.notes);
                        founds.pop(domainFounded);
                        return false;
                    }
                    //console.log(v.domains);
                });

            });
        });



    });
}

