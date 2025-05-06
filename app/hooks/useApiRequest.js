import { useState } from "react";

export function useApiRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const makeRequest = async ({ url, method = "GET", headers = {}, body = null, isFormData = false }) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const options = {
                method,
                headers: isFormData
                    ? { ...headers } // ✅ Do not add 'Content-Type' for FormData
                    : {
                        "Content-Type": "application/json",
                        ...headers,
                    },
                body: body ? (isFormData ? body : JSON.stringify(body)) : null, // ✅ Keep FormData unchanged
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Request failed");
            }

            const responseData = await response.json();
            if(!responseData.success){
                throw new Error(responseData.message || "Request failed");
            }
            setData(responseData);
            return responseData; // ✅ Return data for handling in the caller
        } catch (err) {
            setError(err.message);
            throw err; // ✅ Allow caller to handle errors
        } finally {
            setLoading(false);
        }
    };

    return { makeRequest, loading, error, data };
}
