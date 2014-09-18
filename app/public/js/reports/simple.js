window.Gleaner = window.Gleaner || {};

Gleaner.draw = function(containerId, data, segments, report) {
    $(containerId).empty();
    switch (report.type) {
        case 'counter':
            Gleaner.counter(containerId, data, segments, report);
            break;
    }
};


Gleaner.counter = function(containerId, data, segments, report) {
    var table = [];
    data.forEach(function(segment) {
        if (segments[segment.segmentName]) {
            table.push([segment.segmentName, segment[report.counterVariable]]);
        }
    });

    var counter = new Counter();
    counter.draw(containerId, table);
};