import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { AntDesign } from '@expo/vector-icons';
import colors from '@/constants/Colors';



// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
      <Drawer screenOptions={{drawerStyle: {flex: 1}, drawerActiveBackgroundColor: colors.onebrown, drawerInactiveTintColor: colors.black, drawerActiveTintColor: colors.dirtywhite}}>
        <Drawer.Screen 
          name='home' options={{
            drawerLabel: 'Home',
            title: 'Home', 
            drawerIcon: ({size, color}) => (<AntDesign name='home' size={size} color={color}/>)
          }}/>
        <Drawer.Screen name='usersettings' options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({size, color}) => (<AntDesign name='setting' size={size} color={color}/>),
          headerStyle: {backgroundColor: colors.brown}
        }}/>
      </Drawer>
  );
}
