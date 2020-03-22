import message from './message.js';
import player from './player.js';

class Execute {
    command(prefix, command, suffix) {
        switch(command) {
            case 'play':
                return player.queueAdd(suffix);
                break;
            case 'skip':
                return player.skip();
                break;
            case 'queue':
                return player.queueGet();
            case 'remove':
                return player.queueRemove(suffix);
                break;
            case 'stop':
                return player.stop();
                break;
            case 'loop':
                return player.queueLoopToggle();
            default:
                if (prefix) return message.error('Command does not exist');
        }
    }
}

 export default new Execute();
