// @TODO: YOUR CODE HERE!


// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 200,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(acsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
    d3.max(acsData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;
}

function yScale(acsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
    d3.max(acsData, d => d[chosenYAxis]) * 1.2
    ])
    .range([chartHeight, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderTextcircles(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var labelX = `Poverty: `;
    var signX = "%"
  }
  else if (chosenXAxis === "age") {
    var labelX = "Age: ";
    var signX = ""
  }
  else {
    var labelX = "Income: ";
    var signX = "$"
  }

  //if (chosenYAxis === "healthcare") {
    //var labelY = `Healthcare: `;
    //var signY = "%"
  //}
  //else if (chosenYAxis === "smokes") {
    //var labelY = "Smoke: ";
    //var signY = "%"
  //}
  //else {
    //var labelY = "Obesity: ";
    //var signY = "%"
  //}

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      //return (`${d.state}<br>${labelX}: ${d[chosenXAxis]} ${signX}<br>${labelY}: ${d[chosenYAxis]} ${signY}`);
      return (`${d.state}<br>${labelX}: ${d[chosenXAxis]} ${signX}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Load data from hours-of-tv-watched.csv
d3.csv("data.csv").then(function (acsData, error) {

  // Throw an error if one occurs
  if (error) throw error;

  console.log(acsData);

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  acsData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // Configure a time scale with a range between 0 and the chartWidth
  // Set the domain for the xTimeScale function
  // d3.extent returns the an array containing the min and max values for the property specified
  var xLinearScale = xScale(acsData, chosenXAxis);

  // Configure a linear scale with a range between the chartHeight and 0
  // Set the domain for the xLinearScale function
  var yLinearScale = yScale(acsData, chosenYAxis);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // set x to the bottom of the chart
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // set y to the y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  //Create the rectangles using data binding
  //chartGroup.selectAll("circle")
  //.data(acsData)

  var circlesGroup = chartGroup.selectAll("circle")
    .data(acsData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("opacity", "0.5")


  var textGroup = chartGroup
    .selectAll("circles")
    .data(acsData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]) + 3)
    .attr("font-size", "12px")
    .text(d => d.abbr);

  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis

  // Create group for  3 y- axis labels
  var labelsYGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = labelsYGroup.append("text")
    //.attr("transform", `translate(${0-margin.left}, ${(0-chartHeight / 2)}`)
    //.attr("y", 0 - margin.left)
    //.attr("x", 0 - (chartHeight / 2))
    //.classed("axis-text", true)
    .attr("x", 0 - (chartHeight / 2))
    .attr("y", 0 - margin.left)
    .attr("value", "healthcare")
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .classed("active", true)
    .text("Lacks HealthCare (%)");

  var smokeLabel = labelsYGroup.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("x", 0 - (chartHeight / 2))
    .attr("y", 0 - margin.left)
    .attr("value", "smokes")
    .attr("dy", "2em")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityLabel = labelsYGroup.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("x", 0 - (chartHeight / 2))
    .attr("y", 0 - margin.left)
    .attr("value", "obesity")
    .attr("dy", "3em")
    .classed("inactive", true)
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  //var textGroup = renderTextcircles(textGroup, xLinearScale, chosenXaxis);

  // x axis labels event listener


  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var valueX = d3.select(this).attr("value");

      if (valueX !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = valueX;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(acsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        textGroup = renderTextcircles(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
  labelsYGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var valueY = d3.select(this).attr("value");
      
      if (valueY !== chosenYAxis) {

        // replaces chosenXaxis with value
        chosenYAxis = valueY;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(acsData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        textGroup = renderTextcircles(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokeLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function (error) {
  console.log(error);
});

  //var textLabels = text
  //.attr("x", function (d) {
  //return xRange(d.x);
  //})
  //.attr("text-anchor", "middle")
  //.attr("y", function (d) {
  //return yRange(d.y);
  //})
  //.text(function (d) {
  //return "( " + d.abbr + " )";
  //})
  //.attr("font-family", "sans-serif")
  //.attr("font-size", "10px")
  //.attr("fill", "red")
  //.append("text")
  //.attr("text-anchor", "middle")
  //.attr("dx", function(d){return -20})
  //.text(function(d) {
  //return d.abbr

        //console.log(text((d) => d.poverty));

     ///*Create and place the "blocks" containing the circle and the text */  
    //var elemEnter = elem.enter()
    //.append("g")
    //.attr("transform", function(d){return "translate("+d.x+",80)"})
//
///*Create the circle for each block */
//var circle = elemEnter.append("circle")
    //.attr("r", function(d){return d.r} )
    //.attr("stroke","black")
    //.attr("fill", "white")
//
///* Create the text for each block */
//elemEnter.append("text")
    //.attr("dx", function(d){return -20})
    //.text(function(d){return d.label}) 
