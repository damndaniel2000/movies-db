import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native"
import { Movie, MovieSection } from "../utils/types";
import { IMAGE_URL } from "../utils/constants";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 250

export const MovieCard = ({ item }: { item: Movie }) => {
    return (
        <View style={styles.movie}>
            <Image source={{ uri: IMAGE_URL + item.poster_path }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
            </View>
        </View>)
}

export const MovieSectionComponent = ({ section }: { section: MovieSection }) => {
    return (
        <View>
            <FlatList
                data={section.data[0].movies}
                renderItem={MovieCard}
                keyExtractor={(item, index) => item.id.toString() + index.toString()}
                numColumns={2}
                contentContainerStyle={styles.moviesContainer}
            />
        </View>
    )
}

export const MovieSkeletonLoader = () => {
    const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
    return (
        <FlatList
            data={Array(10).fill(null)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={() =>
                <ShimmerPlaceholder
                    shimmerStyle={styles.movie}
                    shimmerColors={['#333', '#444', '#333']}
                    visible={false}
                    height={250}
                >
                    <View ></View>
                </ShimmerPlaceholder>
            }
            numColumns={2}
            contentContainerStyle={styles.moviesContainer}
        />
    )
}

const styles = StyleSheet.create({
    moviesContainer: {
        padding: 16,
    },
    movie: {
        position: "relative",
        flex: 1,
        flexDirection: 'column',
        margin: 8,
        width: (width - 48) / 2,
        height: ITEM_HEIGHT,
        borderRadius: 8
    },
    image: {
        width: '100%',
        height: "100%",
        position: "absolute",
        resizeMode: 'cover',
        borderRadius: 8,
        opacity: .8
    },
    textContainer: {
        position: "absolute",
        bottom: 0,
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#fff",

    },
    rating: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#fff"
    }
});


