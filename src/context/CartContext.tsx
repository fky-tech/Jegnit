'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
    id: string; // product_id + size + color
    product_id: number;
    name: string;
    price: number;
    img: string;
    size: string;
    color: string;
    quantity: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (product: any, size: string, price: number, color?: string, img?: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    toggleDrawer: () => void;
    isDrawerOpen: boolean;
    cartTotal: number;
    cartCount: number;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('jegnit_cart');
        if (saved) {
            setItems(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('jegnit_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: any, size: string, price: number, color: string = 'Standard', img?: string) => {
        const id = `${product.id}-${size}-${color}`;
        const itemImg = img || product.img;

        setItems((prev) => {
            const existing = prev.find((item) => item.id === id);
            if (existing) {
                return prev.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    id,
                    product_id: product.id,
                    name: product.name,
                    price,
                    img: itemImg,
                    size,
                    color,
                    quantity: 1,
                },
            ];
        });
        setIsDrawerOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('jegnit_cart');
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                toggleDrawer,
                isDrawerOpen,
                cartTotal,
                cartCount,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
