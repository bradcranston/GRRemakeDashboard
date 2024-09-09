
import {processGasketData} from "./functions.js"
import {summarizeDataUser, summarizeDataProfile} from "./summarizeData.js"
import {createTable} from "./datatables.js"

const data = {};
data.lines = [];
data.users = [];

window.loadLines= (json) => {
    const array1 = data.lines;
    const array2 = JSON.parse(json);
    const merged = [...array1, ...array2];
    data.lines = merged;
};

window.loadUsers= (json) => {
    data.users = JSON.parse(json);
};


window.loadDash = () => {
const lines = data.lines;
const users = data.users;


const now = new Date();
const currentYear = now.getFullYear();
const firstDayOfYear = new Date(currentYear, 0, 1);
const lastDayOfYear = new Date(currentYear, 11, 31); 
const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth - 1);
const firstDayOfPreviousMonth = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1);


const divA1 = document.getElementById('A1');
const divA1Numbers = processGasketData(firstDayOfYear,lastDayOfYear,lines)
const divA1Text = 'Gaskets Made: ' + divA1Numbers.gasketsMadeTotal + '<br>Gaskets Remakes: ' + divA1Numbers.gasketsRemadeTotal + '<br>Remake Percentage: ' + (divA1Numbers.remakePercent).toFixed(2) + '%' + '<br>Remake Shipping Charges: ' + divA1Numbers.shipCost
divA1.innerHTML = divA1Text;


const divB1 = document.getElementById('B1');
const divB1Numbers = processGasketData(firstDayOfPreviousMonth,lastDayOfPreviousMonth,lines)
const divB1Text = 'Gaskets Made: ' + divB1Numbers.gasketsMadeTotal + '<br>Gaskets Remakes: ' + divB1Numbers.gasketsRemadeTotal + '<br>Remake Percentage: ' + (divB1Numbers.remakePercent).toFixed(2) + '%' + '<br>Remake Shipping Charges: ' + divB1Numbers.shipCost
divB1.innerHTML = divB1Text;

const startInput = document.getElementById('start-date');
const endInput = document.getElementById('end-date');
startInput.addEventListener('input', handleInput);
endInput.addEventListener('input', handleInput);

function handleInput() {

  const startDate = parseDate(startInput.value);
  const endDate = parseDate(endInput.value);

  startDate.setHours(startDate.getHours() + 4);
  endDate.setHours(endDate.getHours() + 4);

    const divC1 = document.getElementById('C1');
    const divC1Numbers = processGasketData(startDate,endDate,lines)
    const divC1Text = 'Gaskets Made: ' + divC1Numbers.gasketsMadeTotal + '<br>Gaskets Remakes: ' + divC1Numbers.gasketsRemadeTotal + '<br>Remake Percentage: ' + (divC1Numbers.remakePercent).toFixed(2) + '%' + '<br>Remake Shipping Charges: ' + divC1Numbers.shipCost
    divC1.innerHTML = divC1Text;
    //console.log(startInput.value);
    const tableC2 = $('#tableC2').DataTable();
    tableC2.clear();
    tableC2.rows.add(summarizeDataUser(startDate,endDate, lines, users));
    tableC2.draw();
    const tableC3 = $('#tableC3').DataTable();
    tableC3.clear();
    tableC3.rows.add(summarizeDataProfile(startDate,endDate, lines, users));
    tableC3.draw();
//console.log(endInput.value)

};


let columns = [
    {
      title: "Name",
    },
    {
      title: "Percent",
    },
    {
      title: "Remakes",
    }];

createTable("#tableA2",columns,summarizeDataUser(firstDayOfYear, lastDayOfYear, lines, users));
createTable("#tableB2",columns,summarizeDataUser(firstDayOfPreviousMonth, lastDayOfPreviousMonth, lines, users));
createTable("#tableC2",columns,summarizeDataUser(startInput.value,endInput.value, lines, users));

columns = [
    {
      title: "Profile",
    },
    {
      title: "Percent",
    },
    {
      title: "Remakes",
    }];

createTable("#tableA3",columns,summarizeDataProfile(firstDayOfYear, lastDayOfYear, lines, users));
createTable("#tableB3",columns,summarizeDataProfile(firstDayOfPreviousMonth, lastDayOfPreviousMonth, lines, users));
createTable("#tableC3",columns,summarizeDataProfile(startInput.value,endInput.value, lines, users));

//console.log({'start':firstDayOfPreviousMonth,'end':lastDayOfPreviousMonth});
//console.log({'end':lastDayOfPreviousMonth});
//console.log(firstDayOfYear, lastDayOfYear);
//console.log(lines);
    // Helper function to parse dates
    function parseDate(dateStr) {
        return new Date(dateStr);
    }

};