import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ReduxProvider from "@/providers/ReduxProvider";
import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isDashboardRoute =
    router.pathname.startsWith("/dashboard") ||
    router.pathname === "/subscriptions/[id]" ||
    router.pathname === "/settings";

  return (
    <ReduxProvider>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Toaster />
      {!isDashboardRoute && <Navbar />}
      <Component {...pageProps} />
      {!isDashboardRoute && <Footer />}
    </ReduxProvider>
  );
}
