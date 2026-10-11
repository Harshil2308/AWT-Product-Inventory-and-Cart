import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopping_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('shopping_cart_items', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const existingItem = prevItems[existingItemIndex];
        const newQuantity = existingItem.cartQuantity + quantityToAdd;

        if (newQuantity > product.quantity) {
          showToast(`Cannot add more than available stock (${product.quantity}) for ${product.name}`, 'warning');
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingItemIndex] = {
          ...existingItem,
          cartQuantity: newQuantity
        };
        showToast(`Updated ${product.name} quantity to ${newQuantity} in cart!`, 'success');
        return updated;
      } else {
        if (quantityToAdd > product.quantity) {
          showToast(`Cannot add more than available stock (${product.quantity}) for ${product.name}`, 'warning');
          return prevItems;
        }
        showToast(`Added ${product.name} (${quantityToAdd}) to cart!`, 'success');
        return [...prevItems, { ...product, cartQuantity: quantityToAdd }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const clamped = Math.min(newQuantity, item.quantity);
          if (newQuantity > item.quantity) {
            showToast(`Reached maximum available stock (${item.quantity}) for ${item.name}`, 'warning');
          }
          return { ...item, cartQuantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId);
      if (itemToRemove) {
        showToast(`Removed ${itemToRemove.name} from cart`, 'info');
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Shopping cart cleared', 'info');
  };

  // React useMemo optimization for cart total calculations
  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);
    const discount = subtotal > 10000 ? Math.round(subtotal * 0.05) : 0; // 5% discount over ₹10,000
    const deliveryFee = subtotal > 0 && subtotal < 500 ? 50 : 0; // Free delivery over ₹500
    const finalTotal = subtotal - discount + deliveryFee;

    return {
      totalItems,
      subtotal,
      discount,
      deliveryFee,
      finalTotal
    };
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    notification,
    cartSummary
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
