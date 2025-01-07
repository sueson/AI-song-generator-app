import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


interface CustomButtonProps {
    onPress?: () => void;
    title: string;
    colors: string | string[];
    textStyle?: object;
};

const CustomButton = ({ onPress, title, colors, textStyle} : CustomButtonProps) => {
    const gradientColors = Array.isArray(colors) ? colors : [colors, colors];

    return (
    <View className='mx-4'>
        <LinearGradient
            colors={gradientColors}
            style={[styles.button]}
        >
            <TouchableOpacity onPress={onPress} className='w-full'>
                    <Text numberOfLines={0} style={[ {color: 'white', fontSize: 20, textAlign: 'center', fontFamily: "Poppins_700Bold"}, textStyle ]}>
                        {title}
                    </Text>
            </TouchableOpacity>
        </LinearGradient>
    </View>
    )
}

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        width: '100%',
        borderRadius: 25,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }
});