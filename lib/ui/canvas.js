// Hive Colony Framework
// Copyright (c) 2008-2017 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is free software: you can redistribute it and/or modify
// it under the terms of the Apache License as published by the Apache
// Foundation, either version 2.0 of the License, or (at your option) any
// later version.
//
// Hive Colony Framework is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// Apache License for more details.
//
// You should have received a copy of the Apache License along with
// Hive Colony Framework. If not, see <http://www.apache.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2017 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

Template = typeof window === "undefined" ? {} : window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype || {};

canvasRenderingContext.line = function(x1, y1, x2, y2) {
    this.save();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.restore();
};

canvasRenderingContext.dashedLine = function(x1, y1, x2, y2, parameters) {
    // in case the parameters are not defined the
    // default parameters are used, required
    if (!parameters) {
        parameters = [10, 10];
    }

    // saves the current state
    this.save();

    // calculates the delta values for bot the horizontal
    // and the vertival dimensions
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;

    // calculates the length of the line using the
    // euclidean distance
    var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // calculates the rotation based on the delta values
    var rotation = Math.atan2(deltaY, deltaX);

    // transates to the initial values
    this.translate(x1, y1);

    // moves to the initial position top left corner position
    // and applies the rotation that has been calculated
    this.moveTo(0, 0);
    this.rotate(rotation);

    // retrieves the parameters length
    // and starts the parameters index
    var parametersLength = parameters.length;
    var parametersIndex = 0;

    // starts the draw flag as true
    // draws in the first iteration
    var draw = true;

    // start the current x position that is going to be used
    // at the initial part of the draw loop
    currentX = 0;

    // iterates while the current x is smaller
    // than the lenght
    while (currentX < length) {
        // calculates the current x position
        currentX += parameters[parametersIndex++ % parametersLength];

        // in case the current x position
        // is greather than the length
        if (currentX > length) {
            // sets the current x position
            // to the length (avoid overflow)
            currentX = length;
        }

        // in case the iteration is meant to be used for drawing
        draw ? this.lineTo(currentX, 0) : this.moveTo(currentX, 0);

        // inverts the draw result (alternates)
        draw = !draw;
    }

    // restores the state
    this.restore();
};

canvasRenderingContext.roundRectangle = function(x, y, width, height, radius) {
    // draws the various corners by moving the cursor to each of them
    // and then applying a quadratic curve with the requested radius
    // values, this should perform and create the desired rectangle
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
};

canvasRenderingContext.extra = function(x, y, width, height, radius) {};
