// Hive Colony Framework
// Copyright (C) 2008 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Hive Colony Framework is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Hive Colony Framework. If not, see <http://www.gnu.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision: 2368 $
// __date__      = $LastChangedDate: 2009-04-02 06:49:09 +0100 (qui, 02 Abr 2009) $
// __copyright__ = Copyright (c) 2008 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

var canvasRenderingContext = window.CanvasRenderingContext2D
        && CanvasRenderingContext2D.prototype;

canvasRenderingContext.dashedLine = function(x1, y1, x2, y2, parameters) {
    // in case the parameters are not defined
    if (!parameters) {
        // defined the default parameters
        parameters = [10, 10];
    }

    // saves the current state
    this.save();

    // calculates the delta values
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;

    // calculates the length of the line using the
    // euclidean distance
    var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // calculates the rotation based on the delta values
    var rotation = Math.atan2(deltaY, deltaX);

    // transates to the initial values
    this.translate(x1, y1);

    // moves to the initial position
    this.moveTo(0, 0);

    // rotates the rotation value ammount
    this.rotate(rotation);

    // retrieves the parameters length
    // and starts the parameters index
    var parametersLength = parameters.length;
    var parametersIndex = 0;

    // starts the draw flag as true
    // draws in the first iteration
    var draw = true;

    // start the current x position
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
}

canvasRenderingContext.roundRectangle = function(x, y, width, height, radius) {
    // moves to the initial corner
    this.moveTo(x + radius, y);

    // draws a line to the second corner
    this.lineTo(x + width - radius, y);

    // draws the second corner
    this.quadraticCurveTo(x + width, y, x + width, y + radius);

    // draws a line to the third corner
    this.lineTo(x + width, y + height - radius);

    // draws the third corner
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

    // draws a line to the fourth corner
    this.lineTo(x + radius, y + height);

    // draws the fourth corner
    this.quadraticCurveTo(x, y + height, x, y + height - radius);

    // draws a line to the first corner
    this.lineTo(x, y + radius);

    // draws the first corner
    this.quadraticCurveTo(x, y, x + radius, y);
}
