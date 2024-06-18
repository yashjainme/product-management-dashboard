// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";




// const MONGODB_URI = process.env.MONGODB_URI;

// export async function GET(request) {
// const query = request.nextUrl.searchParams.get("query");
// console.log(query, typeof(query));


// const client = new MongoClient(MONGODB_URI);


//   try {
//     const database = client.db('stock');
//     const inventory = database.collection('inventory');

//     // Query for a movie that has the title 'Back to the Future'
   
//     const products = await inventory.aggregate([{
//         $match: {
//           $or: [
//             { slug: { $regex: query, $options: 'i' } }, // Case-insensitive regex match on slug
//             // { quantity: { $regex: query, $options: 'i' } }, // Case-insensitive regex match on quantity
//             // { price: { $regex: query, $options: 'i' } }, // Case-insensitive regex match on price
//           ],
//         },
//       }]).toArray()

//     // console.log(allProducts);
//     return NextResponse.json({success: true,  products})
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
  const query = request.nextUrl.searchParams.get("query");
  console.log(query, typeof query);

  try {
    const inventory = db.collection('inventory');
    const products = await inventory.aggregate([{
      $match: {
        $or: [
          { slug: { $regex: query, $options: 'i' } },
        ],
      },
    }]).toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Error fetching products' });
  }
}
