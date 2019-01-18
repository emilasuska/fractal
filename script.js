var baseShape = [];
var fractalPattern = [];
var stages = 1;

function start() {
    // add buttons for all base shapes
    var baseShapesNode = document.getElementById("baseShapes");
    var baseShapes = getBaseShapes();
    for (var i = 0; i < baseShapes.length; ++i) {
        baseShapesNode.appendChild(
            createLinesButton(baseShapes[i], onSelectBaseShape));
    }

    // add buttons for all fractal patterns
    var fractalPatternsNode = document.getElementById("fractalPatterns");
    var fractalPatterns = getFractalPatterns();
    for (var i = 0; i < fractalPatterns.length; ++i) {
        fractalPatternsNode.appendChild(
            createLinesButton(fractalize(baseShapes[0], fractalPatterns[i]), onSelectFractalPattern));
    }

    // add buttons for all stages
    var stagesNode = document.getElementById("stages");
    for (var i = 1; i <= 5; ++i) {
        stagesNode.appendChild(createNumberButton(i, onSelectStages));
    }

    // select one button from each group
    baseShapesNode.children[0].onclick();
    fractalPatternsNode.children[0].onclick();
    stagesNode.children[3].onclick();
}

function updateFractal() {
    // start with base shape
    var fractal = baseShape;

    // replace each line with the pattern, repeat for number of stages
    for (var i = 0; i < stages; ++i) {
        fractal = fractalize(fractal, fractalPattern);
    }

    // replace the existing image
    var svg = document.getElementById("fractal");
    svg.innerHTML = "";
    addLines(svg, fractal);
}

function createLinesButton(lines, onclick) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style = "width: 100px; height: 100px";
    addLines(svg, lines);

    var button = document.createElement("span");
    button.onclick = onclick;
    button.appendChild(svg);
    return button;
}

function createNumberButton(number, onclick) {
    var numberNode = document.createElement("span");
    numberNode.innerText = number;

    var button = document.createElement("span");
    button.onclick = onclick;
    button.appendChild(numberNode);
    return button;
}

function addLines(svg, lines) {
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        svgLine.setAttribute("x1", line.x1);
        svgLine.setAttribute("y1", line.y1);
        svgLine.setAttribute("x2", line.x2);
        svgLine.setAttribute("y2", line.y2);
        svgLine.setAttribute("stroke", "#000");
        svg.appendChild(svgLine);
    }
}

function selectOneButton(button) {
    var selected = -1;

    // loop over all the buttons in the group
    var siblings = button.parentElement.childNodes;
    for (var i = 0; i < siblings.length; ++i) {
        if (button === siblings[i]) {
            // this is the button that was selected
            selected = i;
            siblings[i].className = "selected";
        } else {
            // deselect other button
            siblings[i].className = "deselected";
        }
    }

    // return the index of the selected button within the group
    return selected;
}

function onSelectBaseShape() {
    baseShape = getBaseShapes()[selectOneButton(this)];
    updateFractal();
}

function onSelectFractalPattern() {
    fractalPattern = getFractalPatterns()[selectOneButton(this)];
    updateFractal();
}

function onSelectStages() {
    stages = selectOneButton(this) + 1;
    updateFractal();
}

function fractalize(lines, pattern) {
    var fractal = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var dx = line.x2 - line.x1;
        var dy = line.y2 - line.y1;
        for (var j = 0; j < pattern.length; ++j) {
            var p = pattern[j];
            fractal.push({
                x1: dx * p.x1 - dy * p.y1 + line.x1,
                y1: dy * p.x1 + dx * p.y1 + line.y1,
                x2: dx * p.x2 - dy * p.y2 + line.x1,
                y2: dy * p.x2 + dx * p.y2 + line.y1,
            });
        }
    }
    return fractal;
}

function getBaseShapes() {
    return [
        [
            // one line
            { x1: 10, y1: 50, x2: 90, y2: 50 }
        ],
        [
            // triangle
            { x1: 80, y1: 75, x2: 20, y2: 75 },
            { x1: 20, y1: 75, x2: 50, y2: 20 },
            { x1: 50, y1: 20, x2: 80, y2: 75 }
        ],
        [
            // square
            { x1: 20, y1: 20, x2: 80, y2: 20 },
            { x1: 80, y1: 20, x2: 80, y2: 80 },
            { x1: 80, y1: 80, x2: 20, y2: 80 },
            { x1: 20, y1: 80, x2: 20, y2: 20 }
        ]
    ];
}

function getFractalPatterns() {
    return [
        [
            { x1: 0, y1: 0, x2: 1/3, y2: -1/5 },
            { x1: 1/3, y1: -1/5, x2: 2/3, y2: 1/5 },
            { x1: 2/3, y1: 1/5, x2: 1, y2: 0 }
        ],
        [
            { x1: 0, y1: 0, x2: 1/3, y2: 0 },
            { x1: 1/3, y1: 0, x2: 1/2, y2: -0.3 },
            { x1: 1/2, y1: -0.3, x2: 2/3, y2: 0 },
            { x1: 2/3, y1: 0, x2: 1, y2: 0 }
        ],
        [
            { x1: 0, y1: 0, x2: 1/3, y2: 0 },
            { x1: 1/3, y1: 0, x2: 1/3, y2: -1/3 },
            { x1: 1/3, y1: -1/3, x2: 2/3, y2: -1/3 },
            { x1: 2/3, y1: -1/3, x2: 2/3, y2: 0 },
            { x1: 2/3, y1: 0, x2: 1, y2: 0 }
        ],
    ];
}

