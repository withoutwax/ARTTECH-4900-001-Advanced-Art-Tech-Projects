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
            capturedImageElement.drawImage(img, 0, 0, 800, 600);
        };
        img.src = data_uri;
        
        // ************** Newly added captured users **************
        // TODO:
        // Need to append the newly captured user to images lists
        images.push({"id":id, "path":data_uri});
        console.log(images);



        // ************** Track the captured image **************
        console.log(ntracker);
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
console.log(resultsOverlay);
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
    drawLoop();
}

function animate(box) {
    ntracker.start(document.querySelector('#results'));
    drawLoop();
}

function drawLoop() {
    drawRequest = requestAnimationFrame(drawLoop);
    resultsOverlayCC.clearRect(0, 0, 800, 600);
    if (ntracker.getCurrentPosition()) {
        ntracker.draw(resultsOverlay);
    }

}

document.addEventListener("clmtrackrConverged", function(event) {
    document.querySelector('#captured_complete').innerHTML = "CAPTURED!";

    cancelAnimationFrame(drawRequest);

    // Need to save the coordinate for the user
    console.log(ntracker.getCurrentPosition());
    masks[id] = ntracker.getCurrentPosition();
    console.log(masks);
}, false);