// JavaScript for calculating time and generating graph
document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements
  const cashInput = document.getElementById("cash");
  const burnRateInput = document.getElementById("burnRate");
  const incomeInput = document.getElementById("income");
  const resultYears = document.getElementById("result-years");
  const resultWeeks = document.getElementById("result-weeks");
  const resultDays = document.getElementById("result-days");
  const resultHours = document.getElementById("result-hours");
  const resultMinutes = document.getElementById("result-minutes");
  const resultSeconds = document.getElementById("result-seconds");
  const graphCanvas = document.getElementById("graph");

  // Event listener on input change
  cashInput.addEventListener("input", updateResults);
  burnRateInput.addEventListener("input", updateResults);
  incomeInput.addEventListener("input", updateResults);

  // initial chart
  plotChart([])

  // initial results
  updateResults();

  function updateResults() {
    const cash = parseFloat(cashInput.value) || 0;
    const dailySpend = parseFloat(burnRateInput.value) || 0;
    const weeklyIncome = parseFloat(incomeInput.value) || 0;

    if (cash > 0) {
      const dailyBurn = ( dailySpend - ( weeklyIncome / 7 ) );

      // Calculate time to burn
      const yearsToBurn = cash / ( ( dailySpend * 365 ) - ( weeklyIncome * 52.1429 ) );
      const weeksToBurn = cash / ( dailyBurn * 7 );
      const daysToBurn = cash / dailyBurn;
      const hoursToBurn = daysToBurn * 24;
      const minutesToBurn = hoursToBurn * 60;
      const secondsToBurn = minutesToBurn * 60;
        
      if (dailyBurn > 0) {    
        // Display time to burn
        resultYears.innerHTML = `Time to Burn: <span class="text-green-600">${yearsToBurn.toFixed(1)}</span> years`;
        resultWeeks.innerHTML = `Time to Burn: <span class="text-green-600">${weeksToBurn.toFixed(1)}</span> weeks`;
        resultDays.innerHTML = `Time to Burn: <span class="text-green-600">${daysToBurn.toFixed(1)}</span> days`;
        resultHours.innerHTML = `Time to Burn: <span class="text-green-600">${hoursToBurn.toFixed(0)}</span> hours`;
        resultMinutes.innerHTML = `Time to Burn: <span class="text-green-600">${minutesToBurn.toFixed(0)}</span> mintes`;
        resultSeconds.innerHTML = `Time to Burn: <span class="text-green-600">${secondsToBurn.toFixed(0)}</span> seconds`;
      } else {
        resultYears.innerHTML = `Time to Burn: <span class="text-green-600">Infinity</span> years`;
        resultWeeks.innerHTML = `Time to Burn: <span class="text-green-600">Infinity</span> weeks`;
        resultDays.innerHTML = `Time to Burn: <span class="text-green-600">Infinity</span> days`;
        resultHours.innerHTML = `Time to Burn: <span class="text-green-600">Infinity</span> hours`;
        resultMinutes.innerHTML = `Time to Burn: <span class="text-green-600">Infinity</span> mintes`;
        resultSeconds.innerHTML = `Time to Burn: <span class="text-green-600">Infinity</span> seconds`;
      }

      destroyChart();
    
      // Generate graph
      if (daysToBurn > 0 && cash > 0 && dailyBurn > 0 && yearsToBurn < 20) {
        console.log("Days to burn: ", daysToBurn);
        generateGraph(daysToBurn, cash, dailyBurn);
      }
    }
  }

  function generateGraph(daysToBurn, initialCash, burnRate) {
    // Initialize an array to store the daily cash information
    let dailyCashArray = [];    
    let days = Array.from({ length: Math.ceil(daysToBurn) }, (_, i) => i + 1);
    
    // if (days.length < 365) {

    // } else if (days.length < 1095) {

    // } else if (days.length < 3650) {

    // } else {

    // }
    
    // Loop through each day and calculate the remaining cash
    days.forEach(day => {
        const remainingCash = Math.max(0, initialCash - day * burnRate); // Ensure cash doesn't go below 0
        // let currentDay = removeTime();
        // currentDay.setDate( currentDay.getDate() + ( day - 1 ));
        let currentDay = moment().add((day-1), 'days').format('D-MM-YYYY');

        if (day < 5) {
          console.log(currentDay)
        }

        dailyCashArray.push({ day: currentDay, cash: remainingCash.toFixed(0) });
    });

    console.log(dailyCashArray)

    plotChart(dailyCashArray);
  }

  function plotChart(data) {
    // Chart.js configuration
    const config = {
        type: "line",
        data: {
          labels: data.map(row => row.day),
          datasets: [
            {
              label: "Runway",
              data: data.map(row => row.cash),
              backgroundColor: "#ea580c",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        }
      };
  
      // Create chart
      window.myChart = new Chart(graphCanvas, config);
  }

  function destroyChart() {    
    // Destroy existing chart if it exists
    if (window.myChart) {
      window.myChart.destroy();
    }
  }
});

function removeTime(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}