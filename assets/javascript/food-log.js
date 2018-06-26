// API access constants
const apiKey = "PPZaLIjNkv3RxMDe5YUDrBG7Tt7VdpUOlXHCGxnk"
const searchUrlBase = "https://api.nal.usda.gov/ndb/search/?format=json&"
const foodReportUrlBase = "https://api.nal.usda.gov/ndb/V2/reports?ndbno="

// Nutrient ids
const caloriesID = 208
const proteinID = 203
const fatID = 204
const carbID = 205
const sugarID = 269

// Nutrient array
const loggedNutrients = [caloriesID, proteinID, fatID, carbID, sugarID]

$("#submit").click((clickEvt) => {
    clickEvt.preventDefault();
    let food = $("#food-entry").val()

    $.ajax({
        url: searchUrlBase + "&q=" + food + "&api_key=" + apiKey,
        method: "GET"
    }).then((foodListResponse) => {
        $("#search-tbl").empty()
        let foodList = foodListResponse.list.item;
        for (var i = foodListResponse.list.start; i < foodListResponse.list.end; ++i) {
            let newRow = $("<tr>")
            let newFood = $("<td>")
                .attr("scope", "row")
                .attr("class", "food-elem")
                .attr("ndbno", foodList[i].ndbno)
                .text(foodList[i].name)
            let newManu = $("<td>")
                .text(foodList[i].manu)
            newRow.append(newFood)
            newRow.append(newManu)
            $("#search-tbl").append(newRow)
        }

        $(".food-elem").click( (clickEvt) => {
            let ndbnoKey = $(clickEvt.target).attr("ndbno")

            $.ajax({
                url: foodReportUrlBase + ndbnoKey + "&api_key=" + apiKey,
                method: "GET"
            }).then( (foodDbResponse) => {
                console.log(foodDbResponse)
                let nutrients = foodDbResponse.foods[0].food.nutrients
                console.log(nutrients)
                quantityDiv = $("#quantity")
                quantityDiv.append($("<h3>").text("Enter Quantity:"))
                quantityDiv.append($("<p>").text(foodDbResponse.foods[0].food.desc.name))
                quantityDiv.append($("<input>") 
                    .attr("id", "qty")    
                    .attr("type", "text")
                    .attr("size", "5")
                    .attr("class", "d-inline"))
                quantityDiv.append($("<p>").text(nutrients[0].measures[0].label)
                    .attr("class", "d-inline"))
                quantityDiv.append($("<button>").text("OK")
                    .attr("class", "d-inline")
                    .attr("id", "okBtn"))
                window.scrollTo(0,0)
                $("#okBtn").click( (okEvt) => {
                    okEvt.preventDefault()
                    let newRow = $("<tr>")
                    let name = $("<td>").text(foodDbResponse.foods[0].food.desc.name)
                    newRow.append(name)
                    let quantity = $("#qty").val()
                    let quantityStr = quantity + " " + nutrients[0].measures[0].label
                    let quantityDiv = $("<td>").text(quantityStr)
                    newRow.append(quantityDiv)
                    for (let i = 0; i < loggedNutrients.length; ++i) {
                        for (let j = 0; j < nutrients.length; ++j) {
                            if (nutrients[j].nutrient_id == loggedNutrients[i]) {
                                nutrientVal = quantity * nutrients[j].measures[0].value
                                newRow.append($("<td>").text(nutrientVal + " " + nutrients[j].unit))
                            }
                        }
                    }
                    $("#log-tbl").append(newRow)
                    $("#quantity").empty()
                })
            })
        })
    })

})