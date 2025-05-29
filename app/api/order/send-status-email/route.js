
import { sendOrderStatusEmail } from '@/lib/emailService';
import Order from '@/models/Order';
import  connectDB  from '@/config/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, newStatus } = await request.json();

        if (!orderId || !newStatus) {
            return NextResponse.json({ success: false, message: 'Order ID and status are required' });
        }

        await connectDB();
        
        // Find the order and populate address
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' });
        }

        // Send status update email
        const emailResult = await sendOrderStatusEmail({
            address: order.address,
            orderId: order._id
        }, newStatus);

        if (emailResult.success) {
            return NextResponse.json({ 
                success: true, 
                message: 'Status email sent successfully',
                messageId: emailResult.messageId
            });
        } else {
            return NextResponse.json({ 
                success: false, 
                message: 'Failed to send email',
                error: emailResult.error
            });
        }

    } catch (error) {
        console.error('Error sending status email:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
