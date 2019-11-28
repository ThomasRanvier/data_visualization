var width = 700,
    height = 580;

var svg = d3.select( 'body' )
    .append( 'svg' )
    .attr( 'width', width )
    .attr( 'height', height )
    .attr('transform', 'translate(-115, 0)');

// On rajoute un groupe englobant toute la visualisation pour plus tard
var g = svg.append( 'g' );

var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2800);

// On definie une echelle de couleur
// via https://observablehq.com/@d3/color-schemes?collection=@d3/d3-scale-chromatic
var color = d3.scaleQuantize().range(['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c']);

var tooltip = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

var path = d3.geoPath().projection(projection);
var dates_str = '05/01/14,12/01/14,19/01/14,26/01/14,02/02/14,09/02/14,16/02/14,23/02/14,02/03/14,09/03/14,16/03/14,23/03/14,30/03/14,06/04/14,13/04/14,20/04/14,27/04/14,04/05/14,11/05/14,18/05/14,25/05/14,01/06/14,08/06/14,15/06/14,22/06/14,29/06/14,06/07/14,13/07/14,20/07/14,27/07/14,03/08/14,10/08/14,17/08/14,24/08/14,31/08/14,07/09/14,14/09/14,21/09/14,28/09/14,05/10/14,12/10/14,19/10/14,26/10/14,02/11/14,09/11/14,16/11/14,23/11/14,30/11/14,07/12/14,14/12/14,21/12/14,28/12/14';
var dates = dates_str.split(',');
var regionValues = {};

var slider = document.getElementById('myRange');
var dateDisplay = document.getElementById('date');
dateDisplay.innerHTML = dates[slider.value];

//Initial display
display_map(dates[slider.value], true);

slider.oninput = function() {
    var date = dates[this.value];
    dateDisplay.innerHTML = date;
    display_map(date, false);
}

function display_map(date, first) {
    d3.csv('GrippeFrance2014.csv').then(function(data) {
        color.domain([
            d3.min(data, function(d) { return parseInt(d[date]); }),
            d3.max(data, function(d) { return parseInt(d[date]); })
        ]);
        d3.json('regions.json').then(function(json) {
            for (var i = 0; i < data.length; i++) {
                var dataRegion = data[i].region;
                var dataValue = parseFloat(data[i][date]);
                for (var j = 0; j < json.features.length; j++) {
                    var jsonRegion = json.features[j].properties.nom;
                    if (dataRegion == jsonRegion) {
                        regionValues[jsonRegion] = dataValue;
                        break;
                    }
                }
            }
            if (first) {
                g.selectAll('path')
                    .data(json.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .style('fill', function(d) {
                        var value = regionValues[d.properties.nom];
                        if (value)
                            return color(value);
                        else
                            return '#ccc';
                    })
                    .on('mousemove', function(d) {
                        var mousePosition = d3.mouse(this);
                        tooltip.classed('hidden', false)
                            .attr('style', 'left:' + (mousePosition[0] - 90) +
                                'px; top:' + (mousePosition[1] + 45) + 'px')
                            .html(d.properties.nom + ', ' + regionValues[d.properties.nom] + ' malades');
                    })
                    .on('mouseout', function() {
                        tooltip.classed('hidden', true);
                    });
            } else {
                g.selectAll('path')
                    .attr('d', path)
                    .style('fill', function(d) {
                        var value = regionValues[d.properties.nom];
                        if (value)
                            return color(value);
                        else
                            return '#ccc';
                    })
            }
        });
    });
}
