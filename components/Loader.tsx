import { View, ActivityIndicator, Dimensions, Platform  } from 'react-native'

/**
 * Displays a full-screen loading indicator.
 *
 * @param {boolean} isLoading If true, display the loading indicator.
 *
 * @returns {JSX.Element | null} The loading indicator, or null if not displaying.
 */
const Loader = (isLoading:any) => {
  const osName =  Platform.OS;
  const screenHeight = Dimensions.get("screen").height;
  
  if (isLoading) return null;

  return (
    <View className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
     style={{height: screenHeight}}>
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
}

export default Loader