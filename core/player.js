import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import ytsr from 'ytsr';
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
                // Play audio
                connection.play(ytdl(url, { quality: 'highestaudio' }));

                ytdl.getBasicInfo(url, (err, info) => {
                    // Start counting to end of video
                    this.endCheck(parseInt(info.length_seconds));
                    const thumbnail = info.player_response.videoDetails.thumbnail.thumbnails[0].url;
                    return message.video(info.title, info.author.name, info.video_url, this.queue.length, thumbnail);
                })
            })
    }

    stop() {
        this.queue = [];
        clearTimeout(this.endTimer);
        try {
            this.connection.disconnect();
        } catch(e) {
            return message.error('Cannot leave server when not in server');
        }
    }

    skip(amount) {
        if (!amount)
            amount = '1';
        amount = parseInt(amount);
        if (amount === 0 && typeof amount != 'number')
            return message.error('Skipping allows only numbers bigger than 0 as argument');

        console.log(amount);
        if (!this.looping) {
            for (let i = 0; i < amount; i++) {
                this.queue.shift();
            }
        }

        this.queueNext();
    }

    async queueGet() {
        // Show message that queue is loading because it takes some time to load if there are many videos
        if (this.queue.length > 3)
            message.simple('Loading queue...');
        let list = [];
        for await (let video of this.queue) {
            await ytdl.getBasicInfo(video).then(info => {
                list.push(info.title);
            })
        }
        message.queue('Curently in queue', list);
    }

    queueAdd(search, sendMessage = true) {
        if (!search) return message.error('Playing requires an argument');
        if (search.startsWith('http') && ytdl.validateURL(search)) {
            // Checks if the same video is added
            for (let item of this.queue) {
                if (ytdl.getVideoID(item) === ytdl.getVideoID(search)) return message.error('Cannot add the same video twice');
            }
            // Adds video to queue
            this.queue.push(search);
            if (sendMessage)
                message.queueAdd(1, this.queue.length);
            // Plays next video if only one video is in queue, used for initial play
            if (this.queue.length === 1) return this.queueNext();
        } else if (ytpl.validateURL(search)) {
            this.queueAddPlaylist(search);
        } else {
            ytsr(search, { limit: 1 }, (err, result) => {
                if (result.items.length === 0)
                    return message.error('Nothing found');
                return this.queueAdd(result.items[0].link);
            });
        }
    }

    queueAddPlaylist(search) {
        // Gets playlist id from search string
        let playlistId = (new URL(search)).searchParams.get('list');

        if (!playlistId)
            return message.error('Playlist does not exist');

        ytpl(playlistId, { limit: 40 }, (err, result) => {
            if (err)
                return message.error('Only playlists allowed as argument');
            for (let item of result.items) {
                this.queueAdd(item.url_simple, false);
            }
            return message.queueAdd(result.items.length, this.queue.length);
        })
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

    queueClear() {
        // Clear everything except playing track
        this.queue = [ this.queue[0] ];
        return message.simple('Succesfully cleared queue');
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
        if (typeof parseInt(search, 10) === 'number' && this.queue.length <= search) {
            return this.queue[parseInt(search, 10) - 1];
        }

        if (this.queue.includes(search)) {
            for (let [key, item] of this.queue) {
                if (item = search) return item;
            }
        }
        return false;
    }

    endCheck(time) {
        time += 2; // Add a couple of seconds because it takes time to initialize
        let counter = 0;
        this.endTimer = setTimeout(() => {
            this.skip();
        }, time * 1000)
    }
}

export default new Player();
