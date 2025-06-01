import{TouchableOpacity,Text} from 'react-native';
import {styles} from "./styles";
type Props ={
  title: string;
}
export function Button({title}) {
  return (
    <TouchableOpacity style={styles.button}>
        <Text>{title}</Text>
    </TouchableOpacity>
  )
}