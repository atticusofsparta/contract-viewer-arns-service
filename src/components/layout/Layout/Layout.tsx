import { Navbar } from ".."
import { Outlet } from "react-router-dom"
import Notifications from "../Notifications/Notifications"

function Layout (){
    return (
        <div>
        <Navbar />
        <Outlet />
        <Notifications />
        </div>
    )
}
export default Layout