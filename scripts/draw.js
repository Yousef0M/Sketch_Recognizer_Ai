function Pen(new_context, w, h) {

    var tool = this;

    this.predictionCanvas;
    this.isDrawing = false;
    this.points = []

    this.max_x = 0
    this.max_y = 0

    this.max_points = 250

    this.min_x = Number.MAX_VALUE
    this.min_y = Number.MAX_VALUE

    this.stroke_width = 9

    this.reducedPoints = []
    this.reducedStrokes = []
    this.epsilon = 2

    var context = new_context;


    context.lineWidth = tool.stroke_width;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = 'black'


    var old_canvas = document.createElement('canvas');
    old_canvas.width = w
    old_canvas.height = h

    var old_ctx = old_canvas.getContext('2d');

    old_ctx.beginPath();
    old_ctx.fillStyle = 'white';
    old_ctx.rect(0, 0, w, h)
    old_ctx.fill()
    function reset_rect() {
        tool.max_x = 0
        tool.max_y = 0

        tool.min_x = Number.MAX_VALUE
        tool.min_y = Number.MAX_VALUE
    }
    this.mousedown = function (ev) {

        tool.points.push({
            x: ev._x,
            y: ev._y
        });

        tool.isDrawing = true;
        x = ev._x;
        y = ev._y;
        drawPoints(context, tool.points)
    }

    this.mousemove = function (ev) {

        if (!tool.isDrawing) return;

        tool.max_x = Math.max(tool.max_x, ev._x)
        tool.max_y = Math.max(tool.max_y, ev._y)

        tool.min_x = Math.min(tool.min_x, ev._x)
        tool.min_y = Math.min(tool.min_y, ev._y)

        tool.points.push({
            x: ev._x,
            y: ev._y
        });

        context.clearRect(0, 0, w, h)
        context.drawImage(old_canvas, 0, 0)

        drawPoints(context, tool.points)

        points_len = tool.points.length

        // To improve performance
        if (points_len > tool.max_points) {

            let last_point = tool.points[points_len - 1]
            tool.mouseup(ev)
            tool.isDrawing = true;
            ev._x = last_point.x
            ev._y = last_point.y
            tool.mousedown(ev)
        }
    }

    this.mouseup = function (ev) {
        if (!tool.isDrawing) return;

        points_len = tool.points.length

        tool.reducedPoints.push(tool.points[0])
        rdp(tool.points, 1, points_len - 1, tool.epsilon, tool.reducedPoints)
        tool.reducedPoints.push(tool.points[points_len - 1])


        tool.reducedStrokes.push(tool.reducedPoints)

        tool.reducedPoints = []

        tool.isDrawing = false;
        tool.points = [];

        old_ctx.beginPath();
        old_ctx.fillStyle = 'white';
        old_ctx.rect(0, 0, w, h)
        old_ctx.fill()
        old_ctx.closePath();
        old_ctx.drawImage(canvas, 0, 0)

        old_ctx.lineWidth = 5
        old_ctx.lineCap = 'round'

        prediction = predict(tool.predictionCanvas, tool.reducedStrokes)
        prediction_label.textContent = labels[prediction];
        if (prediction == drawing_index) {
            toggle_round_card()
        }

    }

    this.clear = function () {
        old_ctx.beginPath();
        old_ctx.fillStyle = 'white';
        old_ctx.rect(0, 0, w, h)
        old_ctx.fill()
        old_ctx.closePath();

        context.beginPath();
        context.fillStyle = 'white';
        context.rect(0, 0, w, h)
        context.fill()
        old_ctx.closePath();
        tool.reducedPoints = []
        tool.reducedStrokes = []

        reset_rect()
    }

}

function drawPoints(ctx, pts) {
    ctx.beginPath();

    //Draw point
    if (pts.length < 6) {
        var b = pts[0];
        ctx.fillStyle = 'black';
        ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0)
        ctx.closePath();
        ctx.fill();
        return;
    }

    ctx.moveTo(pts[0].x, pts[0].y);

    for (i = 1; i < pts.length - 2; i++) {
        cpx = pts[i].x;
        cpy = pts[i].y;

        x = (cpx + pts[i + 1].x) / 2;
        y = (cpy + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(cpx, cpy, x, y);
    }

    ctx.quadraticCurveTo(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);

    ctx.stroke();

}
function ev_canvas(ev) {

    rect = canvas.getBoundingClientRect();

    ev._x = (ev.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    ev._y = (ev.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

    ev._x = ev._x + .5

    func = PEN[ev.type];

    if (func)
        func(ev)
}

var Timer;
var start_timer_from = 20

//For string formatting
String.form = function (str, arr) {
    var i = -1;
    function callback(exp, p0, p1, p2, p3, p4) {
        if (exp == '%%') return '%';
        if (arr[++i] === undefined) return undefined;
        exp = p2 ? parseInt(p2.substr(1)) : undefined;
        var base = p3 ? parseInt(p3.substr(1)) : undefined;
        var val;
        switch (p4) {
            case 's': val = arr[i]; break;
            case 'c': val = arr[i][0]; break;
            case 'f': val = parseFloat(arr[i]).toFixed(exp); break;
            case 'p': val = parseFloat(arr[i]).toPrecision(exp); break;
            case 'e': val = parseFloat(arr[i]).toExponential(exp); break;
            case 'x': val = parseInt(arr[i]).toString(base ? base : 16); break;
            case 'd': val = parseFloat(parseInt(arr[i], base ? base : 10).toPrecision(exp)).toFixed(0); break;
        }
        val = typeof (val) == 'object' ? JSON.stringify(val) : val.toString(base);
        var sz = parseInt(p1); /* padding size */
        var ch = p1 && p1[0] == '0' ? '0' : ' '; /* isnull? */
        while (val.length < sz) val = p0 !== undefined ? val + ch : ch + val; /* isminus? */
        return val;
    }
    var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
    return str.replace(regex, callback);
}
String.prototype.$ = function () {
    return String.form(this, Array.prototype.slice.call(arguments));
}

function init() {
    var timer = document.getElementById('timer');
    timer.textContent = '%02d'.$(0) + ':%02d'.$(start_timer_from);
}


function stop_drawing() {
    canvas.removeEventListener('mousedown', ev_canvas)
    window.removeEventListener('mousemove', ev_canvas);
    window.removeEventListener('mouseup', ev_canvas);
    if (Timer)
        clearInterval(Timer);
}
var canvas_w, canvas_h = 0


function start_drawing() {

    let input_size = { w: 28, h: 28 }

    var timer = document.getElementById('timer');
    var canvas = document.getElementById('canvas');
    var topBar = document.getElementById('label');
    prediction_label = document.getElementById('prediction');

    yOffset = topBar.clientHeight

    canvas_w = window.screen.availWidth;
    canvas_h = window.screen.availHeight;

    canvas.width = canvas_w
    canvas.height = canvas_h
    strokes = []

    PEN = new Pen(canvas.getContext('2d'), canvas_w, canvas_h);

    startTime = new Date().getTime();

    Timer = setInterval(function () {

        const d = new Date();

        time_sec = start_timer_from - Math.floor((d.getTime() - startTime) / 1000);
        time_min = Math.max(0, Math.floor(time_sec / 60))

        if (time_sec >= 0) {
            timer.textContent = '%02d'.$(time_min) + ':%02d'.$(time_sec);
            return;
        }

        timer.textContent = '%02d'.$(time_min) + ':%02d'.$(0);
        toggle_round_card()



        clearInterval(Timer);
    }, 1000)

    startPrediction(PEN, input_size)

    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mouseout', ev_canvas, false);

    //I've put these event on the window so if the mouse outside the canvas or the web screen the event still will return mouse events
    window.addEventListener('mousemove', ev_canvas, true);
    window.addEventListener('mouseup', ev_canvas, false);
}

function startPrediction(PEN, img_size, stroke_width = 1) {

    var predictionCanvas = document.createElement('canvas')
    predictionCanvas.width = img_size.w
    predictionCanvas.height = img_size.h

    let ctx = predictionCanvas.getContext('2d')
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0, 0, img_size.w, img_size.h)
    ctx.fill()
    ctx.closePath();
    ctx.lineWidth = stroke_width
    ctx.strokeStyle = "white";


    PEN.predictionCanvas = predictionCanvas

}

//Return -1 if the accuracy under 50%
function predict(empty_canvas, strokes) {
    //Reshape the image to prepare it for the model
    let img_input = image_preprocessing(empty_canvas, strokes)
    var input = tf.tensor(img_input, [1, 28, 28, 1]);



    let predictions = model.predict(input);
    predictions = predictions.dataSync()

    var prediction_index = argmax(predictions)
    accuracy = predictions[prediction_index]

    if (accuracy < .5)
        prediction_index = -1


    return prediction_index;
}
function image_preprocessing(temp_canvas, strokes) {


    let w = temp_canvas.width, h = temp_canvas.height

    let size = max_min(strokes)

    let max_x = size[0] //width
    let max_y = size[2] //height

    let min_x = size[1] //x
    let min_y = size[3] //y

    //To represent the height and width of the points
    max_x -= min_x
    max_y -= min_y

    let padding = 2
    let stroke_width = 1

    let points_width = w - stroke_width - padding
    let points_height = h - stroke_width - padding

    //For the strokes ratio ascpect in here I dealt with the points like if they were images so they have x,y,width,height
    if (max_x > max_y)
        points_height *= max_y / max_x
    else
        points_width *= max_x / max_y

    //Offsetting the points to the center
    offsetx = Math.abs(w / 2 - (points_width / 2))
    offsety = Math.abs(h / 2 - (points_height / 2))



    let ctx = temp_canvas.getContext('2d')
    ctx.beginPath();
    ctx.rect(0, 0, w, h)
    ctx.fill()
    ctx.closePath();

    //To draw the bloody strokes 
    for (var i = 0; i < strokes.length; i += 1) {
        for (var ii = 1; ii < strokes[i].length; ii += 1) {

            //Some big brain moves over here
            let xNorm = (strokes[i][ii - 1].x - min_x) / max_x
            let yNorm = (strokes[i][ii - 1].y - min_y) / max_y
            from_x = (xNorm * points_width) + offsetx
            from_y = (yNorm * points_height) + offsety

            //Same here
            xNorm = (strokes[i][ii].x - min_x) / max_x
            yNorm = (strokes[i][ii].y - min_y) / max_y
            to_x = (xNorm * points_width) + offsetx
            to_y = (yNorm * points_height) + offsety

            //And here everything should be painted 
            ctx.beginPath();
            ctx.moveTo(from_x, from_y);
            ctx.lineTo(to_x, to_y);
            ctx.stroke();
        }
    }

    let imgData = ctx.getImageData(0, 0, w, h)
    thresh = imageThreshold(imgData.data, 1, 1)

    //Debugging
    // for (var i = 0; i < thresh.length * 4; i += 1) {
    //     imgData.data[i] = (thresh[Math.floor(i / 4)] * 255)
    //     if ((i + 1) % 4 == 0)
    //         imgData.data[i] = 255
    // }
    // ctx.putImageData(imgData, 0, 0)

    // ccc = document.getElementById('outcanvas')
    // ccc.width = 200
    // ccc.height = 200
    // cctt = ccc.getContext('2d')
    // cctt.imageSmoothingEnabled = false
    // cctt.drawImage(temp_canvas, 0, 0, 200, 200)

    return thresh

}
function argmax(arr) {
    return arr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
}

//Takes rgba and turns it into grayscale with 1 channel and thresholded image
function imageThreshold(image, thresh_val, max) {
    var out = []
    for (var i = 0; i < image.length; i += 4) {
        let avg = (image[i] + image[i + 1] + image[i + 2]) / 3
        if (avg > thresh_val) {
            // image[i] = max;
            out.push(max)
        }
        else {
            out.push(0)
            // image[i] = 0;
        }
    }
    return out
}
//Returns the max and min values of strokes
function max_min(strokes) {

    let max_x = Number.MIN_VALUE
    let min_x = Number.MAX_VALUE
    let max_y = Number.MIN_VALUE
    let min_y = Number.MAX_VALUE

    for (let i = 0; i < strokes.length; i++) {
        for (let ii = 0; ii < strokes[i].length; ii++) {
            val_x = strokes[i][ii].x
            max_x = Math.max(max_x, val_x)
            min_x = Math.min(min_x, val_x)

            val_y = strokes[i][ii].y
            max_y = Math.max(max_y, val_y)
            min_y = Math.min(min_y, val_y)
        }
    }


    return [max_x, min_x, max_y, min_y]
}

