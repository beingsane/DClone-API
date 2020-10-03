import { Socket } from 'socket.io';
import { UserVoiceState } from '../../data/models/user';
import Users from '../../data/users';
import Deps from '../../utils/deps';
import { WebSocket } from '../websocket';
import WSEvent from './ws-event';

export default class implements WSEvent {
  on = 'VOICE_CHANNEL_UPDATE';

  constructor(private users = Deps.get<Users>(Users)) {}

  async invoke(ws: WebSocket, client: Socket, { channel, guild, user }) {
    const userId = ws.sessions.get(client.id);
    if (!userId) return;
    
    user = await this.users.get(userId);
    user.voice.channelId = channel.id;
    user.voice.guildId = guild.id;
    await user.save();

    ws.io.sockets.emit('VOICE_CHANNEL_UPDATE', { channel, guild, user });
  }
}