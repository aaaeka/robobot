import ytdl from 'ytdl-core';
import message from './message.js';

class Player {
    constructor() {
        this.queue = [];
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
        this.queue.shift();
        this.queueNext();
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

    queueRemove() {

    }

    queueNext() {
        clearTimeout(this.endTimer);
        if (this.queue.length === 0) return this.stop();
        this.play(this.queue[0]);
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
