import { ActivityIndicator, View } from "react-native"
import { PRIMARY_COLOR } from "../utils/constants"

const Loader = ({ isLoading }: { isLoading: boolean }) => {
    return isLoading ?
        <View style={{
            marginVertical: 16
        }}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
        :
        ""
}

export default Loader