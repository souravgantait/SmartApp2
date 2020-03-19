FHIR.oauth2.ready(getA1Cdata, showError);
function getA1Cdata(smart) {
  
   ////////////////
  //render current patient
  smart.patient.read().then(
    function(pt) {
      // var patientInfo = [];
      var given = pt.name[0].given[0];
      var family = pt.name[0].family;
      var birthDate = pt.birthDate;
      var addressLine = pt.address[0].line[0];
      var table = document.getElementById("patientInfoTable");

      var header = table.createTHead();
      var header_row = header.insertRow(0);
      var header_cell1 = header_row.insertCell(0);
      var header_cell2 = header_row.insertCell(1);
      var header_cell3 = header_row.insertCell(2);
      var header_cell4 = header_row.insertCell(3);
      header_cell1.innerHTML = "<b>Name</b>";
      header_cell2.innerHTML = "<b>Family Name</b>";
      header_cell3.innerHTML = "<b>Birth Date</b>";
      header_cell4.innerHTML = "<b>Address Line</b>";

      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      cell1.innerHTML = given;
      cell2.innerHTML = family;
      cell3.innerHTML = birthDate;
      cell4.innerHTML = addressLine;

      // patientInfo.push(pt.name[0].given[0]);
      // patientInfo.push(pt.name[0].family);
      // patientInfo.push(pt.birthDate);
      // patientInfo.push(pt.address[0].line[0]);
      // document.getElementById(
      //   "patientInfoDetail"
      // ).innerText = JSON.stringify(patientInfo, null, 4);
    },
    function(error) {
      document.getElementById("patientFN").innerText = error.stack;
    }
  );

  #generetedjs#
}

///////
// }
////
function showError(error) {
  var statusDivC = document.getElementById("statusC");
  return (statusDivC.innerHTML = "An error occurred connecting to the EHR");
}

function displayBarChart(container)
{
  var loincCode = "29463-7";
  var maxCount = 10;
  var graphType = "bar";
  var chartTitle = "Observation-Vital Sign (Weight)";
  smart.patient.api
    .search({
      type: "Observation",
      query: {
        code: [loincCode],
        "_sort:desc": "date",
        _count: [maxCount]
      }
    })
    .then(function(fhirObservations) {
        var procedureInfoChart = document.getElementById(container);
var procedureInfoChartDiv = document.createElement("div");
procedureInfoChart.append(procedureInfoChartDiv);
var statusHeading = document.createElement("h1");
statusHeading.setAttribute("id", "status");

procedureInfoChartDiv.appendChild(statusHeading);
var chartDiv = document.createElement("div");
chartDiv.setAttribute("id", "chart");
chartDiv.setAttribute("style", "width:600px;height:400px");
procedureInfoChartDiv.appendChild(chartDiv);
var statusDivC = document.getElementById("status");
var chartDivC = document.getElementById("chart");
      var dates = [];
      var values = [];

      (fhirObservations.data.entry || []).forEach(function(a1c) {
        var date = a1c.resource.effectiveDateTime;
        var value =
          a1c.resource.valueQuantity && a1c.resource.valueQuantity.value;
        if (date && value && dates.indexOf(date) == -1) {
          dates.push(date);
          values.push(Math.round(value * 10) / 10);
        }
      });

      if (values.length === 0)
        return (statusDivC.innerHTML = "No observations found.");

       statusDivC.setAttribute("style", "display: none");

      Plotly.newPlot(chartDiv, {
        data: [
          {
            x: dates,
            y: values,
            type: graphType
          }
        ],
        layout: {
          title: chartTitle,
          xaxis: { type: "date", tickformat: "%b %y" },
          yaxis: { range: [0, 100] }
        },
        config: {
          displayModeBar: false
        }
      });
    });

}

function displayLine(container){

  /////////////
  smart.patient.api
    .search({
      type: "Observation",
      query: {
        code: "38483-4",
        "_sort:desc": "date",
        _count: 10
      }
    })
    .then(function(fhirObservations) {
    var medInfoChart = document.getElementById("container");
var medInfoChartDiv = document.createElement("div");
medInfoChart.append(medInfoChartDiv);
var statusCHeading = document.createElement("h1");
statusCHeading.setAttribute("id", "statusC");
medInfoChartDiv.appendChild(statusCHeading);
var chartCDiv = document.createElement("div");
chartCDiv.setAttribute("id", "chartC");
chartCDiv.setAttribute("style", "width:600px;height:400px;");
medInfoChartDiv.appendChild(chartCDiv);

var statusDivC = document.getElementById("statusC");
var chartDivC = document.getElementById("chartC");

      var dates = [];
      var values = [];

      (fhirObservations.data.entry || []).forEach(function(a1c) {
        var date = a1c.resource.effectiveDateTime;
        var value =
          a1c.resource.valueQuantity && a1c.resource.valueQuantity.value;
        if (date && value && dates.indexOf(date) == -1) {
          dates.push(date);
          values.push(Math.round(value * 10) / 10);
        }
      });

      if (values.length === 0)
        return (statusDivC.innerHTML = "No Cretanine observations found.");

      statusDivC.style.display = "none";

      Plotly.newPlot(chartDivC, {
        data: [
          {
            x: dates,
            y: values,
            type: "scatter"
          }
        ],
        layout: {
          title: "Observation-LabResult (Creatinine Level)",
          xaxis: { type: "date", tickformat: "%b %y" },
          yaxis: { range: [0, 10] }
        },
        config: {
          displayModeBar: false
        }
      });
    });
}

function displayTable(container){

  // get medication information
  smart.patient.api
    .search({
      type: "MedicationRequest", //MedicationRequest   in SMART app  , MedicationStatement in Cerner app
      query: {
        "_sort:desc": "date",
        _count: 10
      }
    })
    .then(function(fhirmed) {
      var values = [];
      var arrStatus = [];
      var intents = [];

      (fhirmed.data.entry || []).forEach(function(med) {
        var value = med.resource.medicationCodeableConcept.text;
        var status = med.resource.status;
        var intent = med.resource.intent;
        values.push(value);
        arrStatus.push(status);
        intents.push(intent);
      });
      var count = 1;
      // var valuesStringify = JSON.stringify(values, null, 4);

      var medInfoTable = document.getElementById("container");
      var medInfoTableDiv = document.createElement("div");
      medInfoTable.appendChild(medInfoTableDiv);
      var medInfoHeading = document.createElement("h4");
      medInfoHeading.setAttribute("class", "row");
      medInfoHeading.setAttribute("style", "padding-left:30px");
      medInfoHeading.textContent = "Medication Information: ";
      medInfoTableDiv.appendChild(medInfoHeading);

      var innerDiv = document.createElement("div");
      innerDiv.setAttribute("id", "medicationInformationTable");
      innerDiv.setAttribute("class", "row");
      innerDiv.setAttribute("style", "padding-left:30px");
      medInfoTable.appendChild(innerDiv);
      var table = document.createElement("table");
      var row1 = table.insertRow(-1);
      var header = table.createTHead();
      var header_row = header.insertRow(0);
      var header_cell1 = header_row.insertCell(0);
      var header_cell2 = header_row.insertCell(1);
      var header_cell3 = header_row.insertCell(2);
      var header_cell4 = header_row.insertCell(3);
      header_cell1.innerHTML = "<b>SL No.</b>";
      header_cell2.innerHTML = "<b>Text</b>";
      header_cell3.innerHTML = "<b>Status</b>";
      header_cell4.innerHTML = "<b>Intent</b>";

      for (var i = 0; i < values.length; i++) {
        var row = table.insertRow(-1);
        var firstCell = row.insertCell(-1);
        firstCell.appendChild(document.createTextNode(count));
        count++;
        var secondCell = row.insertCell(-1);
        secondCell.appendChild(document.createTextNode(values[i]));
        var thirdCell = row.insertCell(-1);
        thirdCell.appendChild(document.createTextNode(arrStatus[i]));
        var fourthCell = row.insertCell(-1);
        fourthCell.appendChild(document.createTextNode(intents[i]));
      }
      document.getElementById("medicationInformationTable").appendChild(table);

      // document.getElementById(
      //   "medicationInfo"
      // ).innerText = JSON.stringify(resource, null, 4);
    });



}

function displayTreeView(container){
  smart.patient.api
    .search({
      type: "MedicationRequest", //MedicationRequest   in SMART app  , MedicationStatement in Cerner app
      query: {
        "_sort:desc": "date",
        _count: 10
      }
    })
    .then(function(fhirmed) {

      //var treeViewDiv = document.getElementById("container");
      var ulElement = document.createElement("ul");
      container.appendChild(ulElement);

      (fhirmed.data.entry || []).forEach(function(med) {
        var value = med.resource.medicationCodeableConcept.text;
        var status = med.resource.status;
        var intent = med.resource.intent;
        var liElement = document.createElement("li");
        ulElement.appendChild(liElement);
        var liSpan = document.createElement("span");
        liSpan.setAttribute("class", "caret");
        liSpan.textContent = value;
        liSpan.addEventListener("click", function() {
          this.parentElement
            .querySelector(".nested")
            .classList.toggle("active");
          this.classList.toggle("caret-down");
        });

        liElement.appendChild(liSpan);

        var nestedUlElement = document.createElement("ul");
        nestedUlElement.setAttribute("class", "nested");
        liElement.appendChild(nestedUlElement);

        var statusLi = document.createElement("li");
        var intentLi = document.createElement("li");
        var statusText = document.createTextNode(status);
        var intentText = document.createTextNode(intent);
        nestedUlElement.appendChild(statusLi);
        nestedUlElement.appendChild(intentLi);
        var statustextnode = document.createTextNode("Status: ");
        statusLi.appendChild(statustextnode);
        statusLi.appendChild(statusText);
        var intenttextnode = document.createTextNode("Intent: ");
        intentLi.appendChild(intenttextnode);
        intentLi.appendChild(intentText);
      })

      })
    }