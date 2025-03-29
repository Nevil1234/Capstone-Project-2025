import { Tabs } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import Colors from "@/constants/Colors";

export default function TabLayout() {
    return (
        <>
            <StatusBar hidden />
            <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.BLUE,
                tabBarInactiveTintColor: Colors.DARK,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                }
            }}>
                <Tabs.Screen 
                    name="home"
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Feather name="home" size={24} color={color} />
                        ),
                    }} 
                />
                <Tabs.Screen 
                    name="wardrobe"
                    options={{
                        tabBarLabel: 'My Wardrobe',
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="style" size={24} color={color} />
                        ),
                    }} 
                />
                <Tabs.Screen 
                    name="marketplace"
                    options={{
                        tabBarLabel: 'Marketplace',
                        tabBarIcon: ({ color }) => (
                            <Feather name="shopping-bag" size={24} color={color} />
                        ),
                    }} 
                />
            </Tabs>
        </>
    );
}