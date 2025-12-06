import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "../../components/FloatingCart";
import CartDrawer from "../../components/CartDrawer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen">{children}</main>
            <FloatingCart />
            <Footer />
        </>
    );
}
