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
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr('x', 0 - (height/2) + 10)
.attr("dy", "1em")
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "healthcare")
.text("Lack Healthcare (%)")
// .on("click", function(){ 
//     alert(`hey i was clicked`);
//     });

// Adding Labels: Y Label placement: Smokes
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 20)
.attr('x', 0 - (height/2) + 10)
.attr("dy", "1em")
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "smokes")
.text("Smokes (%)");

// Adding Labels: Y Label placement: Obese
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr('x', 0 - (height/2) + 10)
.attr("dy", "1em")
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "obesity")
.text("Obese (%)");

// Adding Labels: X Label placement: Poverty
chartGroup.append("text")
.attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 20})`)
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "poverty")
.text("Poverty (%)");

// Adding Labels: X Label placement: Age Median
chartGroup.append("text")
.attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 40})`)
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "age")
.text("Age (Median)");

// Adding Labels: X Label placement House Hold Income Median
chartGroup.append("text")
.attr("transform",`translate(${(width / 2) - 30}, ${height + margin.top + 60})`)
.attr("class", "aText")
.attr("class", "inactive")
.attr("id", "income")
.text("Household Income (Median)");

// Adding clickable functionality on the labels
d3.select("#poverty").on("click", xhandleClick);
d3.select("#age").on("click", xhandleClick);
d3.select("#income").on("click", xhandleClick);
d3.select("#healthcare").on("click", yhandleClick);
d3.select("#smokes").on("click", yhandleClick);
d3.select("#obesity").on("click", yhandleClick);

xInput = "poverty"
yInput = "healthcare"
plotScatter(xInput, yInput);

// Adding functions to store xInput Value and yInput value for graph
function xhandleClick(){
    var xInput = d3.event.target.id;
    console.log(xInput)
    plotScatter(xInput, yInput);
    return xInput
};
function yhandleClick(){
    var yInput = d3.event.target.id;
    console.log(yInput)
    plotScatter(xInput, yInput);
    return yInput
};



function plotScatter(xInput, yInput){

    // Importing Data
    d3.csv("assets/data/data.csv").then(function(stateData){

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

        // Creating Scale Functions
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d[xInput] - (d[xInput]/20)), d3.max(stateData, d => d[xInput] + (d[xInput]/90))])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(stateData, d => d[yInput]) - 1.5, d3.max(stateData, d => d[yInput]) + 3])
            .range([height, 0])

        // Creating Axis function
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Appending Axes to the chart
        // x-axis
        chartGroup.append("g")
            .attr("id", "axis")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        // y-axis
        chartGroup.append("g")
            .attr("id", "axis")
            .call(leftAxis);

        // Creating Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("r", "11")
            .attr("class", "stateCircle")
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
                        //.transition()
                        //.duration(1000)
                        .attr("x", (d => xLinearScale(d[xInput])))
                        .attr("y", (d => yLinearScale(d[yInput])+3));
                        
        // Creating Tool-Tip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d){
                return (`${d.state}<br>Poverty: ${d[xInput]}%<br> Healthcare: ${d[yInput]}%`)
            });

        // Calling tool-tip
        chartGroup.call(toolTip);

        // Creating event listeners to display and hid the tooltip
        circlesGroup.on("mouseover", function(data){
            toolTip.show(data)
        }).on("mouseout", function(data){
            toolTip.hide(data)
        });

        
    }).catch(function(error){
        console.log(error);
    });

};

