import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/ws',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(WebsocketGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        this.logger.log(`Message received from ${client.id}: ${JSON.stringify(data)}`);

        // Broadcast to all clients
        this.server.emit('message', {
            clientId: client.id,
            data,
            timestamp: new Date().toISOString(),
        });

        return { success: true, message: 'Message received' };
    }

    @SubscribeMessage('join-room')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        client.join(room);
        this.logger.log(`Client ${client.id} joined room: ${room}`);
        return { success: true, room };
    }

    @SubscribeMessage('leave-room')
    handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        client.leave(room);
        this.logger.log(`Client ${client.id} left room: ${room}`);
        return { success: true, room };
    }

    // Method to emit events from other parts of the application
    sendToAll(event: string, data: any) {
        this.server.emit(event, data);
    }

    sendToRoom(room: string, event: string, data: any) {
        this.server.to(room).emit(event, data);
    }
}
