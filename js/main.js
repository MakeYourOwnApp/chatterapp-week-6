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

// function getLatestMessage() {
//     return 5;
// }

/** get date of latest message in the channel */
function getLatestMessage() {
    let length = currentChannel.messages.length;
    currentChannel.latestMessage = currentChannel.messages[length - 1].createdOn;
}


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
// document.getElementById('fab').addEventListener('click', createChannel);


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
    // $('#messages').scrollTop($('#message-area').prop('scrollHeight'));

    document.getElementById('message-input').value = '';
}
// TODO
// function createMessageElement(messageObject) {

// }

/**
 * This function clears the message view and shows the messages of the selected channel
 */
function showMessages() {
    // document.getElementById('chat-area').;
    // for (let i = 0; i < currentChannel.messages.length; i++) {
    //     document.getElementById('chat-area').append(currentChannel.messages[i]);
    // }
    {
        var e = "<hr/>";   
         
        for (let y=0; y<currentChannel.messages.length; y++)
        {
          e += `Element ${y} = ${currentChannel.messages[y].text}<br/>`;
        }
        document.getElementById("chat-area").innerHTML = e;
     }
}



/** Constructor Function for channels */
function Channel(text) {
    this.name = text;
    this.latestMessage = Date.now();
    this.favorite = false;
    this.messages = [];
}

function createChannel() {
    var name = document.getElementById('#new-channel').value;
    var text = document.getElementById('message-input').value;

    var channel = new Channel(name);
    currentChannel = channel;
    channels.push(channel);

    document.getElementById('channels ul').append(createChannelElement(channel));

    console.log('New channel: ' + channel);
    // send initial message into channel
    sendMessage();

    // return to normal view
    // TODO
    // abortCreationMode();

}

/* liking a channel on #click */
// function star() {

// }




/**
 * This function enables the "create new channel"-mode
 */
// function initCreationMode() {
//     $('#app-bar-messages').hide();
//     $('#app-bar-create').addClass('show');
//     $('#messages').empty();
//     $('#button-send').hide();
//     $('#button-create').show();
// }

// /**
//  * This function aborts the "create new channel"-mode
//  */
// function abortCreationMode() {
//     $('#app-bar-messages').show();
//     $('#app-bar-create').removeClass('show');
//     $('#button-create').hide();
//     $('#button-send').show();
// }