// src/App.jsx

import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/shared/LoadingSpinner';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading (e.g., font loading, assets, etc.)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Handle loading state
    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <RouterProvider router={router} />
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: '#10B981',
                            color: 'white',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: 'white',
                        },
                    },
                    duration: 3000,
                    style: {
                        borderRadius: '8px',
                        padding: '16px',
                    },
                }}
            />
        </>
    );
}

export default App;