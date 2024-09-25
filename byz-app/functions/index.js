const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.onNewAuction = functions.firestore
    .document('auctions/{auctionId}')
    .onCreate((snap, context) => {
      const newAuction = snap.data();
      console.log(`New auction created: ${context.params.auctionId}`, newAuction);
      // Add your auction creation logic here
      return null;
    });

exports.onBidPlaced = functions.firestore
    .document('auctions/{auctionId}/bids/{bidId}')
    .onCreate((snap, context) => {
      const newBid = snap.data();
      console.log(`New bid placed: ${context.params.bidId}`, newBid);
      // Add your bid processing logic here
      return null;
    });