import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as messaging from 'firebase-admin/messaging';

const app = admin.initializeApp({
  credential: admin.credential.cert('path/to/serviceAccountKey.json'),
  projectId: 'your-project-id',
});

const messagingClient = app.messaging();

@Injectable()
export class firebaseAdminService {
  constructor() {}

  async sendMultiMessage(data: messaging.Notification) {
    const message: messaging.MulticastMessage = {
      notification: {
        title: data.title,
        body: data.body,
      },
      tokens: await this.getTokens(),
    };

    return await messagingClient
      .sendMulticast(message)
      .then((response) => {
        console.log(
          'Successfully sent message to:',
          response.successCount,
          'devices',
        );
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  }

  async sendMessage(
    token: messaging.TokenMessage,
    data: messaging.Notification,
  ) {
    const message: messaging.Message = {
      notification: {
        title: data.title,
        body: data.body,
      },
      token: token.token,
    };

    messagingClient
      .send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  }

  async getTokens() {
    //TODO get from database
    return [];
  }
}
