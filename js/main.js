/* start the external action and say hello */
console.log("App is alive");

/** create your user */
var myUser = "Basti";

/** create global variable for the currently selected channel */
var currentChannel;

/** initialize the currently selected channel */
currentChannel = meetUp;

/** initialize the app as soon as the DOM is completely loaded */
window.onload = initializeApp;

function initializeApp() {
    console.log('App is initialized!');
    // listChannels();
}



/** Constructor Function for messages */
function Message(text) {
    this.createdBy = myUser;
    this.createdOn = Date.now();
    this.own = true;
    this.text = text;
}

document.getElementById('send-button').addEventListener('click', sendMessage);


function sendMessage() {
    // #10 only send #messages if text is not #empty
    var text = document.getElementById('message-input').value;

    if (text.length == 0) {
        //exit if no text
        alert("Please enter some text");
        return;
    }

    var message = new Message(text);
    console.log("New message: ", message);

    currentChannel.messages.push(message);

    // // Adding the message to the messages-div
    // $('#messages').append(createMessageElement(message));

    // // messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    document.getElementById('message-input').value = '';
}




/** Constructor Function for channels */
function Channel(text) {
    this.name = text;
    this.latestMessage = Date.now();
    this.favorite = false;
    this.messages = [];
}