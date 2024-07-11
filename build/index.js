// constants
const _AVERAGE_DAYS_IN_A_MONTH = 30.4167;

// initialise listeners and setup the page
document.addEventListener("DOMContentLoaded", function () {
  const cashInput = document.getElementById("cash");
  const burnRateInput = document.getElementById("burnRate");
  const incomeInput = document.getElementById("income");  

  // initial chart
  plotChart([])

  // get search params
  const { cash, dailySpend, monthlyIncome } = getCurrentUrlParams();

  // set inputs - this needs to be done before attaching the input listeners
  cashInput.value = cash;
  burnRateInput.value = dailySpend;
  incomeInput.value = monthlyIncome;  

  // Event listener on input change
  cashInput.addEventListener("input", updateResults);
  burnRateInput.addEventListener("input", updateResults);
  incomeInput.addEventListener("input", updateResults);
  document.getElementById("feedback-button").addEventListener("click", helpButton)
  document.getElementById("feedback-form").addEventListener("submit", submitFeedback)

  // initialise the results
  updateResults()
});

function updateResults() {
  // selecting elements  
  const resultYears = document.getElementById("result-years");
  const resultMonths = document.getElementById("result-months");
  const resultWeeks = document.getElementById("result-weeks");
  const resultDays = document.getElementById("result-days");
  const resultHours = document.getElementById("result-hours");
  const resultMinutes = document.getElementById("result-minutes");
  const resultSeconds = document.getElementById("result-seconds");
  const burnDate = document.getElementById("burn-date");
  
  // selecting elements  
  const cashInput = document.getElementById("cash");
  const burnRateInput = document.getElementById("burnRate");
  const incomeInput = document.getElementById("income");  
  
  // get the inputs
  const cash = parseFloat(cashInput.value) || 0;
  const dailySpend = parseFloat(burnRateInput.value) || 0;
  const monthlyIncome = parseFloat(incomeInput.value) || 0;

  updateURL(cash, dailySpend, monthlyIncome);

  if (cash > 0) {
    const dailyCashSet = generateDailyCashDataset(cash, dailySpend, monthlyIncome);

    // Calculate time to burn
    const daysToBurn = dailyCashSet.length;

    if ( ( dailySpend * _AVERAGE_DAYS_IN_A_MONTH ) < monthlyIncome ) {
      
      console.log("You aren't going to run out of money.")

      burnDate.innerHTML = '💰 <span class="text-green-600">NEVER</span> 🔥';

      resultYears.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> years`;
      resultMonths.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> months`;
      resultWeeks.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> weeks`;
      resultDays.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> days`;
      resultHours.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> hours`;
      resultMinutes.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> mintes`;
      resultSeconds.innerHTML = `Time to burn: <span class="text-green-600">infinite</span> seconds`;

      destroyChart();

    } else {
      
      if (daysToBurn < 3651) {

       const yearsToBurn = daysToBurn / 365;
       const monthToBurn = yearsToBurn * 12;
       const weeksToBurn = daysToBurn / 7;
       const hoursToBurn = daysToBurn * 24;
       const minutesToBurn = hoursToBurn * 60;
       const secondsToBurn = minutesToBurn * 60;

       // display burn date
       burnDate.innerHTML = `💰 <span class="text-orange-600">${moment(dailyCashSet[daysToBurn - 1].day, 'D-MM-YYYY').format("MMMM Do YYYY")}</span> 🔥`;
          
       // Display time to burn
       resultYears.innerHTML = `Time to burn: <span class="text-green-600">${yearsToBurn.toFixed(1)}</span> years`;
       resultMonths.innerHTML = `Time to burn: <span class="text-green-600">${monthToBurn.toFixed(1)}</span> months`;
       resultWeeks.innerHTML = `Time to burn: <span class="text-green-600">${weeksToBurn.toFixed(1)}</span> weeks`;
       resultDays.innerHTML = `Time to burn: <span class="text-green-600">${daysToBurn.toFixed(1)}</span> days`;
       resultHours.innerHTML = `Time to burn: <span class="text-green-600">${hoursToBurn.toFixed(0)}</span> hours`;
       resultMinutes.innerHTML = `Time to burn: <span class="text-green-600">${minutesToBurn.toFixed(0)}</span> minutes`;
       resultSeconds.innerHTML = `Time to burn: <span class="text-green-600">${secondsToBurn.toFixed(0)}</span> seconds`;
     
     }
     else {  

       burnDate.innerHTML = '💰 <span class="text-green-600">10+ Years of</span> 🔥';
 
       resultYears.innerHTML = `Time to burn: <span class="text-green-600">10+</span> years`;
       resultMonths.innerHTML = `Time to burn: <span class="text-green-600">120+</span> months`;
       resultWeeks.innerHTML = `Time to burn: <span class="text-green-600">520+</span> weeks`;
       resultDays.innerHTML = `Time to burn: <span class="text-green-600">3650+</span> days`;
       resultHours.innerHTML = `Time to burn: <span class="text-green-600">87600+</span> hours`;
       resultMinutes.innerHTML = `Time to burn: <span class="text-green-600">5256000+</span> mintes`;
       resultSeconds.innerHTML = `Time to burn: <span class="text-green-600">315360000+</span> seconds`;

     }

     // Generate graph
     destroyChart();
     plotChart(dailyCashSet);

    }
  } 
}

function generateDailyCashDataset(initialCash, dailySpend, monthlyIncome) {
  // Initialize an array to store the daily cash information
  let dailyCashArray = [];    
  let remainingCash = initialCash;
  let day = 1;
  
  // Loop through each day and calculate the remaining cash until you run out of cash or hit ten years
  while (remainingCash > 0 && day < 3652) {
    remainingCash = Math.max(0, remainingCash - dailySpend);
    let currentDay = moment().add((day), 'days').format('D-MM-YYYY');
    day += 1; // Increment day.
    
    // Add income
    if (currentDay.toString().split('-')[0] === '1') {
      remainingCash = remainingCash + monthlyIncome;
    }

    dailyCashArray.push({ day: currentDay, cash: remainingCash.toFixed(0) })
  }

  return dailyCashArray;
}

function getMonthlyInterestRate() {
  let interest = parseFloat(document.getElementById("interest").value) || 0; // Annual interest
  interest = Math.pow((1 + interest), (1 / 12)) - 1; // Monthly interest.

  interest = interest.toFixed(4);
  return interest;
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
            backgroundColor: "#16a34a",
            borderColor: "#16a34a",
            borderWidth: 1,
          },
        ],
      }
    };

    // Create chart
    window.myChart = new Chart(document.getElementById("graph"), config);
}

function destroyChart() {    
  // Destroy existing chart if it exists
  if (window.myChart) {
    window.myChart.destroy();
  }
}

function removeTime(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function helpButton() {
  const feedbackFormContainer = document.getElementById("feedback-form-container");

  feedbackFormContainer.style.display = "block";
  document.getElementById("feedback-button-container").style.display = "none";
}

function submitFeedback(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  sendFeedback(email, message);

  console.log(`Submitting '${message}' from ${email}`)
  document.getElementById("feedback-form-container").style.display = "none";
  document.getElementById("feedback-button-container").style.display = "block";
}

async function sendFeedback(email, message) {
  const url = `https://e3gczsxoyup4auvpscvnizt7re0xkjgg.lambda-url.us-east-1.on.aws/feedback?email=${email}&message=${message}`;

  try {
    const response = await fetch(url, {
      method: 'POST'
    })

    if (!response.ok) {
      console.error('Sending feedback failed with response: ', response.status, response.message);   
    }

    console.log("Feedback sent.");
  } catch (error) {
    console.error('Sending feedback failed with error: ', error.message);    
  }
}

async function updateURL(cash, dailySpend, monthlyIncome) {
  const currentParams = new URLSearchParams(window.location.search);
  currentParams.set('cash', cash);
  currentParams.set('dailySpend', dailySpend);
  currentParams.set('monthlyIncome', monthlyIncome);

  const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
  window.history.pushState({}, '', newUrl);
}

function getCurrentUrlParams() {
  // Get the current URL parameters
  const urlSearchParams = new URLSearchParams(window.location.search);

  // Create an object to store the parameters
  const params = {};

  // Iterate through the parameters and populate the object
  for (const [key, value] of urlSearchParams.entries()) {
    console.log(key, value);
    params[key] = value;
  }

  return params;
}
