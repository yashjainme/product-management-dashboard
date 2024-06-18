// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";




// const MONGODB_URI = process.env.MONGODB_URI;


// export async function POST(request) {
//     let {action, slug, initialQuantity} = await request.json()
// // Replace the uri string with your connection string.


// const client = new MongoClient(MONGODB_URI);

// try {
//     const database = client.db('stock');
//     const inventory = database.collection('inventory');

//     const filter = { slug: slug};
//     let newQuantity = action == "plus"?(parseInt(initialQuantity) +  1):(parseInt(initialQuantity) - 1)
//     // create a document that sets the plot of the movie
//     const updateDoc = {
//       $set: {
//         quantity: newQuantity
//       },
//     };
//     const result = await inventory.updateOne(filter, updateDoc, {});
    
//     return NextResponse.json({success: true,  message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
//   } finally {
//     await client.close();
//   }


// }





















import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db('stock');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function POST(request) {
  const { client, db } = await connectToDatabase();
  const { action, slug, initialQuantity } = await request.json();

  try {
    const inventory = db.collection('inventory');
    const filter = { slug: slug };
    const newQuantity = action === "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1);

    const updateDoc = {
      $set: { quantity: newQuantity },
    };
    
    const result = await inventory.updateOne(filter, updateDoc, {});
    
    return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ success: false, error: 'Error updating inventory' });
  } finally {
    // Note: Do not close the client connection as it is cached
  }
}
