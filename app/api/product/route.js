  // import { MongoClient } from "mongodb";
  // import { NextResponse } from "next/server";



  // const MONGODB_URI = process.env.MONGODB_URI;
  // export async function GET(request) {
  
  // // Replace the uri string with your connection string.


  // const client = new MongoClient(MONGODB_URI);


  //   try {
  //     const database = client.db('stock');
  //     const inventory = database.collection('inventory');

  //     // Query for a movie that has the title 'Back to the Future'
  //     const query = {  };
  //     const products = await inventory.find(query).toArray();

  //     // console.log(allProducts);
  //     return NextResponse.json({success: true,  products})
  //   } finally {
  //     // Ensures that the client will close when you finish/error
  //     await client.close();
  //   }


  // }

  // export async function POST(request) {
  //     let body = await request.json()
  // // Replace the uri string with your connection string.


  // const client = new MongoClient(MONGODB_URI);


  //   try {
  //     const database = client.db('stock');
  //     const inventory = database.collection('inventory');

  //     // Query for a movie that has the title 'Back to the Future'
      
  //     const product = await inventory.insertOne(body);

  //     console.log(product);
  //     return NextResponse.json({product, ok: true})
  //   } finally {
  //     // Ensures that the client will close when you finish/error
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
  
  export async function GET(request) {
    const { db } = await connectToDatabase();
    
    try {
      const inventory = db.collection('inventory');
      const products = await inventory.find({}).toArray();
      return NextResponse.json({ success: true, products });
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ success: false, error: 'Error fetching products' });
    }
  }
  
  export async function POST(request) {
    const { db } = await connectToDatabase();
    
    try {
      const inventory = db.collection('inventory');
      const body = await request.json();
      const product = await inventory.insertOne(body);
      return NextResponse.json({ product, ok: true });
    } catch (error) {
      console.error('Error inserting product:', error);
      return NextResponse.json({ success: false, error: 'Error inserting product' });
    }
  }
  