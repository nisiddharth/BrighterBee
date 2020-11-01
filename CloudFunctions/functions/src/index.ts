import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();
const fcm = admin.messaging();

export const sendToDevice = functions.firestore
  .document('notification/{notificationId}')
  .onCreate(async snapshot => {


    const notification = snapshot.data();

    const querySnapshot = await db
       .collection('users')
       .doc(notification.receiver)
       .collection('tokens')
       .get();

    var community = notification.community;
    community = community.concat(',');
    var postId = notification.postId;
    postId = postId.concat(',');
    var id = community.concat(postId.toString());
    var name = notification.creator;
    var id2 = id.concat(name.toString());

     const tokens = querySnapshot.docs.map(snap => snap.id);

    const payload: admin.messaging.MessagingPayload = {
      notification: {
        title: notification.title,
        body: notification.body,
        icon: 'your-icon-url',
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      data: {
      	sound: 'default',
      	status: 'Comment',
      	id: id2
      }
    };

    return fcm.sendToDevice(tokens, payload);
  });

export const sendToDevicePendingUser = functions.firestore
  .document('pendingUserNotification/{notificationId}')
  .onCreate(async snapshot => {


    const notification = snapshot.data();

    const querySnapshot = await db
       .collection('users')
       .doc(notification.receiver)
       .collection('tokens')
       .get();

    var community = notification.community;

    const tokens = querySnapshot.docs.map(snap => snap.id);

    const payload: admin.messaging.MessagingPayload = {
      notification: {
        title: notification.title,
        body: notification.body,
        icon: 'your-icon-url',
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      data: {
      	sound: 'default',
      	status: 'Comment',
      	id: community
      }
    };

    return fcm.sendToDevice(tokens, payload);
  });
