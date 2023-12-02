// JavaScript for calculating time and generating graph
document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements
  const cashInput = document.getElementById("cash");
  const burnRateInput = document.getElementById("burnRate");
  const resultYears = document.getElementById("result-years");
  //   const resultMonths = document.getElementById("result-months");
  const resultWeeks = document.getElementById("result-weeks");
  const resultDays = document.getElementById("result-days");
  const resultHours = document.getElementById("result-hours");
  const resultMinutes = document.getElementById("result-minutes");
  const resultSeconds = document.getElementById("result-seconds");
  const graphCanvas = document.getElementById("graph");

  // initialise the chart
  plotChart([])

  // Event listener on input change
  cashInput.addEventListener("input", updateResults);
  burnRateInput.addEventListener("input", updateResults);

  // Initial results and graph update
  updateResults();

  function updateResults() {
    const cash = parseFloat(cashInput.value) || 0;
    const burnRate = parseFloat(burnRateInput.value) || 0;

    if (cash > 0) {
        // Calculate time to burn
        const yearsToBurn = cash / ( burnRate * 365 );
        // const monthsToBurn = cash / burnRate;
        const weeksToBurn = cash / ( burnRate * 7 );
        const daysToBurn = cash / burnRate;
        const hoursToBurn = cash / ( burnRate / 24 );
        const minutesToBurn = hoursToBurn * 60;
        const secondsToBurn = minutesToBurn * 60;
    
        // Display time to burn
        resultYears.innerHTML = `Time to Burn: <span class="text-green-600">${yearsToBurn.toFixed(1)}</span> years`;
        // resultMonths.textContent = `Time to Burn: ${monthsToBurn.toFixed(1)} months`;
        resultWeeks.innerHTML = `Time to Burn: <span class="text-green-600">${weeksToBurn.toFixed(1)}</span> weeks`;
        resultDays.innerHTML = `Time to Burn: <span class="text-green-600">${daysToBurn.toFixed(1)}</span> days`;
        resultHours.innerHTML = `Time to Burn: <span class="text-green-600">${hoursToBurn.toFixed(0)}</span> hours`;
        resultMinutes.innerHTML = `Time to Burn: <span class="text-green-600">${minutesToBurn.toFixed(0)}</span> mintes`;
        resultSeconds.innerHTML = `Time to Burn: <span class="text-green-600">${secondsToBurn.toFixed(0)}</span> seconds`;
    
        // Generate graph
        if (daysToBurn > 0 && cash > 0) {
            generateGraph(daysToBurn, cash, burnRate);
        }
    }
  }

  function generateGraph(timeToBurn, initialCash, burnRate) {
    // Destroy existing chart if it exists
    if (window.myChart) {
      window.myChart.destroy();
    }

    // Initialize an array to store the daily cash information
    let dailyCashArray = [];    
    let days = Array.from({ length: Math.ceil(timeToBurn) }, (_, i) => i + 1);
    
    // Loop through each day and calculate the remaining cash
    days.forEach(day => {
        // if (day === 1) {
        //     console.log(initialCash, day, burnRate, (day * burnRate), (initialCash - day * burnRate))
        // }

        const remainingCash = Math.max(0, initialCash - day * burnRate); // Ensure cash doesn't go below 0
        dailyCashArray.push({ day, cash: remainingCash });
    });
    
    // Display the array of objects
    console.log(dailyCashArray);

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
              label: "Cash/Runway Remaining",
              data: data.map(row => row.cash),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "linear",
              position: "bottom",
            },
            y: {
              min: 0,
            },
          },
        },
      };
  
      // Create chart
      window.myChart = new Chart(graphCanvas, config);
  }
});
