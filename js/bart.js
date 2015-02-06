$(document).ready(function () {

    getBart();
});


function getBart() {
    $.ajax({
        type: "GET",
        url: "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=dbrk&dir=s&key=MW9S-E7SL-26DU-VV8V",
        dataType: "xml",
        success: xmlParser
       });
}


function xmlParser(xml) {
    var counter = 0;
    var countStart;
    $(xml).find('etd').each(function()
        {
            if($(this).find('destination').text().indexOf('Millbrae') >= 0) {
                $(this).find('estimate').each(function()
                {
                    if(counter === 0) {
                        var mins = $(this).find('minutes').text();
                        countStart = 60 * (parseInt(mins) ? parseInt(mins): 0);
                        counter++;
                    }
                    if(parseInt($(this).find('minutes').text()) <= 6) {
                        $("#output").append('<p class=times style=color:red>' +
                                            $(this).find("minutes").text() + ' minutes' + "</p>");
                    } else if (parseInt($(this).find('minutes').text()) <= 15) {
                        $("#output").append('<p class=times style=color:yellow>' +
                                            $(this).find("minutes").text() + ' minutes' + "</p>");
                    } else if (parseInt($(this).find('minutes').text()) > 15){
                        $("#output").append('<p class=times style=color:green>' +
                                            $(this).find("minutes").text() + ' minutes' + "</p>");
                    } else {
                        $("#output").append('<p class=times style=color:red>' +
                                            $(this).find("minutes").text() + "</p>");
                    }
                });
            var sI;
            countDown(countStart);

            }
    });
    setTimeout(function() {

        $("#time").empty();
        $("#output").empty();
        window.clearInterval(sI);
        getBart();}, 30000); //update data every 30 seconds
}

function countDown(countStart) {
        var display = $('#time'),
            mins, seconds;
        sI = setInterval(function() {
            mins = parseInt(countStart / 60);
            seconds = parseInt(countStart % 60);
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            display.text(mins + ":" + seconds);
            countStart--;
        }, 1000);
    }
