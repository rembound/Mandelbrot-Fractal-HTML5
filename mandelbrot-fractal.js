// ------------------------------------------------------------------------
// Drawing Mandelbrot Fractals With HTML5 Canvas And JavaScript
// (c) 2015 Rembound.com
// http://rembound.com/articles/drawing-mandelbrot-fractals-with-html5-canvas-and-javascript
// ------------------------------------------------------------------------

// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    
    // Width and height of the image
    var imagew = canvas.width;
    var imageh = canvas.height;
    
    // Image Data (RGBA)
    var imagedata = context.createImageData(imagew, imageh);
    
    // Pan and zoom parameters
    var offsetx = -imagew/2;
    var offsety = -imageh/2;
    var panx = -100;
    var pany = 0;
    var zoom = 150;
    
    // Palette array of 256 colors
    var palette = [];
    
    // The maximum number of iterations per pixel
    var maxiterations = 250;
    
    // Initialize the game
    function init() {
        // Add mouse events
        canvas.addEventListener("mousedown", onMouseDown);
        
        // Generate palette
        generatePalette();
        
        // Generate image
        generateImage();
    
        // Enter main loop
        main(0);
    }
    
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);
        
        // Draw the generate image
        context.putImageData(imagedata, 0, 0);
    }
    
    // Generate palette
    function generatePalette() {
        // Calculate a gradient
        var roffset = 24;
        var goffset = 16;
        var boffset = 0;
        for (var i=0; i<256; i++) {
            palette[i] = { r:roffset, g:goffset, b:boffset};
            
            if (i < 64) {
                roffset += 3;
            } else if (i<128) {
                goffset += 3;
            } else if (i<192) {
                boffset += 3;
            }
        }
    }
    
    // Generate the fractal image
    function generateImage() {
        // Iterate over the pixels
        for (var y=0; y<imageh; y++) {
            for (var x=0; x<imagew; x++) {
                iterate(x, y, maxiterations);
            }
        }
    }

    // Calculate the color of a specific pixel
    function iterate(x, y, maxiterations) {
        // Convert the screen coordinate to a fractal coordinate
        var x0 = (x + offsetx + panx) / zoom;
        var y0 = (y + offsety + pany) / zoom;
        
        // Iteration variables
        var a = 0;
        var b = 0;
        var rx = 0;
        var ry = 0;
        
        // Iterate
        var iterations = 0;
        while (iterations < maxiterations && (rx * rx + ry * ry <= 4)) {
            rx = a * a - b * b + x0;
            ry = 2 * a * b + y0;
            
            // Next iteration
            a = rx;
            b = ry;
            iterations++;
        }
        
        // Get palette color based on the number of iterations
        var color;
        if (iterations == maxiterations) {
            color = { r:0, g:0, b:0}; // Black
        } else {
            var index = Math.floor((iterations / (maxiterations-1)) * 255);
            color = palette[index];
        }
        
        // Apply the color
        var pixelindex = (y * imagew + x) * 4;
        imagedata.data[pixelindex] = color.r;
        imagedata.data[pixelindex+1] = color.g;
        imagedata.data[pixelindex+2] = color.b;
        imagedata.data[pixelindex+3] = 255;
    }
    
    // Zoom the fractal
    function zoomFractal(x, y, factor, zoomin) {
        if (zoomin) {
            // Zoom in
            zoom *= factor;
            panx = factor * (x + offsetx + panx);
            pany = factor * (y + offsety + pany);
        } else {
            // Zoom out
            zoom /= factor;
            panx = (x + offsetx + panx) / factor;
            pany = (y + offsety + pany) / factor;
        }
    }
    
    // Mouse event handlers
    function onMouseDown(e) {
        var pos = getMousePos(canvas, e);
        
        // Zoom out with Control
        var zoomin = true;
        if (e.ctrlKey) {
            zoomin = false;
        }
        
        // Pan with Shift
        var zoomfactor = 2;
        if (e.shiftKey) {
            zoomfactor = 1;
        }
        
        // Zoom the fractal at the mouse position
        zoomFractal(pos.x, pos.y, zoomfactor, zoomin);
        
        // Generate a new image
        generateImage();
    }
    
    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    
    // Call init to start the game
    init();
};