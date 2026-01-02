import { Navigate } from "react-router-dom";


const ProtectedRoute = ({allowedRoles, children}) => {
    const token = window.localStorage.getItem("token");
    const role = window.localStorage.getItem("role");

    //not logged in 
    if(!token || !role) {
        return <Navigate to = "/login" replace/>
    }

    if(!allowedRoles.includes(role)) {
        alert("you are not authorised to access this page")
        return <Navigate to="/login" replace = {true} />
    }

    return children
}

export default ProtectedRoute;