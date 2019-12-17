var margin = {top: 20, right: 10, bottom: 20, left: 10}
var width = 500 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

d3.csv('data.csv').then(function(data_en) {

        var data_en = data_en
        var data_letter
        var data_value
        var filters

        data_letter = data_en.map(data => data.letter)
        data_letter_id = [...data_letter.keys()]
        data_freq = data_en.map(data => data.frequency)
        data_weight = data_en.map(data => data.weight)

        filters = ["letter", "frequency ↓", "frequency ↑"]

        var x = d3.scaleLinear()
         .domain([0, d3.max(data_freq)])
         .range([0, width]);

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
        .attr("id", function(d, i){ return "bar_"+i})
        .attr("class", "bar")
        .attr("transform", function(d, i) {return "translate(0," + (margin.top + y(i)) + ")"; })
        .on("mouseover", function(d,i){
            d3.select(this).attr("class", "bar-hover");
            d3.select("#bar_fr_"+i).attr("class", "bar-hover-fr");
        })
        .on("mouseout", function(d,i){
            d3.select(this).attr("class", "bar");
            d3.select("#bar_fr_"+i).attr("class", "bar-fr");
        });

        bar.append("rect")
        .attr("height", y.bandwidth())
        .attr("width", x)


        bar.append("text")
        .attr("text-anchor", "end")
        .attr("x", function(d) { return x(d) + 10; })
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(function(d, i) { return (data_letter[i]).toUpperCase(); });

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + margin.top + ")")
        .call(d3.axisTop(x));



        d3.csv('datafr.csv').then(function(data_fr) {

        var data_fr = data_fr
        var data_letter_fr
        var data_value_fr
        var filters_fr

        data_letter_fr = data_fr.map(data => data.letter)
        data_letter_id_fr = [...data_letter_fr.keys()]
        data_freq_fr = data_fr.map(data => data.frequency)
        data_weight_fr = data_fr.map(data => data.weight)

        filters_fr = Object.keys(data_fr[0])

        var x_fr = d3.scaleLinear()
            .domain([0, d3.max(data_freq_fr)])
            .range([0, width]);

        var y_fr = d3.scaleBand()
            .domain(data_letter_id_fr)
            .rangeRound([0, height])
            .padding(0.1);

       var svg_fr = d3.select("body").append("svg")
           .attr("x", width)
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       var bar_fr = svg_fr.selectAll(".bar_fr")
           .data(data_freq_fr)
           .enter().append("g")
            .attr("id", function(d, i){ return "bar_fr_"+i})
           .attr("class", "bar-fr")
           .attr("transform", function(d, i) {console.log(y(i), y_fr(i));return "translate(0," + (margin.top + y_fr(i)+7) + ")"; })
            .on("mouseover", function(d,i){
                d3.select(this).attr("class", "bar-hover-fr");
                d3.select("#bar_"+i).attr("class", "bar-hover");
            })
            .on("mouseout", function(d,i){
                d3.select(this).attr("class", "bar-fr");
                d3.select("#bar_"+i).attr("class", "bar");
            });

       bar_fr.append("rect")
           .attr("height", y_fr.bandwidth())
           .attr("width", x_fr);

       bar_fr.append("text")
           .attr("text-anchor", "end")
           .attr("x", function(d) { return x_fr(d) + 10; })
           .attr("y", y_fr.bandwidth() / 2)
           .attr("dy", ".35em")
           .text(function(d, i) { return (data_letter_fr[i]).toUpperCase(); });

       svg_fr.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + margin.top + ")")
           .call(d3.axisTop(x_fr));

        var updateSort = function(){
            bar.transition()
                .duration(1000)
                .delay(function(d, i) { return i * 10; })
                .attr("transform", function(d, i) {return "translate(0," +(margin.top + y(i))+ ")"; })

            bar_fr.transition()
                .duration(1000)
                .delay(function(d, i) { return i * 10; })
                .attr("transform", function(d, i) {return "translate(0," +(margin.top + y_fr(i))+ ")"; })

        }

        var dropdownChange = function() {
          switch(dropdown.node().value){
          case "letter":
            data_letter_id = [...data_letter.keys()]
            data_letter_id_fr = [...data_letter_fr.keys()]
            break
          case "frequency ↓":
            data_letter_id.sort(function(a, b) { return data_freq[b] - data_freq[a]; });
            data_letter_id_fr.sort(function(a, b) { return data_freq_fr[b] - data_freq_fr[a]; });
            break
          case "frequency ↑":
            data_letter_id.sort(function(a, b) { return data_freq[a] - data_freq[b]; });
            data_letter_id_fr.sort(function(a, b) { return data_freq_fr[a] - data_freq_fr[b]; });
            break
          }

          y.domain(data_letter_id);
          y_fr.domain(data_letter_id_fr);

          updateSort();
        };

        var dropdown = d3.select("#dropdown-container")
                  .insert("select", "svg")
                  .on("change", dropdownChange);

        dropdown.selectAll("option")
          .data(filters)
          .enter().append("option")
          .attr("value", function (d) { return d; })
          .text(function (filters) {
              return filters; // capitalize 1st letter
          });

    })
})