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

export async function GET(request) {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();

        const database = client.db('stock');
        const inventory = database.collection('inventory');

        const query = {}; // Specify your query conditions here if needed
        const products = await inventory.find(query).toArray();

        // Deep copy products array before returning it
        const deepCopiedProducts = JSON.parse(JSON.stringify(products));

        return NextResponse.json({ success: true, products: deepCopiedProducts });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching products"
        });
    } finally {
        await client.close();
    }
}







export async function POST(request) {
  try {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();

      const { body } = request;
      const database = client.db('stock');
      const inventory = database.collection('inventory');

      const product = await inventory.insertOne(body);

      // Deep copy product inserted before returning it
      const deepCopiedProduct = JSON.parse(JSON.stringify(product.ops[0]));

      return NextResponse.json({ product: deepCopiedProduct, ok: true });
  } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({
          success: false,
          message: "An error occurred while inserting product"
      });
  } finally {
      await client.close();
  }
}