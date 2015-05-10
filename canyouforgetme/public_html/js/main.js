
//Add elements to page
function addInfoElement(content) {
  "use strict";
    var newdiv = document.createElement('h3');
    newdiv.innerHTML = content;
    $("#description").slideDown('slow');
    $(newdiv).hide().appendTo("#info").fadeIn(1000);
}

//Retrieve accounts informations
function getSites(url) {
  "use strict";
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
                    if (k === "@name") {
                        name = v;
                    }
                    if (k === "url") {
                        url = v;
                        console.log(v);

                    }
                });
                founds.push([name, domain, url]);
            });
        } else {
            $(".spinner").hide();
            $("#submit").attr('disabled',false);
            addInfoElement("There are no exact public matches for this email! Try to add your name..");
        }
        return founds;
    })
            .fail(function () {
                $(".spinner").hide();
                $("#submit").attr('disabled',false);
                addInfoElement("Ups! Somenthing went wrong, try again.");
            });

}

//Create a labelled item depending on the rate
function addSiteFound(name, domain, rate, info) {
  "use strict";
    var newa = document.createElement("a");
    switch (rate) {
        case "easy":
            newa.className = "list-group-item list-group-success";
            break;
        case "hard":
            newa.className = "list-group-item list-group-item-warning";
            break;
        case "impossible":
            newa.className = "list-group-item list-group-item-danger";
            break;
    }
    if (!info) {
        info = "No available information about how to delete from this website";
    }
    newa.innerHTML = "<b>" + name + "</b> " + info + " <span>RATE: " + rate + "</span>";
    newa.href = domain;
    $(newa).hide().appendTo("#list-group").fadeIn(1000);

}

//Update string parameter, if present
function updateQueryStringParameter(uri, key, value) {
  "use strict";
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
  "use strict";
    event.preventDefault();
    
    $("#list-group").empty();
    $("#info").empty();
    $(".spinner").show();

    var email = $('#inputEmail').val();
    var name = $('#inputName').val();
    var last = $('#inputLastname').val();
    if (email === "") {
        $(".spinner").hide();
        $("#submit").attr('disabled',false);
        return false;

    }
    $("#submit").attr('disabled',true);
    var piplAPI = 'https://api.pipl.com/search/v4/' + "?email=" + email + "&key=kdrphm4hv87tab5q34v2sf5n" + "&callback=?";
    if (name) {
        piplAPI = updateQueryStringParameter(piplAPI, "first_name", name);
    }
    if (last) {
        piplAPI = updateQueryStringParameter(piplAPI, "last_name", last);
    }

    console.log("Request to: " + piplAPI);
    document.getElementById("info");
    return getSites(piplAPI).then(function (founds) {
        var foundsLength = founds.length;
        console.log("FOUNDED: " + foundsLength);
        addInfoElement("Founded <b>" + foundsLength + " site/s</b> registered under " + "<b>" + email + "</b>");
        $.getJSON('sites.json').then(function (sitesdata) {
            var current;
            $.each(sitesdata, function (k, v) {
                current = v;
                $.each(founds, function (k, domainFounded) {
                    if (domainFounded[1] == current.domains) {
                        console.log("Match: "+domainFounded[0] + " " + domainFounded[1] + " " + current.difficulty);
                        addSiteFound(domainFounded[0] + " - " + domainFounded[1], current.url, current.difficulty, current.notes);
                        founds.pop(domainFounded);
                        return false;
                    }
                });

            });
        });
        $(".spinner").hide();
        $("#submit").attr('disabled',false);
    });
     
}
