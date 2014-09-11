window.Gleaner = window.Gleaner || {};

Gleaner.draw = function(containerId, data, options) {
    switch (options.type) {
        case 'counter':
            Gleaner.counter(containerId, data, options);
            break;
    }
};


Gleaner.counter = function(containerId, data, options) {
    var container = $(containerId);
    container.empty();
    var value = data[options.counterVariable];
    container.append('<p>' + value + '</p>');
};