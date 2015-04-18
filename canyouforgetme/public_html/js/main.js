var PIPL_API="http://api.pipl.com/search/v4/";

//simple GET request
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

//Add elements to page
function addElement() {
    var $newdiv1 = $("<div class='jumbotron' <p> Test </p></div>");
    $("#results").append($newdiv1);
    return true;
}

//Check and submit
function checkAndSubmit (event) {
            var email = document.getElementById ("inputEmail");
            if (email.value.length < 1) {
                return false;
            }

            addElement();
            
            event.preventDefault();
            return true;
        }

