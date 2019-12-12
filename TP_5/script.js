var margin = {top: 20, right: 10, bottom: 20, left: 10}
var width = 960 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom

var index = d3.range(24)
var data = index.map(d3.randomNormal(100, 10))
// var data = d3.csvParse(await FileAttachment("data.csv").text(), ({letter, frequency}) => ({name: letter, value: +frequency}))

d3.csv('data.csv').then(function(data) {console.log(index.map(d3.randomNormal(100, 10)))})

var x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, width]);

// var y = d3.scaleOrdinal()
//     .domain(index)
//     .rangeRoundBands([0, height], .1);

var y = d3.scaleBand()
.domain(index)
.rangeRound([0, height])
.padding(0.1);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { return "translate(0," + (margin.top + y(i)) + ")"; });

bar.append("rect")
    .attr("height", y.bandwidth())
    .attr("width", x);

bar.append("text")
    .attr("text-anchor", "end")
    .attr("x", function(d) { return x(d) - 6; })
    .attr("y", y.bandwidth() / 2)
    .attr("dy", ".35em")
    .text(function(d, i) { return i; });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + margin.top + ")")
    .call(d3.axisTop(x));

var sort = false;

setInterval(function() {

  if (sort = !sort) {
    index.sort(function(a, b) { return data[a] - data[b]; });
  } else {
    index = d3.range(24);
  }

  y.domain(index);

  bar.transition()
      .duration(750)
      .delay(function(d, i) { return i * 50; })
      .attr("transform", function(d, i) { return "translate(0," +y(i)+ ")"; });

}, 500);