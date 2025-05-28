import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";
import { sendAdminNotification, sendCustomerConfirmation } from "./email";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

// Inngest Function to update user data in database 
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated' },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)
    }
)

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({event}) => {
        
        const {id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

// Inngest Function to create user's order in database
export const createUserOrder = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents: {
            maxSize: 5,
            timeout: '5s'
        }
    },
    {event: 'order/created'},
    async ({events}) => {

        const orders = events.map((event)=> {
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date : event.data.date
            }
        })

        await connectDB()
        const createdOrders = await Order.insertMany(orders)

        // Send emails for each order
        for (let i = 0; i < createdOrders.length; i++) {
            const order = createdOrders[i];
            const eventData = events[i].data;

            try {
                // Get user details for customer email
                const user = await User.findById(order.userId);

                const orderData = {
                    orderId: order._id,
                    userId: order.userId,
                    items: eventData.items,
                    amount: order.amount,
                    address: eventData.address,
                    date: order.date
                };

                // Send admin notification
                await sendAdminNotification(orderData);

                // Send customer confirmation if user email exists
                if (user && user.email) {
                    await sendCustomerConfirmation(orderData, user.email);
                }

            } catch (emailError) {
                console.error('Error sending emails for order:', order._id, emailError);
                // Continue processing other orders even if email fails
            }
        }

        return { success: true, processed: orders.length };

    }
)