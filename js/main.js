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
        const channelString = ` <li id="` + channel.id + `" onclick="switchChannel(this.id)">
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
function switchChannel(selectedChannelID) {
    console.log("selected channel with id: " + selectedChannelID)
    if (!!currentChannel){
        document.getElementById(currentChannel.id).classList.remove("selected")
    }
    document.getElementById(selectedChannelID).classList.add("selected")
    channels.forEach(channel => {
        if (channel.id === selectedChannelID ) {
            currentChannel = channel
        }  
    })
    // hide user prompt and show input area the first time a user selects a channel
    if(!!document.getElementById("select-channel")){
        document.getElementById("select-channel").style.display = "none";
        document.getElementById("input-area").style.display = "flex";
        document.getElementById("message-area-header").style.display = "flex";
    }
    showHeader();
    showMessages();
}

function showHeader(){
    document.getElementById("message-area-header").getElementsByTagName('h1')[0].innerHTML = currentChannel.name;
    document.getElementById('favorite-button').innerHTML = (currentChannel.favorite)? "favorite" : "favorite_border";
}

/** Constructor Function for channels */
function Channel(name) {
    this.id = Math.random().toString(36).substr(2, 10);
    this.name = name;
    this.favorite = false;
    this.messages = [];
}

Channel.prototype.latestMessage = function() {
    if (!!this.messages.length){
        const latest = new Date(Math.max(...this.messages.map(x => x.createdOn)));
        return latest.toLocaleTimeString("de-DE", {hour:"numeric", minute:"numeric"})
        } else {
           return "No Messages"
    }
}

document.getElementById('fab').addEventListener('click', () => {
    document.getElementById('modal').style.display = "flex";
});

document.getElementById('cancel-button').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none";
    document.getElementById('channel-name').value = '';
});

document.getElementById('check-button').addEventListener('click', createChannel);
document.getElementById('channel-name').onkeydown = function(e){
    if(e.keyCode == 13){
        createChannel();
    }
 };

function createChannel() {
    const channelName = document.getElementById('channel-name').value;
    // check if input is empty
    if (!!channelName) {
        const channel = new Channel (channelName)
        console.log("New Channel: ", channel);
        channels.push(channel);
        document.getElementById('channel-name').value = '';
        document.getElementById('modal').style.display = "none";
        currentChannel = channel;
        displayChannels();
        switchChannel(channel.id);
    } else {
        return
    }
}

document.getElementById('favorite-button').addEventListener('click', favoriteChannel)

function favoriteChannel(){
    currentChannel.favorite = (currentChannel.favorite) ? false : true;
    channels.forEach(channel => {
        if(channel.id === currentChannel.id){
            channel = currentChannel;
        }
    })
    displayChannels();
    switchChannel(currentChannel.id)
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


function sendMessage() {
    const input = document.getElementById('message-input').value;
    // check if input is empty
    // TODO change color of send button
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

