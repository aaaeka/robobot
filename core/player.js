import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import ytsr from 'ytsr';
import message from './message.js';
import song from './song.js';

class Player {
    constructor() {
        this.queue = [];
        this.looping = false;
    }

    play(song) {
        song.msg.member.voice.channel.join()
            .then(connection => {
                this.connection = connection;
                // Play audio
                connection.play(ytdl(song.url, { audioonly: 'true' }));

                // Start counting to end of video
                this.endCheck(song.length);
                return message.video(song.title, song.author, song.video_url, this.queue.length, song.thumbnail, song.avatar, song.userUrl);
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

    skip(amount = 1) {
        if (!amount)
            amount = '1';
        amount = parseInt(amount);
        if (amount === 0 && typeof amount != 'number')
            return message.error('Skipping allows only numbers bigger than 0 as argument');
        if (!this.looping) {
            for (let i = 0; i < amount; i++) {
                this.queue.shift();
            }
        }

        this.queueNext();
    }

    queueGet() {
        let list = [];
        for (let song of this.queue) {
            list.push(`${song.author} - ${song.title}`);
        }
        message.queue('Curently in queue', list);
    }

    queueAdd(search, sendMessage = true) {
        if (!search) return message.error('Playing requires an argument');
        // For URLs
        if (search.startsWith('http') && ytdl.validateURL(search)) {
            // Checks if the same video is added
            for (let item of this.queue) {
                if (ytdl.getVideoID(item.url) === ytdl.getVideoID(search)) return message.error('Cannot add the same video twice');
            }
            // Adds video to queue
            return new Promise(resolve => {
                song.build(search, global.msg).then(song => {
                    this.queue.push(song);
                    // Sends message if sendMessage === true
                    if (sendMessage) message.queueAdd(song.title, this.queue.length);
                    // Plays next video if only one video is in queue, used for initial play
                    if (this.queue.length === 1) this.queueNext();
                    resolve();
                })
            })
        }
        // For playlists (currently disabled because of parsing problems)
        // if (search.startsWith('http') && ytpl.validateURL(search)) {
        //     return this.queueAddPlaylist(search);
        // } 
        // For searches
        ytsr(search, { limit: 1 }, (err, result) => {
            if (result.items.length === 0) return message.error('Nothing found');
            return this.queueAdd(result.items[0].link);
        });
    }

    queueAddPlaylist(search) {
        // Gets playlist id from search string
        const playlistId = new URL(search).searchParams.get('list');

        if (!playlistId)
            return message.error('Playlist does not exist');

        ytpl(playlistId, { limit: 40 }, async (err, result) => {
            if (err) return message.error('Only playlists allowed as argument');
            message.queueAdd(result.items.length, this.queue.length);
            for await (let item of result.items) {
                await this.queueAdd(item.url_simple, false);
            }
        })
    }

    queueRemove(search) {
        const video = this.queue[parseInt(search) - 1];;
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

    queueShuffle() {
        const currentlyPlaying = this.queue[0];
        this.queue.shift();
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
        this.queue.unshift(currentlyPlaying);
        return message.simple('Succesfully shuffled queue');
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
        this.looping = false;
        return message.simple('Looping off', '#f3fc71');
        
    }

    endCheck(time) {
        time += 1; // Add a second because it takes time to initialize
        this.endTimer = setTimeout(() => {
            this.skip();
        }, time * 1000)
    }
}

export default new Player();
