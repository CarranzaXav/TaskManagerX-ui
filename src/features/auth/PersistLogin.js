import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const PersistLogin = () => {
    const [persist] = usePersist(); // Check if persistence is enabled
    const token = useSelector(selectCurrentToken); // Get the current token from Redux
    const [isVerified, setIsVerified] = useState(false); // State to track verification

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation(); // Mutation for refreshing token

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            if (!token && persist) {
                console.log('Verifying refresh token...');
                try {
                    if(isMounted){
                    await refresh().unwrap(); // Attempt to refresh the token
                    setIsVerified(true); // Mark verification as complete
                    console.log('Refresh token success');
                    }
                } catch (err) {
                    if (isMounted) {
                    console.log('Refresh token failed:', err);
                    setIsVerified(true); // Allow rendering login page on failure
                    }
                }
            } else if (isMounted) {
                setIsVerified(true); // If token exists, no need to verify
            }
        };
        // console.log('Cookies:', document.cookie);
        verifyRefreshToken(); // Call the function on mount

        return () => {
            isMounted = false;
        }
    }, [token, persist, refresh]);

    let content;

    if (!persist) {
        // If persistence is disabled, render child components directly
        console.log('Persistence disabled');
        content = <Outlet />;
    } else if (isLoading) {
        // Show loader during token verification
        console.log('Loading...');
        content = <PulseLoader color={'#FFF'} />;
    } else if (isError) {
        // Show error message if refresh token fails
        console.log('Error during token refresh:', error?.data?.message);
        content = (
            <div className="errmsg">
                {error?.data?.message || 'An error occurred'}
                <Link to="/login">Please log in again</Link>
            </div>
        );
    } else if (isVerified && (token || isSuccess)) {
        // Render child components if token exists or refresh succeeded
        console.log('Token exists or refresh succeeded');
        content = <Outlet />;
    } else if (isVerified && !token) {
        // Redirect to login page if verification is complete but no token exists
        console.log('Token verification complete but no token found');
        content = (
            <div className="errmsg">
                <Link to="/login">Please log in</Link>
            </div>
        );
    }

    return content;
};

export default PersistLogin;
