import { logout } from "@/redux/features/auth/authSlice";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const session = useSelector((state) => state.auth.userAndToken);
  const dispatch = useDispatch();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Plans", href: "/plans" },
    { name: "Support", href: "/support" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-light/10 bg-[#0f1327] text-light">
      <div className="wrapper flex h-full w-full items-center">
        <div className="flex w-full items-center justify-between">
          {/* ============== LEFT : LOGO ============== */}
          <div className="shrink-0">
            <Link href="/" className="text-lg font-bold uppercase">
              Subnivo
            </Link>
          </div>

          {/* ============== CENTER : DESKTOP MENU ============== */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-blue"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ============== RIGHT ============== */}
          <div className="flex items-center gap-3">
            {!session ? (
              <>
                {/* ==============Sign In================ */}
                <Link
                  href="/auth/sign-in"
                  className="text-sm transition-colors hover:text-blue"
                >
                  Sign in
                </Link>

                {/*============= Desktop Get Started ===============*/}
                <Link
                  href="/auth/sign-up"
                  className="hidden md:inline-flex rounded-md bg-blue px-5 py-2.5 text-sm font-medium text-secondary transition hover:opacity-90"
                >
                  Get Started
                </Link>

                {/*================ Mobile Menu ================*/}
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-light/10 bg-white/5 md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={22} />
                </button>
              </>
            ) : (
              <>
                {/*============ User ==============*/}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={session.user.image}
                      alt={session.user.username}
                      width={64}
                      height={64}
                      priority
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/*================== Desktop Logout ===============*/}
                  <button
                    onClick={() => {
                      dispatch(logout());
                      toast.success("Logout success!");
                      closeMobileMenu();
                    }}
                    className="hidden cursor-pointer rounded-md bg-blue px-4 py-2 text-secondary md:block"
                  >
                    Logout
                  </button>
                </div>

                {/*================ Mobile Menu ================*/}
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-light/10 bg-white/5 md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-60 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* =================Overlay ==================*/}
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        {/*============== Drawer ===============*/}
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-xs border-l border-light/10 bg-[#0f1327] p-6 shadow-2xl transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/*================== Drawer Header ===================*/}
          <div className="flex items-center justify-between border-b border-light/10 pb-4">
            <span className="text-xl font-bold uppercase">Menu</span>

            <button
              type="button"
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5"
              onClick={closeMobileMenu}
            >
              <X size={18} />
            </button>
          </div>

          {/*==================== Navigation================ */}
          <nav className="mt-8">
            <ul className="flex flex-col gap-5 text-lg">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block transition-colors hover:text-blue"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/*============ Mobile User Actions ==================*/}
          <div className="mt-10 border-t border-light/10 pt-6">
            {!session ? (
              <Link
                href="/auth/sign-in"
                onClick={closeMobileMenu}
                className="block rounded-md border border-light/10 px-4 py-3 text-center transition hover:border-blue hover:text-blue"
              >
                Sign in
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-md border border-light/10 px-3 py-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={session.user.image}
                      alt={session.user.username}
                      width={64}
                      height={64}
                      priority
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span className="font-medium">{session.user.username}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    toast.success("Logout success!");
                    closeMobileMenu();
                  }}
                  className="cursor-pointer rounded-md bg-blue px-4 py-2.5 text-secondary"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
