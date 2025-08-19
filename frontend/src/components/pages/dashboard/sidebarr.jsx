import { Link } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineHome } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";

const Sidebar = ({ activeMenu, setActiveMenu }) => (
    <aside className="w-64 bg-[#1e2a3a] p-4 space-y-6">
        <h1 className="text-2xl font-bold tracking-wide">Whispr</h1>
        <nav className="space-y-2">
            <Link
                to="/dashboard"
                onClick={() => setActiveMenu("dashboard")}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded text-left ${activeMenu === "dashboard"
                        ? "bg-[#2d3c50]"
                        : "text-gray-400 hover:text-white hover:bg-[#2d3c50]"
                    }`}
            >
                <MdDashboard className="h-5 w-5" />
                Dashboard
            </Link>
            <Link
                to="/"
                onClick={() => setActiveMenu("home")}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded text-left ${activeMenu === "home"
                        ? "bg-[#2d3c50]"
                        : "text-gray-400 hover:text-white hover:bg-[#2d3c50]"
                    }`}
            >
                <AiOutlineHome className="h-5 w-5" />
                Home
            </Link>
        </nav>
    </aside>
);

export default Sidebar;
