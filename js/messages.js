const mockMessages = [
    {
        createdBy: "Jack Blue",
        createdOn: new Date('December 08, 2018 17:24:00'),
        channel: "0nlbop5f1e",
        own: false,
        text: 'What\'s up?',
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1
        }
    },
    {
        createdBy: "Christina Buck",
        createdOn: new Date('December 08, 2018 17:24:00'),
        channel: "0nlbop5f1e",
        own: false,
        text: 'The new chatter app looks lit!',
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1
        }
    },
    {
        createdBy: "Sabrina Adams",
        createdOn: new Date('December 08, 2018 17:24:00'),
        channel: "0nlbop5f1e",
        own: false,
        text: 'Learning js is so much fun. What do you think about it?',
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1
        }
    },
    {
        createdBy: "Marco Boss",
        createdOn: new Date('December 08, 2018 17:24:00'),
        own: false,
        channel: "achndt7tst",
        text: 'I wanna go to Australia!',
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1
        }
    },
    {
        createdBy: "Jessie Franklin",
        createdOn: new Date('December 08, 2018 17:24:00'),
        channel: "achndt7tst",
        own: false,
        text: 'Me too',
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1
        }
    }
]