import ytdl from 'ytdl-core';
import message from './message.js';

class Player {
    constructor() {
        this.queue = [];
        this.looping = false;
    }

    play(url) {
        global.msg.member.voice.channel.join()
            .then(connection => {
                this.connection = connection;
                //Play audio
                connection.play(ytdl(url, { quality: 'highestaudio' }));
                //Start counting to end of video
                ytdl.getBasicInfo(url, (err, info) => {
                    this.endCheck(parseInt(info.length_seconds));
                })

            })
        //TODO: add playing from playlist and search
    }

    stop() {
        this.queue = [];
        clearTimeout(this.endTimer);
        this.connection.disconnect();
    }

    skip() {
        if (!this.looping)
            this.queue.shift();
        this.queueNext();
    }

    async queueGet() {
        let list = [];
        for await (let video of this.queue) {
            await ytdl.getBasicInfo(video).then(info => {
                list.push(info.title);
            })
        }
        message.queue('Curently in queue', list);
    }

    queueAdd(url) {
        if (!url) return message.error('Playing requires an argument');
        if (!ytdl.validateURL(url)) return message.error('Can only play single video');
        for (let item of this.queue) {
            if (ytdl.getVideoID(item) === ytdl.getVideoID(url)) return message.error('Cannot add the same video twice');
        }
        this.queue.push(url);
        if (this.queue.length === 1) return this.queueNext();
    }

    queueRemove(search) {
        const video = this.queueFind(search);
        if (!video) return message.error('Could not find video to remove');
        if (video === this.queue[0]) return message.error('Cannot remove currently playing video');
        this.queue = this.queue.filter(item => video != item);
        return message.simple('Succesfully removed from queue');
    }

    queueNext() {
        clearTimeout(this.endTimer);
        if (this.queue.length === 0) return this.stop();
        this.play(this.queue[0]);
    }

    queueLoopToggle() {
        if (!this.looping) {
            this.looping = true;
            return message.simple('Looping on');
        }
        return message.simple('Looping off', '#f3fc71');
        return this.looping = false;
    }

    queueFind(search) {
        // Make user inputed command one less to make it 0 based
        if (typeof search === 'number' && this.queue.length < search--)
            return this.queue[search];
        if (this.queue.includes(search)) {
            for (let [key, item] of this.queue) {
                if (item = search) return item;
            }
        }
        return false;
    }

    endCheck(time) {
        time += 2; //Add a couple of seconds because it takes time to initialize
        let counter = 0;
        this.endTimer = setTimeout(() => {
            this.skip();
        }, time * 1000)
    }
}

export default new Player();
