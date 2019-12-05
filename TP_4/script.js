var width = 700,
    height = 580;

var svg = d3.select( 'body' ).append( 'svg' )
    .attr( 'width', width )
    .attr( 'height', height )

var nodes = [
    ['valerie',17,500],
    ['charles',83,80],
    ['francois',904,15],
    ['marie',7,5],
    ['gaston',11,50],
    ['danielle',80,85],
    ['nicolas',150,300],
    ['victorine',38,7],
    ['gigi',12,12],
];

var edges = [
    ['valerie','francois',1],
    ['charles','francois',9],
    ['charles','valerie',2],
    ['marie','francois',5],
    ['marie','gaston',12],
    ['marie','nicolas',15],
    ['marie','danielle',1],
    ['gaston','nicolas',21],
    ['gaston','danielle',1],
    ['danielle','marie',3],
    ['danielle','nicolas',4],
    ['danielle','francois',4],
    ['nicolas','marie',1],
    ['nicolas','gaston',2],
    ['nicolas','danielle',5],
    ['victorine','gigi',3],
];

var color = d3.scaleQuantize().range(['#CCF794','#5DD39E','#348AA7','#525174','#513B56']);
var max = 0;
for (x in edges) {
    var v = edges[x][2];
    if (v > max) {
        max = v;
    }
}

color.domain([-4, max]);

var matrix = createAdjacencyMatrix(nodes, edges);

var matriceElt = d3.select("svg")
    .append("g")
    .attr("transform", "translate(50,50)")
    .attr("id", "adjacencyMatrix");

for (x in matrix) {
    matriceElt.append('rect')
        .attr('x', matrix[x].x * 25)
        .attr('y', matrix[x].y * 25)
        .attr('width', 25)
        .attr('height', 25)
        .attr('fill', color(matrix[x].sharedfollowers))
        .attr('stroke', '#FF9F9F')
}

var scaleSize = nodes.length * 25;

x = d3.scaleBand()
    .domain(nodes.map(function (el) {return el[0]}))
    .range([0, scaleSize]);

y = d3.scaleBand()
    .domain(nodes.map(function (el) {return el[0]}))
    .range([scaleSize, 0]);

d3.select("#adjacencyMatrix")
    .append("g")
    .attr("transform", "translate(0, " + scaleSize + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

d3.select("#adjacencyMatrix")
    .append("g")
    .call(d3.axisLeft(y));

matriceElt.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 25)
    .attr('height', scaleSize)
    .attr('fill', 'transparent')
    .attr('stroke', '#000000');

matriceElt.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', scaleSize)
    .attr('height', 25)
    .attr('fill', 'transparent')
    .attr('stroke', '#000000');

function createAdjacencyMatrix(nodes, edges) {
    var edgeHash = {};
    for (x in edges) {
        var id = edges[x][0] + "-" + edges[x][1];
        edgeHash[id] = edges[x];
    }
    matrix = [];
    for (const [a, node_a] of nodes.entries()) {
        for (const [b, node_b] of nodes.entries()) {
            var grid = {id: node_a[0] + "-" + node_b[0], x: a, y: b, sharedfollowers: 0};
            if (edgeHash[grid.id]) {
                grid.sharedfollowers = parseInt(edgeHash[grid.id][2]);
            }
            matrix.push(grid);
        }
    }
    return matrix;
}