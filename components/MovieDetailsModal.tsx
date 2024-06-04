import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { PRIMARY_COLOR, getMovieDetailsLink } from "../utils/constants";

type MovieDetailsModalComponent = {
    id: string;
    onClose: () => void;
};

const MovieDetailsModal: React.FC<MovieDetailsModalComponent> = ({ id, onClose }) => {
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showMoreCast, setShowMoreCast] = useState<boolean>(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(getMovieDetailsLink(id));
                const data = await response.json();
                setMovieDetails(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const toggleShowMoreCast = () => {
        setShowMoreCast(!showMoreCast);
    };

    return (
        <Modal visible={true} animationType="slide">
            <View style={styles.container}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Back</Text>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    ) : (
                        <>
                            <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}` }} style={styles.poster} />
                            <Text style={styles.title}>{movieDetails.title}</Text>
                            <Text style={styles.boldText}>Director</Text>
                            <Text style={styles.text}>{movieDetails.credits.crew.find((crewMember: any) => crewMember.job === 'Director')?.name}</Text>
                            <Text style={styles.boldText}>Genre</Text>
                            <Text style={styles.text}>{movieDetails.genres.map((genre: any) => genre.name).join(", ")}</Text>

                            <Text style={styles.boldText}>Cast</Text>
                            <Text style={styles.text}>
                                {movieDetails.credits.cast.slice(0, showMoreCast ? undefined : 10).map((actor: any) => actor.name).join(", ")} &nbsp;
                                {movieDetails.credits.cast.length > 10 && (
                                    <Text onPress={toggleShowMoreCast} style={styles.seeMoreText}>
                                        {showMoreCast ? "See less" : "See more"}
                                    </Text>
                                )}
                            </Text>
                            <Text style={styles.boldText}>Overview</Text>
                            <Text style={styles.text}>{movieDetails.overview}</Text>
                        </>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 99,
        padding: 10
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    contentContainer: {
        alignItems: 'center',
        paddingTop: 32
    },
    poster: {
        width: 200,
        height: 300,
        marginBottom: 10
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    boldText: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5
    },
    text: {
        color: 'white',
        marginBottom: 10
    },
    seeMoreText: {
        color: PRIMARY_COLOR,
        textDecorationLine: 'underline'
    }
});

export default MovieDetailsModal;
