import { Inngest } from "inngest";
import User from "@/models/User";
import  connectDB  from "./db";
import Order from "@/models/Order";

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

        // Send email confirmations for each order
        console.log('📧 Starting email sending process for', createdOrders.length, 'orders')
        const { sendOrderConfirmationEmail } = await import('../lib/emailService.js')

        for (let i = 0; i < createdOrders.length; i++) {
            const order = createdOrders[i]
            const eventData = events[i].data

            console.log(`📧 Attempting to send email for order ${order._id} to ${eventData.address.email}`)
            
            try {
                const emailResult = await sendOrderConfirmationEmail({
                    address: eventData.address,
                    items: eventData.items,
                    amount: eventData.amount,
                    orderId: order._id
                })
                console.log(`✅ Email sent successfully for order ${order._id}:`, emailResult)
            } catch (error) {
                console.error(`❌ Failed to send email for order ${order._id}:`, error)
            }
        }

        return { success: true, processed: orders.length };

    }
)