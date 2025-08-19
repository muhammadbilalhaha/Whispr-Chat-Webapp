import { useEffect, useState } from "react";
import Header from "./Header";
import KpiCards from "./KpiCards";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import Sidebar from "./sidebarr";
import useAdminStore from "../../../store/adminStore";
import { userAuthenticationStore } from "../../../store/userAuthenticationStore";

const AdminDashboard = () => {

    const onlineUsers = userAuthenticationStore((state) => state.onlineUsers);
    const fetchTotalUsersAnalystics = useAdminStore((state)=> state.fetchTotalUsersAnalystics);
    const analyticsData = useAdminStore((state)=> state.analyticsData);

    const { users, fetchAllUsers } = useAdminStore();
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [modalUser, setModalUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchAllUsers();
        fetchTotalUsersAnalystics();
    }, [analyticsData])

    return (
        <div className="flex min-h-screen bg-[#151d2a] text-white overflow-hidden select-none">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <main className="flex-1 p-6 space-y-6">
                <Header />
                <KpiCards analyticsData={analyticsData} />
                <UserTable
                    users={users}
                    setModalUser={setModalUser}
                    selectedUserId={selectedUserId}
                    setSelectedUserId={setSelectedUserId}
                />
            </main>
            {modalUser && <UserModal modalUser={modalUser} setModalUser={setModalUser} onlineUsers={onlineUsers} />}
        </div>
    );
};

export default AdminDashboard;

