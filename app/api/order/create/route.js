import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        await connectDB();

        // Populate product details for each item
        const populatedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                return {
                    product: {
                        _id: product._id,
                        name: product.name,
                        offerPrice: product.offerPrice
                    },
                    quantity: item.quantity
                };
            })
        );

        // calculate amount using populated items
        const amount = populatedItems.reduce((acc, item) => {
            return acc + item.product.offerPrice * item.quantity;
        }, 0)

        const finalAmount = amount + Math.floor(amount * 0.02);

        // Create order directly in database
        const orderData = {
            userId,
            items: populatedItems,
            amount: finalAmount,
            address,
            date: Date.now()
        };

        const createdOrder = await Order.create(orderData);
        console.log('Order created successfully:', createdOrder._id);

        // clear user cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({ 
            success: true, 
            message: 'Order Placed',
            orderId: createdOrder._id
        })

    } catch (error) {
        console.log('Order creation error:', error)
        return NextResponse.json({ success: false, message: error.message })
    }
}