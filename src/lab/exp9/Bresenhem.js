document.getElementById("submit").addEventListener("click", datapicker, true);
document.getElementById("previous").addEventListener("click", previousStep);
document.getElementById("next").addEventListener("click", nextStep);

var margin = { top: 50, right:10, bottom: 100, left: 30 },
    width = 700 - margin.left - margin.right,
    height = 625 - margin.top - margin.bottom,
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
    Coordinates,
    step = -1;

function plotLineLow(x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    var coordinates = [];
    var D = 2 * dy - dx;
    var y = y0, x, i = 0;

    for (x = x0; x <= x1; x++) {
        coordinates[i] = {};
        coordinates[i].x = x;
        coordinates[i].y = y;
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

    var gridsize = Math.floor(width / 30);
    var X = [], Y = [], temp_table = [];
    var i, j, k = 1, l;
    for (i = Xmin - 2; i <= Xmax + 2; i++) {
        X.push(i);
    }
    for (i = Ymax + 2; i >= Ymin - 2; i--) {
        Y.push(i);
    }
    for (i = Ymax + 2; i >= Ymin - 2; i--) {
        l = 1;
        for (j = Xmin - 2; j <= Xmax + 2; j++) {
            temp_table.push({ y: i, x: j, yI: k, xI: l });
            l += 1;
        }
        k += 1;
    }
    return {
        x: X,
        y: Y,
        table: temp_table,
        gridSize: gridsize
    };
}

function plotLineHigh(x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    var coordinates = [];
    var D = 2 * dx - dy
    var x = x0, i = 0, y;

    for (y = y0; y <= y1; y++) {
        coordinates[i] = {};
        coordinates[i].x = x;
        coordinates[i].y = y;
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
    if (Math.abs(y2 - y1) < Math.abs(x2 - x1)) {
        if (x1 > x2) {
            coordinates = plotLineLow(x2, y2, x1, y1);
        }
        else {
            coordinates = plotLineLow(x1, y1, x2, y2);
        }
    }
    else {
        if (y1 > y2) {
            coordinates = plotLineHigh(x2, y2, x1, y1);
        }
        else {
            coordinates = plotLineHigh(x1, y1, x2, y2);
        }
    }
    return coordinates;
}

function nextStep() {
    if (step === Coordinates.length) {
        alert("Experiment Complete");
        return
    }
    else if (step < 0) {
        step = 0;
    }

    var grid = document.getElementById("grid-" + Coordinates[step].x + "-" + Coordinates[step].y);
    if (grid) {
        grid.style.fill = colors[5];
        step += 1;
    }
    else {
        alert("Null");
    }
}

function previousStep() {
    if (step < 0) {
        alert("Experiment has not started yet!");
        return
    }
    else if (step >= Coordinates.length) {
        step = Coordinates.length - 1;
    }
    var grid1 = document.getElementById("grid-" + Coordinates[step].x + "-" + Coordinates[step].y);
    if (grid1) {
        grid1.style.fill = colors[0];
        step -= 1;
    }
    else {
        alert("Null");
    }
}
function datapicker() {
    step = -1;
    var x1 = parseInt(document.getElementById("x1").value);
    var x2 = parseInt(document.getElementById("x2").value);

    var y1 = parseInt(document.getElementById("y1").value);
    var y2 = parseInt(document.getElementById("y2").value);

    if(Math.abs(y2-y1)>=22){
        alert("Y values are out of range:\n Try enter y values with difference of less than 20");
        return
    }
    if(Math.abs(x2-x1)>=25){
        alert("X values are out of range:\n Try enter x values with difference of less than 25");
        return
    }

    var data = generateXY(x1, y1, x2, y2);
    Coordinates = bressanhem(x1, y1, x2, y2);
    var gridSize = data.gridSize;

    var prevSvg = document.getElementById("svg");

    if (prevSvg !== null) {
        var parent = prevSvg.parentNode;
        parent.removeChild(prevSvg);
    }

    var svg = d3.select("#chart").append("svg")
        .attr("id", "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
        .attr("x", function (d) { return (d.xI - 1) * gridSize; })
        .attr("y", function (d) { return (d.yI - 1) * gridSize; })
        .attr("class", "grid bordered")
        //.attr("rx", 4)
        //.attr("ry", 4)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0])
        .attr("id", function (d) {
            return "grid-" + d.x + "-" + d.y;
        });

    var line = svg
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width",3)
        .attr("x1", data.x.indexOf(x1) * gridSize + gridSize / 2)
        .attr("y1", data.y.indexOf(y1) * gridSize + gridSize / 2)
        .attr("x2", data.x.indexOf(x2) * gridSize + gridSize / 2)
        .attr("y2", data.y.indexOf(y2) * gridSize + gridSize / 2)
        .attr("height", 20)
        .attr("width", 10);

}
datapicker();