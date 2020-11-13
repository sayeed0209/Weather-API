// Global variables
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const date = new Date();
$("#dayweek").text(days[date.getDay()]);
$('#date').text(date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear());

$("#search").keydown(function() {
    if(event.keyCode == 13) {
        $(".left__side__footer").slideToggle("fast");
        $("#location").slideToggle("fast");
        // Saving city to the variable to later search for any city user looking for
        let city = $("#search").val();
        // To remove previous value
        $(event.target).val("");
        $.ajax({
            method: "GET",
            // '&units=metric to convert kelvin to celcius
            url: "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=b5f3c03e8773172f10e21c2f6673bc5c",
            success: function(response) {
                // Saving sunrise and sunset hours in hours format, example: 06:09
                let sunrise = ("0"+(new Date((response.sys.sunrise+response.timezone) * 1000)).getUTCHours()).slice(-2)+":"+("0"+(new Date((response.sys.sunrise+response.timezone) * 1000)).getUTCMinutes()).slice(-2);
                let sunset = ("0"+(new Date((response.sys.sunset+response.timezone) * 1000)).getUTCHours()).slice(-2)+":"+("0"+(new Date((response.sys.sunset+response.timezone) * 1000)).getUTCMinutes()).slice(-2);
                // Reset input and last search results
                $("#weather__icon").empty();
                $("#error").text("");
                $("#thermometer").removeClass();
                $('#weather-state').removeClass();
                $("#wind__direction").text("");
                $(".start__search").slideUp("slow");
                $(".left__side").removeClass("left__side__night");
                $(".left__side").removeClass("left__side__rainday");
                // Update search results
                $("#location").text(response.name+", "+response.sys.country);
                $("#weather__icon").append($("<img>").attr("src", "src/"+response.weather[0].icon+".png"));
                $("#temp").text(parseInt(response.main.temp)+"°C");
                $("#description").text(response.weather[0].description);
                $('#wind').next().text(response.wind.speed + ' km/h')
                $('#feelslike').next().text(response.main.feels_like + "°C" );
                $('#tempmin').next().text(response.main.temp_min + "°C" );
                $('#tempmax').next().text(response.main.temp_max + "°C" );
                $('#sunrise').next().text(sunrise);
                $('#sunset').next().text(sunset);
                $('#pressure').next().text(response.main.pressure+ " hPa");
                $('#humidity').next().text(response.main.humidity + '%');
                // Checking if it's day or night by the icon on the server response
                let dayTime = response.weather[0].icon.slice(2,3);
                if (dayTime == "n") {
                    $(".left__side").addClass("left__side__night")
                }
                // Inserts the color range based on the temperature #thermometer)(in this case color is blue)
                if (response.main.temp < 10) {
                    $("#thermometer").addClass("verylow-temperature");
                }
                if (response.main.temp >= 10 && response.main.temp < 20) {
                    $("#thermometer").addClass("low-temperature");
                }
                if (response.main.temp >= 20 && response.main.temp <= 25) {
                    $("#thermometer").addClass("stable-temperature");
                }
                if (response.main.temp > 25 && response.main.temp < 35) {
                    $("#thermometer").addClass("high-temperature");
                }
                if (response.main.temp >= 35) {
                    $("#thermometer").addClass("veryhigh-temperature");
                }
                // Change weather effect based on the weather state on the response
                if(response.weather[0].main == "Rain" || response.weather[0].main == "Drizzle" || response.weather[0].main == "Thunderstorm" ){
                    $("#weather-state").addClass("rain");
                    $(".left__side").addClass("left__side__rainday");
                }
                if (response.weather[0].main == "Snow") {
                    $("#weather-state").addClass("snow");
                }
                if((response.weather[0].main == 'Clear' || response.weather[0].main == 'Clouds') && dayTime == "d") {
                    $('#weather-state').addClass('sunny');
                }
                if((response.weather[0].main == 'Clear' || response.weather[0].main == 'Clouds' || response.weather[0].main == 'Haze' ) && dayTime == "n") {
                    $('#weather-state').addClass('night');
                }
                if(response.weather[0].main == 'Fog' || response.weather[0].main == 'Dust' || response.weather[0].main == 'Smoke' || response.weather[0].main == 'Mist'){
                    $('#weather-state').addClass('fog');
                }
                // Change wind direction arrow
                // north
                if (response.wind.deg >= 350 || response.wind.deg <= 10 ) {
                    $("#wind__direction").text("\uD83E\uDC79").css("animation","north-wind 1s infinite");
                }
                // for south
                if (response.wind.deg >= 170 && response.wind.deg <= 190 ) {
                    $("#wind__direction").text("\uD83E\uDC7B").css("animation","south-wind 1s infinite");
                }
                // for south-west
                if (response.wind.deg > 190 && response.wind.deg < 260 ) {
                    $("#wind__direction").text("\uD83E\uDC7F").css("animation","sw-wind 1s infinite");
                }
                // for west
                if (response.wind.deg >= 260 && response.wind.deg <= 280 ) {
                    $("#wind__direction").text("\uD83E\uDC78").css("animation","west-wind 1s infinite");
                }
                // for north west
                if (response.wind.deg > 280 && response.wind.deg < 350) {
                    $("#wind__direction").text("\uD83E\uDC7C").css("animation","nw-wind 1s infinite");
                }
                // for north east
                if (response.wind.deg > 10 && response.wind.deg < 80) {
                    $("#wind__direction").text("\uD83E\uDC7D").css("animation","ne-wind 1s infinite");
                }
                // for south east
                if (response.wind.deg > 100 && response.wind.deg <170) {
                    $("#wind__direction").text("\uD83E\uDC7E").css("animation","se-wind 1s infinite");
                }
                // for east
                if (response.wind.deg >= 80 && response.wind.deg <= 100) {
                    $("#wind__direction").text("\uD83E\uDC7A").css("animation","east-wind 1s infinite");
                }
                $(".left__side__footer").slideToggle();
                $("#location").slideToggle();
            },
            error: function() {
                $("#error").text("City/Country not found");
                $(".left__side__footer").slideToggle();
                $("#location").slideToggle();
            }
        });
    }
})
