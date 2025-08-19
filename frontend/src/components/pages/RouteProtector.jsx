import { Navigate, Outlet, useLocation } from "react-router-dom";
import { userAuthenticationStore } from "../../store/userAuthenticationStore";

// This component is used to protect routes based on login status
const RouteProtector = ({ requireAuth, redirectTo }) => {
    // Get the logged-in user from the store
    const authenticationUser = userAuthenticationStore((state) => state.authenticationUser);

    // Get the current location (URL) the user is trying to access
    const location = useLocation();

    // If the route requires login, but the user is not logged in
    if (requireAuth && !authenticationUser) {
        // Redirect user to login page or any redirect page
        // "state" keeps track of where the user was trying to go
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    // If the route should be for guests only (like login page), but user is already logged in
    if (!requireAuth && authenticationUser) {
        // Redirect logged-in user to another page (e.g., home)
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    // If all checks are okay, allow user to view the route
    return <Outlet />
};

// Export this component to use in route definitions
export default RouteProtector;
