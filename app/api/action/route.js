import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";




const MONGODB_URI = process.env.MONGODB_URI;


export async function POST(request) {
    let {action, slug, initialQuantity} = await request.json()
// Replace the uri string with your connection string.


const client = new MongoClient(MONGODB_URI);

try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    const filter = { slug: slug};
    let newQuantity = action == "plus"?(parseInt(initialQuantity) +  1):(parseInt(initialQuantity) - 1)
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        quantity: newQuantity
      },
    };
    const result = await inventory.updateOne(filter, updateDoc, {});
    
    return NextResponse.json({success: true,  message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
  } finally {
    await client.close();
  }


}















