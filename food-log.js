const apiKey = "PPZaLIjNkv3RxMDe5YUDrBG7Tt7VdpUOlXHCGxnk"
const searchUrlBase = "https://api.nal.usda.gov/ndb/search/?format=json&"

$("#submit").click((clickEvt) => {
    clickEvt.preventDefault();
    let food = $("#food-entry").val()

    $.ajax({
        url: searchUrlBase + "&q=" + food + "&api_key=" + apiKey,
        method: "GET"
    }).then((foodListResponse) => {
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
            $("tbody").append(newRow)
        }
        $(".food-elem").hover(
            (hoverEvt) => {
                $(hoverEvt.target).attr("class", "food-elem text-blue")
            },
            (hoverEvt) => {
                $(hoverEvt.target).attr("class", "food-elem")
            }
        )
    })

})