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

function take_snapshot() {
    // take snapshot and get image data
    Webcam.snap( function(data_uri) {
        // display results in page
        
        // downloading the image
        // download(data_uri, "person.jpg", "image/jpg");
        
        // previewing the image
        // console.log(data_uri);
        // window.open(data_uri);
        
        // ************** Newly added captured users **************
        // Todo -
        // Need to append the newly captured user to images lists
        var id = "person_" + id_number;
        var path = "./media/";
        images.push({"id":id, "path":data_uri});
        // Update the id number
        id_number += 1;

        // ************** Track the captured image **************
        var ntracker = new clm.tracker();
        ntracker.init();

        var capturedImageElement = document.querySelector('#results');
        ntracker.start(capturedImageElement);

        var newImagePositions = ntracker.getCurrentPosition();
        var drawCanvas = document.querySelector('#results_sample_canvas');
        ntracker.draw(drawCanvas);
        console.log(newImagePositions);

        // Storing / downloading the image
        localStorage.setItem(data_uri, id);
        // console.log(localStorage);
        localStorage.clear();
            
        // console.log(images);

        document.getElementById('results').innerHTML = 
            '<h2>Here is your image:</h2>' + 
            '<img src="'+data_uri+'" download/>';
    } );
}