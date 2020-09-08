// @TODO: YOUR CODE HERE!

// Defining SVG Area
var svgWidth = 825; //window.innerWidth;
var svgHeight = 500; //window.innerHeight;

// Declaring Margin
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

// defining width of plot
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Appending SVG to HTML
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Defining Chart Group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Adding Labels: Y Label placement: Lack Healthcare
var ylabels = chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr('x', 0 - (height/2) + 10)
.attr("dy", "1em")
.attr("class", "aText")
.attr("class", "active")
.attr("id", "healthcare")
.text("Lack Healthcare (%)")
.on("click", yhandleClick);

// Adding Labels: Y Label placement: Smokes
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 20)
.attr('x', 0 - (height/2) + 10)
.attr("dy", "1em")
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "smokes")
.text("Smokes (%)")
.on("click", yhandleClick);

// Adding Labels: Y Label placement: Obese
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr('x', 0 - (height/2) + 10)
.attr("dy", "1em")
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "obesity")
.text("Obese (%)")
.on("click", yhandleClick);

// Adding Labels: X Label placement: Poverty
var xlabels = chartGroup.append("text")
.attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 20})`)
.attr("class", "aText")
.attr("class", "active")
.attr("id", "poverty")
.text("Poverty (%)")
.on("click", xhandleClick);;

// Adding Labels: X Label placement: Age Median
chartGroup.append("text")
.attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 40})`)
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "age")
.text("Age (Median)")
.on("click", xhandleClick);;

// Adding Labels: X Label placement House Hold Income Median
chartGroup.append("text")
.attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 60})`)
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "income")
.text("Household Income (Median)")
.on("click", xhandleClick);

// Initalizing first graph
var xInput = "poverty"
var yInput = "healthcare"
plotScatter(xInput, yInput);

// Setting global old data variables for transition position
var oldxInput = xInput
var oldyInput = yInput

// Adding functions to store xInput Value and yInput value for graph
function xhandleClick(){
    xInput = d3.event.target.id;
    xlabels.classed("inactive", true).classed("active", false)
    var selection = d3.select(this)
    selection.classed("inactive", false).classed("active", true);
    plotScatter(xInput, yInput);
    xlabels = selection
    return xInput
};
function yhandleClick(){
    yInput = d3.event.target.id;
    ylabels.classed("inactive", true).classed("active", false)
    var selection = d3.select(this)
    selection.classed("inactive", false).classed("active", true);
    plotScatter(xInput, yInput);
    ylabels = selection
    return yInput
};

function plotScatter(xInput, yInput){

    // Importing Data
    d3.csv("assets/data/data.csv").then(function(stateData){

        // removing circles, text and axis to be plotted a fresh
        d3.selectAll(".stateText").remove();
        d3.selectAll("circle").remove();
        d3.selectAll("#axis").remove();

        //Parsding data as number 
        stateData.forEach(function(data){
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.income = +data.income;
            data.age = +data.age;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
        });

        // Creating Scale Functions for old and new inputs
        var oldxLinearScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d[oldxInput] - (d[oldxInput]/20)), d3.max(stateData, d => d[oldxInput] + (d[oldxInput]/90))])
            .range([0, width]);
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d[xInput] - (d[xInput]/20)), d3.max(stateData, d => d[xInput] + (d[xInput]/90))])
            .range([0, width]);
        var oldyLinearScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d[oldyInput]) - 1.5, d3.max(stateData, d => d[oldyInput]) + 3])
            .range([height, 0])
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d[yInput]) - 1.5, d3.max(stateData, d => d[yInput]) + 3])
            .range([height, 0])

        // Creating Old Axis function for transition
        var oldbottomAxis = d3.axisBottom(oldxLinearScale);
        var oldleftAxis = d3.axisLeft(oldyLinearScale);

        // Creating New Axis
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Appending Axes to the chart
        // x-axis
        chartGroup.append("g")
            .attr("id", "axis")
            .attr("transform", `translate(0, ${height})`)
            .call(oldbottomAxis)
            .transition()
            .duration(1000)
            .call(bottomAxis);
        // y-axis
        chartGroup.append("g")
            .attr("id", "axis")
            .call(oldleftAxis)
            .transition()
            .duration(1000)
            .call(leftAxis);

        // Creating Circles
        var circlesGroup = chartGroup.selectAll("circle")
                        .data(stateData)
                        .enter()
                        .append("circle")
                        .attr("r", 11)
                        .attr("class", "stateCircle")
                        .attr("cx", (d => xLinearScale(d[oldxInput])))
                        .attr("cy", (d => yLinearScale(d[oldyInput])));
             
        // Adding transition to circles from old data to new data
        circlesGroup.transition()
                    .duration(1000)
                    .attr("cx", d => xLinearScale(d[xInput]))
                    .attr("cy", d => yLinearScale(d[yInput]));
            

        //Adding the SVG Text Element to the Chartgroup
        var circleText = chartGroup.selectAll()
                        .data(stateData)
                        .enter()
                        .append("text")
                        .text(d => d.abbr)
                        .attr("class", "stateText")
                        .attr("text-anchor", "middle")
                        .attr("x", (d => xLinearScale(d[oldxInput])))
                        .attr("y", (d => yLinearScale(d[oldyInput])+3));

        // adding transition to state labels from old to new
        circleText.transition()
            .duration(1000)
            .attr("x", (d => xLinearScale(d[xInput])))
            .attr("y", (d => yLinearScale(d[yInput])+3));
                        
        // Updating varialbles to hold position of old data for transition
        oldxInput = xInput;
        oldyInput = yInput;
        oldxScale = xLinearScale;
        oldyScale = yLinearScale;

        // Creating variables for tooltip descriptions based on selected item
        if (xInput === "poverty"){
            var xToolKit = "Poverty";
            }else if (xInput === "age"){
            var xToolKit = "Age (Median)";
            }else var xToolKit = "Household Income (Median)";
             
        if (yInput === "healthcare"){
            var yToolKit = "Lack Healthcare";
            }else if (yInput === "smokes"){
            var yToolKit = "Smokes";
            }else var yToolKit = "Obesity";

        // Creating Tool-Tip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d){
                return (`${d.state}<br>${xToolKit}: ${d[xInput]}<br> ${yToolKit}: ${d[yInput]}`);
            });

        // Calling tool-tip
        chartGroup.call(toolTip);

        // Creating event listeners to display and hide the tooltip and increase selected circle radius
        circlesGroup.on("mouseover", function(data){
            toolTip.show(data)
            d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 15)
        }).on("mouseout", function(data){
            toolTip.hide(data)
            d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 11)
        });
        
    }).catch(function(error){
        console.log(error);
    });
};