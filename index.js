function calculate() {
    var warehouseMultiplier = parseInt(warehouse.value);
    var runtimeMinutes = parseInt(minutes.value);
    var costPerCredit = parseFloat(cost.value);

    // Set default values to 0 if input values are NaN
    runtimeMinutes = isNaN(runtimeMinutes) ? 0 : runtimeMinutes,
    costPerCredit = isNaN(costPerCredit) ? 0 : costPerCredit;

    var multiplicationResult = warehouseMultiplier * runtimeMinutes / 60 * costPerCredit;

    // Format the result as currency
    var formattedResult = multiplicationResult.toLocaleString('en-US', {style: 'currency', currency: 'USD'});

    result.innerHTML = "The total cost is " + formattedResult;

    // Save current values to cookie
    saveToCookie(warehouseMultiplier, runtimeMinutes, costPerCredit);
}

function saveToCookie(warehouseMultiplier, runtimeMinutes, costPerCredit) {
    // Save current values to cookie with a one-year expiration time
    document.cookie = "warehouseMultiplier=" + warehouseMultiplier + ";expires=" + new Date(Date.now() + 31536000000).toUTCString() + ";path=/";
    document.cookie = "runtimeMinutes=" + runtimeMinutes + ";expires=" + new Date(Date.now() + 31536000000).toUTCString() + ";path=/";
    document.cookie = "costPerCredit=" + costPerCredit + ";expires=" + new Date(Date.now() + 31536000000).toUTCString() + ";path=/";
}

function retrieveFromCookie() {
    // Retrieve saved values from cookie
    var warehouseMultiplier = getCookie("warehouseMultiplier");
    var runtimeMinutes = getCookie("runtimeMinutes");
    var costPerCredit = getCookie("costPerCredit");

    // Set input values to saved values
    warehouse.value = warehouseMultiplier && !isNaN(parseInt(warehouseMultiplier)) ? parseInt(warehouseMultiplier) : 1;
    minutes.value = runtimeMinutes && !isNaN(parseInt(runtimeMinutes)) ? parseInt(runtimeMinutes) : 60;
    cost.value = costPerCredit && !isNaN(parseFloat(costPerCredit )) ? parseFloat(costPerCredit ) : "2.00";

    // Calculate the result with saved values
    calculate();
}

function getCookie(name) {
    // Get cookie value by name
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function showModal() {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }