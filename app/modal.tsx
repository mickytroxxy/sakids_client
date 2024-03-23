
import { View } from 'react-native';
import CountryList from '../components/modals/CountryList';

export default function ModalScreen() {
  const title = 'SELECT COUNTRY';
  const COMPONENT_MAP: { [key: string]: any } = {
    SELECT_COUNTRY: CountryList,
  };
  const SelectedComponent = COMPONENT_MAP[title?.split(" ").join("_")];
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      {SelectedComponent && <SelectedComponent />}
    </View>
  );
}
