import { TouchableOpacity } from "react-native";
 
const CustomActions = (props) => {

    return (
        <TouchableOpacity style={[styles.container, styles.wrapper]} onPress={props.onPressActionButton}>
        <Text style={styles.text}>+</Text>
        </TouchableOpacity>
    );
    }