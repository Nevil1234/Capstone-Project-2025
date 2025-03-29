// import { connectToDB } from '@/lib/db';
// import { NextApiRequest, NextApiResponse } from 'next';
// import ProductSale from '@/models/ProductSale';
// import User from '@/models/User';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { orderId, productId, walletAddress } = req.body;

//   try {
//     await connectToDB();

//     // Verify sale record exists
//     const saleRecord = await ProductSale.findOne({
//       orderId,
//       productId,
//       walletAddress
//     });

//     if (!saleRecord) {
//       return res.status(404).json({ message: 'No matching sale record found' });
//     }

//     // Update user's wardrobe
//     const user = await User.findOneAndUpdate(
//       { walletAddress },
//       { 
//         $addToSet: { 
//           wardrobe: {
//             productId,
//             name: saleRecord.productName,
//             brand: saleRecord.brand,
//             image: saleRecord.image,
//             addedAt: new Date()
//           }
//         } 
//       },
//       { new: true, upsert: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Product added to wardrobe',
//       wardrobe: user.wardrobe
//     });

//   } catch (error) {
//     console.error('Verification error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }