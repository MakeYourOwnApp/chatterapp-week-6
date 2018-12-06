/* start the external action and say hello */
console.log("App is alive");

/** create your user */
var myUser = "Basti";

/** create global variable for the currently selected channel */
var currentChannel;

/** initialize the currently selected channel */
currentChannel = meetUp;

/** Constructor Function for messages */
function Message(text) {
    this.createdBy = myUser;
    this.createdOn = new Date.now();
    this.own = true;
    this.text = text;
}

function sendMessage() {
    // #10 only send #messages if text is not #empty
    var text = document.getElementById('message').value;

    //check text
    if (text.length == 0) {
        //exit if no text
        alert("Please enter some text");
        return;
    }
}



/** Constructor Function for channels */
function Channel(text) {
    this.name = text;
    this.latestMessage = new Date.now();
    this.favorite = false;
    this.messages = [];
}