const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Check if we're running in the Firebase emulator
const EMULATOR = process.env.FUNCTIONS_EMULATOR === 'true';

// Initialize the app
admin.initializeApp();

// Get a reference to Firestore
const db = admin.firestore();

function getTimestamp() {
  return EMULATOR ? new Date() : admin.firestore.FieldValue.serverTimestamp();
}

exports.getAuction = functions.https.onCall(async (data, context) => {
  const { auctionId } = data;
  
  if (!auctionId || typeof auctionId !== 'string' || auctionId.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid auction ID');
  }

  try {
    const auctionDoc = await db.collection('auctions').doc(auctionId).get();
    
    if (!auctionDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Auction not found');
    }
    
    return auctionDoc.data();
  } catch (error) {
    console.error("Error fetching auction:", error);
    throw new functions.https.HttpsError('internal', 'Error fetching auction data');
  }
});

exports.placeBid = functions.https.onCall(async (data, context) => {
  const { auctionId, bidAmount, userId } = data;
  
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to place a bid');
  }

  const auctionRef = db.collection('auctions').doc(auctionId);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const auctionDoc = await transaction.get(auctionRef);
      
      if (!auctionDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Auction not found');
      }
      
      const auctionData = auctionDoc.data();
      
      if (bidAmount <= auctionData.currentBid) {
        throw new functions.https.HttpsError('failed-precondition', 'Bid amount must be higher than current bid');
      }
      
      // Check if the auction has ended, if endTime is defined
      if (auctionData.endTime && auctionData.endTime instanceof admin.firestore.Timestamp) {
        if (auctionData.endTime.toDate() < new Date()) {
          throw new functions.https.HttpsError('failed-precondition', 'Auction has ended');
        }
      } else {
        console.warn(`Auction ${auctionId} does not have a valid endTime`);
      }
      
      let now = getTimestamp();
      
      // Update the auction document
      transaction.update(auctionRef, {
        currentBid: bidAmount,
        currentWinner: userId,
        lastBidTime: now
      });

      // Add the bid to the bids subcollection
      const bidRef = auctionRef.collection('bids').doc();
      transaction.set(bidRef, {
        amount: bidAmount,
        userId: userId,
        timestamp: now
      });

      return { 
        ...auctionData, 
        currentBid: bidAmount, 
        currentWinner: userId,
        lastBidTime: now
      };
    });

    return result;
  } catch (error) {
    console.error("Error in placeBid transaction:", error);
    throw new functions.https.HttpsError('internal', error.message || 'An error occurred while placing the bid');
  }
});