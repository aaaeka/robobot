import ytdl from 'ytdl-core';

class Song {
    build(url, msg) {
        return new Promise(async resolve => {
            const info = await ytdl.getBasicInfo(url).then(info => {
                return info;
            })

            resolve({
                msg: msg,
                url: url,
                title: info.title,
                author: info.author.name,
                avatar: info.author.avatar,
                userUrl: info.author.channel_url,
                thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[1].url,
                length: parseInt(info.length_seconds)
            });
        })
    }
}

export default new Song();