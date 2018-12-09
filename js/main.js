/* start the external action and say hello */
console.log("App is alive");

/** create your user */
const myUserName = "Basti";

let channels = [];
let messages = [];

/** create global variable for the currently selected channel */
let currentChannel;

document.addEventListener("DOMContentLoaded", () => {
    console.log("App is initialized")
    getChannels();
    getMessages();
    loadMessagesIntoChannel();
    displayChannels();
});


//---------------- Channels-----------------------------------

// get existing channels from mock file or database
function getChannels(){
    channels = mockChannels;
}

// get existing messages from mock file or database
function getMessages(){
    messages = mockMessages;
}

// load existing messages into respective channel
function loadMessagesIntoChannel() {
    channels.forEach(channel => {
        messages.forEach(message => {
            if (message.channel === channel.id) {
                channel.messages.push(message)
            }
        })
    })
}

// display channels in channel area 
function displayChannels() {
    const favoriteList = document.getElementById('favorite-channels');
    const regularList = document.getElementById('regular-channels');
    favoriteList.innerHTML = ""
    regularList.innerHTML = ""
    channels.forEach(channel => {
        const channelString = ` <li id="` + channel.id + `" onclick="switchChannel(this)">
                                    <i class="material-icons">group</i>
                                    <span class="channel-name">` + channel.name + `</span>
                                    <span class="timestamp">`+ channel.latestMessage() + `</span>
                                </li>`
        if (channel.favorite) {
            favoriteList.innerHTML += channelString
        } else {
            regularList.innerHTML += channelString
        }
    })
}

// switch channel on click
function switchChannel(selectedChannel) {
    console.log("selected channel with id: " + selectedChannel.id)
    if (!!currentChannel){
        document.getElementById(currentChannel.id).classList.remove("selected")
    }
    document.getElementById(selectedChannel.id).classList.add("selected")
    channels.forEach(channel => {
        if (channel.id === selectedChannel.id ) {
            currentChannel = channel
        }  
    })
    // hide user prompt and show input area the first time a user selects a channel
    if(!!document.getElementById("select-channel")){
        document.getElementById("select-channel").style.display = "none";
        document.getElementById("input-area").style.display = "flex";
    }
    showMessages()
}

/** Constructor Function for channels */
function Channel(name) {
    this.id = Math.random().toString(36).substr(2, 10);
    this.name = name;
    this.favorite = false;
    this.messages = [];
}

Channel.prototype.latestMessage = function() {
    if (!!this.messages){
        const latest = new Date(Math.max(...this.messages.map(x => x.createdOn)));
        return latest.toLocaleTimeString("de-DE", {hour:"numeric", minute:"numeric"})
        } else {
           return "No Messages"
    }
}

function createChannel() {

    const channelName = document.getElementById('#new-channel').value;
    const channel = new Channel(channelName);
    currentChannel = channel;
    channels.push(channel);

    document.getElementById('channels ul').append(createChannelElement(channel));

    console.log('New channel: ' + channel);

}

//---------------- Messages-----------------------------------

/** Constructor Function for messages */
function Message(text) {
    this.createdBy = myUserName;
    this.createdOn = new Date (Date.now());
    this.own = true;
    this.text = text;
    this.channel = currentChannel.id;
}

// execute sendMessage function when user clicks send button or presses enter
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').onkeydown = function(e){
    if(e.keyCode == 13){
        sendMessage()
    }
 };


// document.getElementById('fab').addEventListener('click', createChannel);


function sendMessage() {
    var input = document.getElementById('message-input').value;
    // check if input is empty
    if (!!input) {
        const message = new Message (input)
        console.log("New message: ", message);
        currentChannel.messages.push(message);
        document.getElementById('message-input').value = '';
        showMessages();
    } else {
        return
    }
}

/**
 * This function clears the message view and shows the messages of the selected channel
 */
function showMessages() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = ""
    currentChannel.messages.forEach(message => {
        const messageTime = message.createdOn.toLocaleTimeString("de-DE", {hour: "numeric", minute: "numeric"});
        let messageString;
        if (message.own){
            messageString =   `<div class="message outgoing-message">
                                    <div class="message-wrapper">
                                        <div class="message-content">
                                            <p>` + message.text + `</p>
                                        </div>
                                        <i class="material-icons">account_circle</i>
                                    </div>
                                    <span class="timestamp">`+ messageTime + `</span>
                                </div>`;
        } else {
            messageString =   `<div class="message incoming-message">
                                    <div class="message-wrapper">
                                        <i class="material-icons">account_circle</i>
                                        <div class="message-content">
                                            <h3>` + message.createdBy + `</h3>
                                            <p>` + message.text + `</p>
                                        </div>
                                    </div>
                                    <span class="timestamp">`+ messageTime + `</span>
                                </div>`;
        }
        chatArea.innerHTML += messageString;
    })
    chatArea.scrollTop = chatArea.scrollHeight;
    //update timestamp in channel area
    document.getElementById(currentChannel.id).querySelector(".timestamp").innerHTML = currentChannel.latestMessage();
}

