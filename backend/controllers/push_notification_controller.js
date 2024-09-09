const admin = require("firebase-admin");
const dotenv = require("dotenv").config({ path: "./.env" });

const serviceAccount = JSON.parse(process.env.FIREBASE_API_SECRETE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

///This function sends a notification to the client specific device using the [token] as an identifier for the users device
const sendPushNotification = (payload) => {
  try {
    admin
      .messaging()
      .send(payload)
      .then((response) => {
        console.log("Notification sent successfully");
        console.log(response);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendPushNotification = sendPushNotification;
