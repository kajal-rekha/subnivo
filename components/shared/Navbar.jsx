import { logout } from "@/redux/features/auth/authSlice";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// import Sidebar from "../Sidebar";
// import { AlignJustifyIcon } from "lucide-react";
// import { useEffect, useState } from "react";

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
    <div className="h-20 fixed top-0 left-0 right-0 z-999 text-light bg-[#0f1327] flex items-center">
      <div className="wrapper">
        <div className="border-b border-light/10 pb-5 grid grid-cols-3 items-center">
          {/*============= LEFT ================*/}
          <div className="justify-self-start">
            <Link href="/" className="text-xl font-bold uppercase">
              Subnivo
            </Link>
          </div>

          {/*============= CENTER ================*/}
          <nav className="justify-self-center hidden md:block">
            <ul className="flex items-center gap-8">
              <li>
                <Link href="/" className="hover:text-blue">
                  Home
                </Link>
              </li>

              <li>
                <Link href="#features" className="hover:text-blue">
                  Features
                </Link>
              </li>

              <li>
                <Link href="/plans" className="hover:text-blue">
                  Plans
                </Link>
              </li>

              <li>
                <Link href="/support" className="hover:text-blue">
                  Support
                </Link>
              </li>
            </ul>
          </nav>

          {/*============= RIGHT ================*/}
          <div className="justify-self-end flex items-center gap-4">
            {!session ? (
              <>
                <Link href="/auth/sign-in">Sign in</Link>

                <Link
                  href="/auth/sign-up"
                  className="bg-blue text-secondary px-5 py-2.5 rounded-md"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt={session.user.username}
                    width={64}
                    height={64}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  onClick={() => {
                    dispatch(logout());
                    toast.success("Logout success!");
                  }}
                  className="cursor-pointer bg-blue px-4 py-2 rounded-md text-secondary"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
