Webcam.set({
    width: 640,
    height: 480,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach( '#my_camera' );

// id_number variable has to be on global 
// to generate unique id for newly captured user
var id_number = 0;
var id_name = "person_" + id_number;
var img_width;
var img_height;
var option_val = 16;
var selectMask = document.querySelector('#selectmask');

// take snapshot and get image data
function take_snapshot(userName) {

    // Clears out the form for the Entering the name.
    document.querySelector('#user_name').value = '';
    // console.log('take_snapshot(e)', userName);
    
    Webcam.snap( function(data_uri) {
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


        // ************** Newly added captured users **************
        // If the user added their name when capturing their face, the user can user their name on the UI.
        if (userName) {
            id_name = userName;
        } else { // If not, the user then just use a default value (person_1, person_2 etc...)
            id_number += 1; // Update the id number
            id_name = "person_" + id_number;
        }
        // Append the newly captured user to images lists
        images.push({"id":id_name, "path":data_uri});
        

        // ************** Update the option in select menu **************
        option_val += 1;
        createOption(id_name);


        // ************** Track the captured image **************
        // console.log(ntracker);
        loadMask(images.length-1); // ??
        animateClean();

    } );

}



// ************** Track the captured image - Continued **************
var ntracker = new clm.tracker({stopOnConvergence : true});
ntracker.init();

// ntracker.start(capturedImageElement);

var resultsOverlay = document.querySelector('#results_overlay');
// console.log(resultsOverlay);
var resultsOverlayCC = resultsOverlay.getContext('2d');

var newImagePositions = ntracker.getCurrentPosition();
// ntracker.draw(resultsOverlay);

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

    document.addEventListener("clmtrackrConverged", function(event) {
        document.querySelector('#captured_complete').innerHTML = "CAPTURED!";
    
        cancelAnimationFrame(drawRequest);
    
        // Need to save the coordinate for the user
        // console.log(ntracker.getCurrentPosition());
        masks[id_name] = ntracker.getCurrentPosition();
    }, false);

}


function createOption(id) {
    console.log(id);
    // console.log(id_number);
    // create new option element
    var opt = document.createElement('option');
    // create text node to add to option element (opt)
    opt.appendChild( document.createTextNode(id));
    // set value property of opt
    opt.value = option_val; 
    // add opt to end of select box (sel)
    selectMask.appendChild(opt); 

    // startVideo();
    console.log(masks);
    console.log(images);
}