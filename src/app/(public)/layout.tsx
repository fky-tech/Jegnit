import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "../../components/FloatingCart";
import CartDrawer from "../../components/CartDrawer";
import { NotificationProvider } from "@/context/NotificationContext";


export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen">{children}</main>
            <FloatingCart />

            <Footer />
        </NotificationProvider>
    );
}
