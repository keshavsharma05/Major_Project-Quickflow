import React, { useState } from 'react';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from './src/store/StoreContext';
import HomeScreen from './src/screens/Home';
import SearchScreen from './src/screens/Search';
import CartScreen from './src/screens/Cart/CartScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import OrdersScreen from './src/screens/Orders/OrdersScreen';
import ProductScreen from './src/screens/Product/ProductScreen';
import CheckoutScreen from './src/screens/Checkout/CheckoutScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmation/OrderConfirmationScreen';
import LiveOrderTrackingScreen from './src/screens/LiveOrderTracking/LiveOrderTrackingScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  let [fontsLoaded] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Handle object based navigation for passing params
  const screenName = typeof currentScreen === 'string' ? currentScreen : currentScreen?.name;
  const screenParams = typeof currentScreen === 'string' ? {} : currentScreen?.params;

  const renderScreen = () => {
    switch (screenName) {
      case 'Search': return <SearchScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'Cart': return <CartScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'Profile': return <ProfileScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'Orders': return <OrdersScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'Product': return <ProductScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'Checkout': return <CheckoutScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'OrderConfirmation': return <OrderConfirmationScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      case 'LiveOrderTracking': return <LiveOrderTrackingScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
      default: return <HomeScreen onNavigate={setCurrentScreen} route={{ params: screenParams }} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StoreProvider>
        {renderScreen()}
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default App;