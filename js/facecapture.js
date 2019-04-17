Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach( '#my_camera' );

// id_number variable has to be on global 
// to generate unique id for newly captured user
var id_number = 0;
var id = "person_" + id_number;
var img_width;
var img_height;

function take_snapshot() {
    // take snapshot and get image data
    Webcam.snap( function(data_uri) {
        // downloading the image
        // download(data_uri, "person.jpg", "image/jpg");
        
        // previewing the image
        // console.log(data_uri);
        // window.open(data_uri);

        // Display results in page
        var capturedImageElement = document.querySelector('#results').getContext('2d');
        var img = new Image();
        img.onload = function() {
            capturedImageElement.drawImage(img, 0, 0, vid_width, vid_height);
            // console.log('width', img.width);
            // console.log('height', img.height);
            // console.log('img', img);
        };
        img.src = data_uri;

        // sendFile(data_uri);
        // saveImage(data_uri);

        
        // ************** Newly added captured users **************
        // Append the newly captured user to images lists
        images.push({"id":id, "path":data_uri});
        // console.log(images);


        // create canvases for all the faces
//imageCanvases = {};
//load masks
//for (var i = 0;i < images.length;i++) {
    // imageCount++;
    loadMask(images.length-1);
//}






        // ************** Track the captured image **************
        // console.log(ntracker);
        animateClean();

        // Update the id number
        id_number += 1;
        
    } );

    
}



// ************** Track the captured image **************
var ntracker = new clm.tracker({stopOnConvergence : true});
ntracker.init();

// ntracker.start(capturedImageElement);

var resultsOverlay = document.querySelector('#results_overlay');
// console.log(resultsOverlay);
var resultsOverlayCC = resultsOverlay.getContext('2d');

var newImagePositions = ntracker.getCurrentPosition();
// ntracker.draw(resultsOverlay);


// Storing / downloading the image
// localStorage.setItem(data_uri, id);
// console.log(localStorage);
// localStorage.clear();
    
// console.log(images);

function animateClean() {
    ntracker.start(document.querySelector('#results'));
    drawLoop02();
}

function animate(box) {
    ntracker.start(document.querySelector('#results'));
    drawLoop02();
}

function drawLoop02() {
    drawRequest = requestAnimationFrame(drawLoop02);
    resultsOverlayCC.clearRect(0, 0, vid_width, vid_height);
    if (ntracker.getCurrentPosition()) {
        ntracker.draw(resultsOverlay);
    }

}

document.addEventListener("clmtrackrConverged", function(event) {
    document.querySelector('#captured_complete').innerHTML = "CAPTURED!";

    cancelAnimationFrame(drawRequest);

    // Need to save the coordinate for the user
    // console.log(ntracker.getCurrentPosition());
    masks[id] = ntracker.getCurrentPosition();
    // console.log(masks);
}, false);


// Image upload function
function sendFile(data) {
    // const uri = '/saveImage'
    // const xhr = new XMLHttpRequest()
    // const fd = new FormData()

    // xhr.open('POST', uri, true)
    // xhr.onreadystatechange = () => {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //     const imageName = xhr.responseText
    //     //do what you want with the image name returned
    //     //e.g update the interface
    //     }
    // }
    // fd.append('myFile', data)
    // xhr.send(fd)


    // var imgData = JSON.stringify(data);
    // $.ajax({
    //     url: '/saveImage/',
    //     dataType: 'json',
    //     data: imgData,
    //     type: 'POST',
    //     headers: {
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     success: function(data) {
    //         console.log(data);
    //     },
    //     error: function(err) {
    //         console.log("some error", err);
    //     }
    // });
}

function saveImage(data) {

    
}
  // Generate the image file
// var image = Canvas2Image.saveAsPNG(canvas, true);   

// image.id = "canvasimage";
// canvas.parentNode.replaceChild(image, canvas);

// var url = 'hidden.php',
// data = $('#canvasimage').attr('src');

