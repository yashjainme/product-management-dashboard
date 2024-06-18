import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";



const MONGODB_URI = process.env.MONGODB_URI;
export async function GET(request) {
 
// Replace the uri string with your connection string.


const client = new MongoClient(MONGODB_URI);


  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const products = await inventory.find(query).toArray();

    // console.log(allProducts);
    return NextResponse.json({success: true,  products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }


}

export async function POST(request) {
    let body = await request.json()
// Replace the uri string with your connection string.


const client = new MongoClient(MONGODB_URI);


  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    
    const product = await inventory.insertOne(body);

    console.log(product);
    return NextResponse.json({product, ok: true})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }


}






