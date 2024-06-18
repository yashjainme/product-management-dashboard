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

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    console.log(query, typeof(query));

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();

        const database = client.db('stock');
        const inventory = database.collection('inventory');

        const products = await inventory.aggregate([
            {
                $match: {
                    $or: [
                        { slug: { $regex: query, $options: 'i' } }, // Case-insensitive regex match on slug
                        // Add more fields for searching here if needed
                    ],
                },
            }
        ]).toArray();

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


