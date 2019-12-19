<p align="center">
  <img src="Screenshots/jumbotron.png">
  <img src="Screenshots/chart.png">
  <img src="Screenshots/data_journalism.gif">
</p>

The Data-Journalism project is to create nine different scatter plots within the same chart, using d3 to cross data from health risks and particular demographics in US states.<br>
The data set included is based on 2014 ACS 1-year estimates and includes data as:
- On X-axis, rates of:
1) Poverty
2) Age
3) Income

- On Y-axis:
1) Obesity
2) Smokes
3) Healthcare

MOE stands for "margin of error."
The data are pulled from a csv file using the d3.csv function.
```js
d3.csv("data.csv").then(function (acsData, error) {
```



The labels have click events so the user can decide which data to display. The transitions are animated for the circles' locations as well as the range of the axes and states abbreviations are included in the circles.

Using the d3-tip.js plugin developed by [Justin Palmer](https://github.com/Caged), tooltips have been added to the circles to be displayed with the data that the user has selected.
```js
 // Define toolTip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>${labelX}: ${d[chosenXAxis]} ${signX}<br>${labelY}: ${d[chosenYAxis]} ${signY}`);
      });

    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function (data) {
      toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
```

