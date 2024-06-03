import { Pressable, StyleSheet, Text } from "react-native";
import { Genre } from "../utils/types";
import { PRIMARY_COLOR } from "../utils/constants";

const styles = StyleSheet.create({
    genreButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    genreButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
});

type GenreButtonProps = {
    item: Genre,
    onPress: (id: number) => void,
    selectedItems: number[]
}

const GenreButton = (props: GenreButtonProps) => (
    <Pressable style={() => [
        {
            backgroundColor: props.selectedItems.includes(props.item.id) ? PRIMARY_COLOR : "#484848",
        },
        styles.genreButton
    ]}
        onPress={(e) => props.onPress(props.item.id)}
    >
        <Text style={styles.genreButtonText}>{props.item.name}</Text>
    </Pressable >
)


export default GenreButton