
var margin = { top: 30, right:10, bottom: 100, left: 30 },
width = Math.min(parseInt(document.getElementById("chart").offsetWidth,10),700),
height = 650 - margin.top - margin.bottom,
colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
Coordinates, // Stores the final list of chosen pixels.
step = -1, //Step Variable keeps the record of the current step of the experiment.
X0,X1,Y0,Y1,svg,data;
var gridSize,frameWidth,frameHeight;

function plotLineLow(x0, y0, x1, y1) {
var dx = x1 - x0;
var dy = y1 - y0;
var yi = 1;
if (dy < 0) {
    yi = -1;
    dy = -dy;
}
var coordinates = []; // It stores the chosen pixels or coordinates.
var D = 2 * dy - dx; //D represents the error.
var y = y0, x, i = 0;

for (x = x0; x <= x1; x++) {
    coordinates[i] = {};
    coordinates[i].x = x;
    coordinates[i].y = y;
    coordinates[i].d=D;
    if (D > 0) {
        y = y + yi;
        D = D - 2 * dx;
    }
    D = D + 2 * dy;
    i++;
}
return coordinates;

}
var generateXY = function (x1, y1, x2, y2) {//generating the range of coordinates in the axes
var Xmin = Math.min(x1, x2);
var Xmax = Math.max(x1, x2);
var Ymin = Math.min(y1, y2);
var Ymax = Math.max(y1, y2);
var temp=0
while(Xmax-Xmin < frameWidth){
    if(temp == 0){
        Xmax++;
        temp=1;
    }
    else{
        Xmin--;
        temp=0;
    }
}
while(Ymax-Ymin < frameHeight){
    if(temp == 0){
        Ymax++;
        temp=1;
    }
    else{
        Ymin--;
        temp=0;
    }
}
var gridsize = Math.floor(width / 30);
var X = [], Y = [], tempTable = [];
var i, j, k = 1, l;
for (i = Xmin; i <= Xmax; i++) {
    X.push(i);
}
for (i = Ymax; i >= Ymin; i--) {
    Y.push(i);
}
for (i = Ymax; i >= Ymin; i--) {
    l = 1;
    for (j = Xmin; j <= Xmax; j++) {
        tempTable.push({ y: i, x: j, yI: k, xI: l });
        l += 1;
    }
    k += 1;
}
return {
    x: X,
    y: Y,
    table: tempTable,
    gridSize: gridsize
};
}

function plotLineHigh(x0, y0, x1, y1) {
var dx = x1 - x0; // Difference of abscissa.
var dy = y1 - y0; // Difference of ordinates.
var xi = 1;
if (dx < 0) {
    xi = -1;
    dx = -dx;
}
var coordinates = []; // It will store the the pixel to be chosen to form the line
var D = 2 * dx - dy;  // D represents error;
var x = x0, i = 0, y;

for (y = y0; y <= y1; y++) {
    coordinates[i] = {};
    coordinates[i].x = x;
    coordinates[i].y = y;
    coordinates[i].d=D;
    if (D > 0) {
        x = x + xi;
        D = D - 2 * dy;
    }
    D = D + 2 * dx;
    i++;
}
return coordinates;
}

function bressanhem(x1, y1, x2, y2) {
var coordinates;
if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {//slope is between -1 to 1
    if (x1 > x2) {
        coordinates = plotLineLow(x2, y2, x1, y1);
    }
    else {
        coordinates = plotLineLow(x1, y1, x2, y2);
    }
}
else { // slope is beyond -1 and 1
    if (y1 > y2) {
        coordinates = plotLineHigh(x2, y2, x1, y1);
    }
    else {
        coordinates = plotLineHigh(x1, y1, x2, y2);
    }
}
return coordinates; // returning the list of coordinates or pixels
}

function nextStep() {
if (step === Coordinates.length) {
    alert("Experiment Complete");
    console.log("Experiment Complete");
    document.getElementById("Coordinate").innerHTML="None";
    step = Coordinates.length;
    return
}
else if (step < 0) {
    step = 0; // to prevent abnormal behaviour of next button
    var grid = document.getElementById("grid-" + Coordinates[step].x + "-" + Coordinates[step].y);
    if (grid) {
        grid.style.fill = colors[5];
        document.getElementById("Coordinate").innerHTML="( " + Coordinates[step].x + " " + Coordinates[step].y + " )";
    }
    else {
        console.log("Null");
    }
}
else{
    step += 1;
    var grid = document.getElementById("grid-" + Coordinates[step].x + "-" + Coordinates[step].y);
    if (grid) {
        grid.style.fill = colors[5];
        document.getElementById("Coordinate").innerHTML="( " + Coordinates[step].x + " " + Coordinates[step].y + " )";
    }
    else {
        console.log("Null");
    }
}
}

function previousStep() {
if (step < 0) {
    alert("Experiment has not started yet!");
    console.log("Experiment has not started yet!");
    document.getElementById("Coordinate").innerHTML="None";
    step = -1;
    return
}
else if (step >= Coordinates.length) {
    step = Coordinates.length-1;  //to prevent abnormal behaviour of previous button
    var grid1 = document.getElementById("grid-" + Coordinates[step].x + "-" + Coordinates[step].y);
    if (grid1) {
        grid1.style.fill = colors[0];
        step--;
        document.getElementById("Coordinate").innerHTML="( " + Coordinates[step].x + " " + Coordinates[step].y + " )";
    }
    else {
        console.log("Null");
    }
}
else{   
    var grid1 = document.getElementById("grid-" + Coordinates[step].x + "-" + Coordinates[step].y);
    if (grid1) {
        grid1.style.fill = colors[0];
        step--;
        document.getElementById("Coordinate").innerHTML="( " + Coordinates[step].x + " " + Coordinates[step].y + " )";
    }
    else {
        console.log("Null");
    }
}

}
function datapicker(){
X0 = parseInt(document.getElementById("x1").value,10);
X1 = parseInt(document.getElementById("x2").value,10);
Y0 = parseInt(document.getElementById("y1").value,10);
Y1 = parseInt(document.getElementById("y2").value,10);

if(Math.abs(Y1 - Y0) > frameHeight){
    alert("Y values are out of range:\n Try enter y values with difference of less than 25");
    return 1;
}
if(Math.abs(X1 - X0) > frameWidth){
    alert("X values are out of range:\n Try enter x values with difference of less than 25");
    return 1;
}
var dy = Y1 - Y0,
    dx = X1 - X0,
    c;

c=parseFloat(Y1*dx-dy*X1);
var equation= dx + "y + " + "(" + -dy + ")x + " + "(" + -c + ") = 0";
document.getElementById("Equation").innerHTML=equation;
return 0;
}
function frameCreator(){
var a,b;   
a = parseInt(document.getElementById("frameWidth").value,10);
b = parseInt(document.getElementById("frameHeight").value,10);
if(a<=25 && a>=15){
    if(b<=25 && b>=15){
        frameWidth=a;
        frameHeight=b;
        drawGraph();
    }
}

}

function drawGraph() {
step = -1;
if(parseInt(datapicker())){
    return;
}
data = generateXY(X0, Y0, X1, Y1);
gridSize = data.gridSize;

var prevSvg = document.getElementById("svg");

if (prevSvg !== null) {
    var parent = prevSvg.parentNode;
    parent.removeChild(prevSvg);
}

svg = d3.select("#chart").append("svg")
    .attr("id", "svg")
    .attr("margin-left",100)
    .attr("width", "100%")
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var YLabels = svg.selectAll(".yLabel")
    .data(data.y)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class","axis mono");

var XLabels = svg.selectAll(".xLabel")
    .data(data.x)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", function (d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class","axis mono");

var initialChart = svg.selectAll(".grid")
    .data(data.table)
    .enter().append("rect")
    .attr("x", function (d) { return (d.xI-1) * gridSize; })
    .attr("y", function (d) { return (d.yI-1) * gridSize; })
    .attr("class", "grid bordered")
    //.attr("rx", 4)
    //.attr("ry", 4)
    .attr("width", gridSize)
    .attr("height", gridSize)
    .style("fill", colors[0])
    .attr("id", function (d) {
        return "grid-" + d.x + "-" + d.y;
    });
}
function drawLine(){
if(parseInt(datapicker())){
    return;
}
var line = svg
    .append("line")
    .attr("id","line")
    .attr("stroke", "black")
    .attr("stroke-width",2)
    .attr("x1", data.x.indexOf(X0) * gridSize + gridSize / 2)
    .attr("y1", data.y.indexOf(Y0) * gridSize + gridSize / 2)
    .attr("x2", data.x.indexOf(X1) * gridSize + gridSize / 2)
    .attr("y2", data.y.indexOf(Y1) * gridSize + gridSize / 2)
    .attr("height", 20)
    .attr("width", 10);

var circle1 = svg
    .append("circle")
    .attr("id","line")
    .style("fill", "red")
    .attr("cx", data.x.indexOf(X0) * gridSize + gridSize / 2)
    .attr("cy", data.y.indexOf(Y0) * gridSize + gridSize / 2)
    .attr("height", 20)
    .attr("width", 10)
    .attr("r", 3);

var circle1 = svg
    .append("circle")
    .attr("id","line")
    .style("fill", "red")
    .attr("cx", data.x.indexOf(X1) * gridSize + gridSize / 2)
    .attr("cy", data.y.indexOf(Y1) * gridSize + gridSize / 2)
    .attr("height", 20)
    .attr("width", 10)
    .attr("r", 3);    
}
function experiment(){
drawGraph();
drawLine();
Coordinates = bressanhem(X0, Y0, X1, Y1);
}
frameCreator();
document.getElementById("submit").addEventListener("click", experiment, true);
document.getElementById("previous").addEventListener("click", previousStep);
document.getElementById("next").addEventListener("click", nextStep);
