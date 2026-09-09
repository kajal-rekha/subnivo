import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ReduxProvider>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ReduxProvider>
  );
}
