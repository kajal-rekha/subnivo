import { logout } from "@/redux/features/auth/authSlice";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// import Sidebar from "../Sidebar";

const Navbar = () => {
    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const session = useSelector((state) => state.auth.userAndToken);
    

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth < 768) {
    //             setIsSidebarOpen(false);
    //         } else {
    //             setIsSidebarOpen(true);
    //         }
    //     };

    //     handleResize();
    //     window.addEventListener("resize", handleResize);

    //     return () => {
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, []);

    // const toggleSidebar = () => {
    //     setIsSidebarOpen((prev) => !prev);
    // };

    const dispatch = useDispatch();

    return (
        <div className="h-20 fixed top-0 left-0 right-0 z-[999] text-light bg-[#0f1327] flex items-center">
            <div className="wrapper ">
                <div className="border-b border-light/10 pb-5 flex items-center justify-between ">
                    {/*====== Sidebar Toggle  =====*/}
                    <div className="flex items-center gap-2 ">
                        <div>
                            <h2 className="">Subnivo</h2>
                        </div>

                        {/* <AlignJustify
                            onClick={toggleSidebar}
                            className="cursor-pointer text-dark/80 dark:text-light w-5 h-5 md:w-7 md:h-7 z-10 block md:hidden"
                            aria-label="Toggle Sidebar"
                        /> */}
                    </div>

                    <div className="flex gap-5 items-center">
                        <div>
                            <ul className="flex gap-5 items-center">
                                <li>
                                    <Link href="/">Dashboard</Link>
                                </li>
                                <li>
                                    <Link href="/plans">Plans</Link>
                                </li>
                                <li>
                                    <Link href="/support">Support</Link>
                                </li>
                            </ul>
                        </div>
                        {!session ? (
                            <Link href="/auth/sign-in">Sign in</Link>
                        ) : (
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 overflow-hidden rounded-full">
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.username}
                                        width={64}
                                        height={64}
                                        priority
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            dispatch(logout());

                                            toast.success("Logout success!");
                                        }}
                                        className="cursor-pointer bg-blue p-2 rounded-md text-secondary"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <Sidebar isOpen={isSidebarOpen} /> */}
        </div>
    );
};

export default Navbar;
