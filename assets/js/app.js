// @TODO: YOUR CODE HERE!

// Defining SVG Area
var svgWidth = 825; //window.innerWidth;
var svgHeight = 500; //window.innerHeight;

// Declaring Margin
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Appending SVG to HTML
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Defining Chart Group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing Data
d3.csv("assets/data/data.csv").then(function(stateData){

    // Parsding data as number 
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Creating Scale Functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.poverty) - 1 , d3.max(stateData, d => d.poverty) + 1])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.healthcare) - 1.5, d3.max(stateData, d => d.healthcare) + 3])
        .range([height, 0])

    // Creating Axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending Axes to the chart
    // x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // y-axis
    chartGroup.append("g")
        .call(leftAxis);

    // Creating Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "11")
        .attr("class", "stateCircle");

    //Adding the SVG Text Element to the Chartgroup
    var text = chartGroup.selectAll("text")
                            .data(stateData)
                            .enter()
                            .append("text");

    //Adding SVG Text Element Attributes
    var textLabels = text
        .attr("x", (d => xLinearScale(d.poverty)-7))
        .attr("y", (d => yLinearScale(d.healthcare)+3))
        .text(d => d.abbr)
        .attr("font-size", "9px")
        .attr("fill", "white");

    // Creating Tool-Tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d){
            return (`${d.state}<br>Poverty: ${d.poverty}%<br> Healthcare: ${d.healthcare}%`)
        });

    // Calling tool-tip
    chartGroup.call(toolTip);

    // Creating event listeners to display and hid the tooltip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data)
    }).on("mouseout", function(data){
        toolTip.hide(data)
    });

    // Adding Labels: Y Label placement
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr('x', 0 - (height/2) + 10)
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lack Healthcare (%)")

    // Adding Labels: X Label placement
    chartGroup.append("text")
        .attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 20})`)
        .attr("class", "aText")
        .text("Poverty (%)");

}).catch(function(error){
    console.log(error);
});