'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSellerOrders = async () => {
        try {

            const token = await getToken()

            const { data } = await axios.get(
                '/api/order/seller-orders',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setOrders(data.orders)
                setLoading(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        }
    }, [user]);

    // Helper function to safely render order items
    const renderOrderItems = (items) => {
        if (!items || !Array.isArray(items)) {
            return "No items";
        }

        return items
            .filter(item => item && item.product && item.product.name) // Filter out invalid items
            .map((item) => `${item.product.name} x ${item.quantity || 1}`)
            .join(", ");
    };

    // Helper function to safely get items count
    const getItemsCount = (items) => {
        if (!items || !Array.isArray(items)) {
            return 0;
        }
        return items.length;
    };

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders && orders.length > 0 ? orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <Image
                                    className="max-w-16 max-h-16 object-cover"
                                    src={assets.box_icon}
                                    alt="box_icon"
                                />
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {renderOrderItems(order.items)}
                                    </span>
                                    <span>Items : {getItemsCount(order.items)}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address?.fullName || 'N/A'}</span>
                                    <br />
                                    <span>{order.address?.area || 'N/A'}</span>
                                    <br />
                                    <span>{order.address ? `${order.address.city || ''}, ${order.address.state || ''}` : 'N/A'}</span>
                                    <br />
                                    <span>{order.address?.phoneNumber || 'N/A'}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount || 0}</p>
                            <div>
                                <p className="flex flex-col">
                                    <span>Method : COD</span>
                                    <span>Date : {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                                    <span>Payment : Pending</span>
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-5 text-center text-gray-500">
                            No orders found
                        </div>
                    )}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;