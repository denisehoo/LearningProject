import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { icons } from '../../constants';
import { Loader } from '../../components';
import { useGlobalContext } from "../../context/GlobalProvider";

type TabIconProps = {
  icon?: any
  color?: string
  name?: string
  focused?: boolean
}

const TabIcon = ({icon, color, name, focused}:TabIconProps) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image 
        source={icon}  
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"/>
      <Text className={`${focused ? 'font-psemibold':'font-pregular'} 
        text-xs`} style={{color:color}}>
        {name}
      </Text> 
    </View>
  )
}

const TabsLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs 
        screenOptions={
          {
            tabBarShowLabel:false,
            tabBarActiveTintColor:'#FFA001', //orange
            tabBarInactiveTintColor:'#CDCDE0', //white-grey
            tabBarStyle:{
              backgroundColor:'#161622', //dark-grey
              borderTopWidth:1,
              borderTopColor:'#232533', //darker-grey
              height:84,
            }
          }
        }
      >  
        <Tabs.Screen 
          name="home" 
          options={
            {
              title:'Home',
              headerShown:false,
              tabBarIcon: ({color, focused}: TabIconProps) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              )
            }
          }
        />

        <Tabs.Screen 
          name="bookmark" 
          options={
            {
              title:'Bookmark',
              headerShown:false,
              tabBarIcon:({color,focused}: TabIconProps)=>(
                <TabIcon 
                  icon={icons.bookmark} 
                  color={color}
                  name="Bookmark"
                  focused={focused}/>
              )
            }
          }
        />

        <Tabs.Screen 
          name="create" 
          options={
            {
              title:'Create',
              headerShown:false,
              tabBarIcon:({color,focused}:TabIconProps)=>(
                <TabIcon 
                  icon={icons.plus} 
                  color={color}
                  name="Create"
                  focused={focused}/>
              )
            }
          }
        />

        <Tabs.Screen 
          name="profile" 
          options={
            {
              title:'Profile',
              headerShown:false,
              tabBarIcon:({color,focused}:TabIconProps)=>(
                <TabIcon 
                  icon={icons.profile} 
                  color={color}
                  name="Profile"
                  focused={focused}/>
              )
            }
          }
        />

      </Tabs>
      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light"/>
    </>
  )
}

export default TabsLayout