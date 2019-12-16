var margin = {top: 20, right: 10, bottom: 20, left: 10}
var width = 960 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom

var data
var data_letter
var data_value
var filters

d3.csv('data.csv').then(function(data) {
    data_letter = data.map(data => data.letter)
    data_letter_id = [...data_letter.keys()]
    data_freq = data.map(data => data.frequency)
    data_weight = data.map(data => data.weight)

    filters = Object.keys(data[0])

    var x = d3.scaleLinear()
        .domain([0, d3.max(data_freq)])
        .range([0, width]);

    // var y = d3.scaleOrdinal()
    //     .domain(index)
    //     .rangeRoundBands([0, height], .1);

    var y = d3.scaleBand()
        .domain(data_letter_id)
        .rangeRound([0, height])
        .padding(0.1);

   var svg = d3.select("body").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var bar = svg.selectAll(".bar")
       .data(data_freq)
       .enter().append("g")
       .attr("class", "bar")
       .attr("transform", function(d, i) {return "translate(0," + (margin.top + y(i)) + ")"; });

   bar.append("rect")
       .attr("height", y.bandwidth())
       .attr("width", x);

   bar.append("text")
       .attr("text-anchor", "end")
       .attr("x", function(d) { return x(d) + 10; })
       .attr("y", y.bandwidth() / 2)
       .attr("dy", ".35em")
       .text(function(d, i) { return data_letter[i]; });

   svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + margin.top + ")")
       .call(d3.axisTop(x));


      var updateSort = function(data){
            bar.transition()
                .duration(1000)
                .delay(function(d, i) { return i * 10; })
                .attr("transform", function(d, i) {return "translate(0," +(margin.top + y(i))+ ")"; })
       }

      var dropdownChange = function() {
          switch(dropdown.node().value){
          case "letter":
            data_letter_id = [...data_letter.keys()]
            break
          case "frequency":
            data_letter_id.sort(function(a, b) { return data_freq[b] - data_freq[a]; });
            break
          case "weight":
            data_letter_id.sort(function(a, b) { return data_weight[b] - data_weight[a]; });
            break
          }
          y.domain(data_letter_id);

          updateSort(data);
      };

     var dropdown = d3.select("#dropdown-container")
                  .insert("select", "svg")
                  .on("change", dropdownChange);

     dropdown.selectAll("option")
          .data(filters)
          .enter().append("option")
          .attr("value", function (d) { return d; })
          .text(function (filters,i) {
              return filters; // capitalize 1st letter
          });
//    setInterval(function() {
//
//      if (sort = !sort) {
//        data_letter.sort(function(a, b) { return data_value[a] - data_value[b]; });
//      } else {
//        data_letter = [...data_letter.keys()]
//      }
//
//      y.domain(data_letter);
//
//      bar.transition()
//          .duration(3000)
//          .delay(function(d, i) { return i * 50; })
//          .attr("transform", function(d, i) { return "translate(0," +y(i)+ ")"; });
//
//    };
//
})