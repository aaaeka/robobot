import message from './message.js';
import player from './player.js';

/*
Command order:
command with a typo
short-hand for command
full command
*/

class Execute {
    command(prefix, command, suffix) {
        switch(command) {
            case 'paly':
            case 'p':
            case 'play':
                return player.queueAdd(suffix);
                break;
            case 'lsit':
            case 'list':
                return player.queueAddPlaylist(suffix);
                break;
            case 'sikp':
            case 's':
            case 'skip':
                return player.skip(suffix);
                break;
            case 'q':
            case 'queue':
                return player.queueGet();
                break;
            case 'rem':
            case 'remove':
                return player.queueRemove(suffix);
                break;
            case 'stop':
                return player.stop();
                break;
            case 'clear':
                return player.queueClear();
                break;
            case 'loop':
                return player.queueLoopToggle();
            default:
                if (prefix) return message.error('Command does not exist');
        }
    }
}

 export default new Execute();
