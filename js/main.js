/* start the external action and say hello */
console.log("App is alive");

let channels = [];
let messages = [];

/** create global variable for the currently selected channel */
let currentChannel;

// Functions to execute when DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("App is initialized")
    getChannels();
    getMessages();
    loadMessagesIntoChannel();
    displayChannels();
    loadEmojis();
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

/** 
 * Switches channel 
 * @param {string} selectedChannelID - ID of channel to switch to.
 */
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

// changes header name and favorite button
function showHeader(){
    document.getElementById("message-area-header").getElementsByTagName('h1')[0].innerHTML = currentChannel.name;
    document.getElementById('favorite-button').innerHTML = (currentChannel.favorite)? "favorite" : "favorite_border";
}

/** 
 * Channel Constructor Function
 * @param {string} name - Name of the channel.
 */
function Channel(name) {
    this.id = Math.random().toString(36).substr(2, 10);
    this.name = name;
    this.favorite = false;
    this.messages = [];
}

// Object method that returns the date of the latest message
Channel.prototype.latestMessage = function() {
    if (!!this.messages.length){
        const latest = new Date(Math.max(...this.messages.map(x => x.createdOn)));
        return latest.toLocaleTimeString("de-DE", {hour:"numeric", minute:"numeric"})
        } else {
           return "No Messages"
    }
}

// Event listener: New channel modal is shown if users clicks on floating action button
document.getElementById('fab').addEventListener('click', () => {
    document.getElementById('modal').style.display = "flex";
});

// Event listener: New channel modal is hidden if users clicks on cancel button
document.getElementById('cancel-button').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none";
    document.getElementById('channel-name').value = '';
});

// Event listener: New channel will be created if users clicks on check button or presses enter
document.getElementById('check-button').addEventListener('click', createChannel);
document.getElementById('channel-name').onkeydown = function(e){
    if(e.keyCode == 13){
        createChannel();
    }
 };

// New channel is created with value from input. Return if input is empty
function createChannel() {
    const channelName = document.getElementById('channel-name').value;
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

// Event listener: Call favoriteChannel() if user clicks on favorite button
document.getElementById('favorite-button').addEventListener('click', favoriteChannel)

// Toggles favorite property of channel and displays channel accordingly in sidebar
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

/** 
 * Message Constructor Function
 * @param {string} user - Name of sender.
 * @param {boolean} own - Own (outgoing) message or incoming.
 * @param {string} text - Message text.
 * @param {string} channelID - ID of channel in which message is sent.
 */
function Message(user, own, text, channelID) {
    this.createdBy = user;
    this.createdOn = new Date (Date.now());
    this.own = own;
    this.text = text;
    this.channel = channelID;
}

// Event Listener: New message will be sent if user clicks send button or presses enter.
// send button is grayed out if there is no input provided
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').onkeyup = function(e){
    if (!!document.getElementById('message-input').value) {
        document.getElementById('send-button').style.color = "#00838f"
    } else {
        document.getElementById('send-button').style.color = "#00838f54";
    }
    if(e.keyCode == 13){
        sendMessage()
    }
 };


 // Check if input is provided, send message, and clear input. Return if not.
function sendMessage() {
    const text = document.getElementById('message-input').value;
    if (!!text) {
        const myUserName = "Basti";
        const own = true;
        const channelID = currentChannel.id;
        const message = new Message (myUserName, own, text, channelID)
        console.log("New message: ", message);
        currentChannel.messages.push(message);
        document.getElementById('message-input').value = '';
        document.getElementById('send-button').style.color = "#00838f54";
        showMessages();
        setTimeout(receiveEchoMessage, 1500);
    } else {
        return
    }
}


// Show the messages of the selected channel
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

// get an echo message
function receiveEchoMessage() {
    const userName = "Lorenz";
    const own = false;
    const text = "You wrote: " + currentChannel.messages.slice(-1)[0].text;
    const channelID = currentChannel.id;
    const message = new Message (userName, own, text, channelID);
    currentChannel.messages.push(message);
    showMessages();
}

// --------------------- Emojis ----------------------------

// load emojis into div
function loadEmojis() {
    for (let i = 0; i < emojis.length; i++) {
        document.getElementById("emoji-list").innerHTML += `<span class="button">` + emojis[i] + `</span>`
    }
    const emojisInArea = document.getElementById('emoji-list').childNodes 
    for (let i = 0; i < emojisInArea.length; i++) {
        emojisInArea[i].addEventListener('click', function(){
            document.getElementById('message-input').value += this.innerHTML;
            document.getElementById('send-button').style.color = "#00838f";
        });
    }
}

document.getElementById('emoticon-button').addEventListener('click', toggleEmojiArea);

function toggleEmojiArea(){
    const emojiArea = document.getElementById('emoji-area');
    const chatArea = document.getElementById('chat-area');
    emojiArea.classList.toggle('toggle-area');
    chatArea.style.height = (emojiArea.classList.contains('toggle-area')) ? "calc(100vh - 132px - 250px)" : "calc(100vh - 132px)";
    chatArea.scrollTop = chatArea.scrollHeight;
}
