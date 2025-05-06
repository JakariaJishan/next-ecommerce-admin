import { useEffect, useState } from 'react';
import cable from "@/app/actionCable"; // Path to your ActionCable setup

const useVendorNotifications = () => {
    const [message, setMessage] = useState(null);
    const [vendorId, setVendorId] = useState(null);

    useEffect(() => {
        // Retrieve vendor ID from local storage
        const storedVendorUser = {id:"1"}
        if (storedVendorUser && storedVendorUser.id) {
            setVendorId(storedVendorUser.id);
        }
    }, []);

    useEffect(() => {
        if (!vendorId) return;

        const subscription = cable.subscriptions.create(
            { channel: "VendorNotificationChannel", vendor_id: vendorId },
            {
                received(data) {
                    if (data.message) {
                        setMessage({
                            ...data,
                            created_at: new Date(data.created_at).toISOString(), // Ensure valid date format
                        });
                    }
                },
            }
        );

        return () => {
            subscription.unsubscribe(); // Clean up on unmount
        };
    }, [vendorId]);

    return message; // Return the message from the hook
};

export default useVendorNotifications;
