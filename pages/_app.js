import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react"
import "@/styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps} }) {
  return (
    <div>
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </div>
  );
}
