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
            case 'stop':
                return player.stop();
                break;
            default:
                if (prefix) return message.error('Command does not exist');
        }
    }
}

 export default new Execute();
