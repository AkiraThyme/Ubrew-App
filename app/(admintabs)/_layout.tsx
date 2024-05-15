import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.onebrown,
        tabBarStyle: {
          marginTop: 10,
          height: 55,
          borderWidth: 1,
          borderRadius: 50,
          borderTopColor: Colors.onebrown,
          backgroundColor: Colors.dirtywhite,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: 'Goods',
          tabBarIcon: ({ color }) => <TabBarIcon name="dropbox" color={color} />,
        }}
      />
      <Tabs.Screen
        name="adminsettings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
