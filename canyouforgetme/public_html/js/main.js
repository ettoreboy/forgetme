
//Add elements to page
function addElement(content) {
    var newdiv = document.createElement('div');
    newdiv.className = "jumbotron";
    newdiv.innerHTML = content;
    $("#results").append(newdiv);
    return true;
}

//Retrieve accounts informations
function getSites(url) {
    $("#results").empty();

    return $.getJSON(url).then(function (data) {
        var founds = [];
        if (data.person) {
            $.each(data.person.urls, function (k, v) {

                $.each(this, function (k, v) {
                    if (k === "@domain") {
                        founds.push(v);
                        console.log(v);
                    }
                });
                ;
            });
        } else {
            addElement("<h2>There are no exact public matches for this email, you are invisible on the Internet!<br> Try to add your name..</h2>");
        }
        return founds;
    })
            .fail(function () {
                addElement("<h2>Ups! Somenthing went wrong, try again.</h2>");
            });

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

    var piplAPI = 'http://api.pipl.com/search/v4/' + "?email=" + email + "&key=udbspbnnez3dajrnm4xkrf68" + "&callback=?";
    if (name) {
        piplAPI = updateQueryStringParameter(piplAPI, "first_name", name);
    }
    if (last) {
        piplAPI = updateQueryStringParameter(piplAPI, "last_name", last);
    }

    console.log("Request to: " + piplAPI);


    return getSites(piplAPI).then(function (founds) {
        foundsLength = founds.length;
        console.log("FOUNDED: " + foundsLength);
        $.getJSON('sites.json').then(function (sitesdata) {
            while (foundsLength > 0) {
                foundsLength--;
                var current;
                $.each(sitesdata.domains, function (k, v) {

                    current = founds[foundsLength - 1];
                    console.log(current);
                    if (current === v) {
                        console.log("Match: " + current);
                    }

                });

            }


        });

    });
}

