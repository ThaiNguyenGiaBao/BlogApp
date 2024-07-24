import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRouter() {
    const user = useSelector((state) => state.user.user);
    //console.log(user)
    return user?(<Outlet />):<Navigate to="/signin"></Navigate>
    //return (<Outlet />)
}

export default PrivateRouter;