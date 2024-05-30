import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, Text, Image, StyleSheet, Dimensions, Pressable, SectionList } from 'react-native';
import Axios from 'axios';

const { width } = Dimensions.get('window');
const API = "https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&page=1&vote_count.gte=100";
const URL = "https://image.tmdb.org/t/p/w500/";
const LOGO = require("./assets/fancode-fclogo.png")

type Movie = {
  title: string,
  id: string,
  poster_path: string,
  vote_average: number,
}

type MovieSection = {
  title: number,
  data: [
    { key: number, movies: Movie[] }
  ],
}

type Genre = {
  name: string,
  id: number,
}

type SearchParams = {
  refresh?: boolean,
  prevYear?: true,
  nextYear?: true,
  search?: string,
}


export default function App() {
  const [movies, setMovies] = useState<MovieSection[]>([]);
  const [genres, setGenres] = useState<Genre[]>([{
    id: 0,
    name: "All"
  }])
  const [year, setYear] = useState(2012)
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  const handleGenre = (id: number) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres(prev => prev.filter(item => item !== id))
    } else {
      setSelectedGenres(prev => [...prev, id])
    }
  }


  const handleMovieFetch = (args: SearchParams) => {
    let yearToFetch = year;

    if (args.prevYear) {
      yearToFetch -= 1;
    } else if (args.nextYear) {
      if (new Date().getFullYear() === yearToFetch) return;
      yearToFetch += 1;
    }

    let url = API;
    if (!args.search) {
      url += `&primary_release_year=${yearToFetch}`;
    }

    if (selectedGenres.length > 0) {
      url += `&with_genres=${selectedGenres.join('|')}`;
    }

    if (args.search) {
      url += `&query=${args.search}`;
    }

    Axios.get(url)
      .then(res => {
        const newMovies: MovieSection = {
          title: yearToFetch,
          data: [{ key: yearToFetch, movies: res.data.results }]
        };

        if (args.refresh) {
          setMovies([newMovies]);
        } else {
          setMovies(prev => [...prev, newMovies]);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    handleMovieFetch({ refresh: true })
  }, [selectedGenres]);


  useEffect(() => {
    Axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d&language=en")
      .then(res => {
        setGenres(prev => [...prev, ...res.data.genres])
      }).catch(err => console.log(err))
  }, [])



  const renderMovie = ({ item }: { item: Movie }) => (
    <View style={styles.movie}>
      <Image source={{ uri: URL + item.poster_path }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
      </View>
    </View>
  );

  const renderMovies = ({ section }: { section: MovieSection }) => {
    return <FlatList
      data={section.data[0].movies}
      renderItem={renderMovie}
      keyExtractor={(item, index) => item.id.toString() + index.toString()}
      numColumns={2}
      contentContainerStyle={styles.moviesContainer}
    />

  }


  const renderSectionHeader = ({ section }: { section: MovieSection }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{section.title}</Text>
    </View>
  );

  const renderGenre = ({ item }: { item: Genre }) => (
    <Pressable style={() => [
      {
        backgroundColor: selectedGenres.includes(item.id) ? "#F0283C" : "#484848",
      },
      styles.genreButton
    ]}
      onPress={(e) => handleGenre(item.id)}
    >
      {({ pressed }) => (
        <Text style={styles.genreButtonText}>{item.name}</Text>
      )}
    </Pressable >
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={{
          marginLeft: 20
        }}
          source={LOGO} />
        <FlatList
          contentContainerStyle={{
            columnGap: 8,
            paddingHorizontal: 20,
          }}
          data={genres}
          renderItem={renderGenre}
          keyExtractor={item => item.id.toString()}
          horizontal
        />
      </View>
      <SectionList
        sections={movies}
        renderItem={renderMovies}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item.key.toString() + index.toString()}
        onEndReached={e => handleMovieFetch({ nextYear: true })}
        onEndReachedThreshold={1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    backgroundColor: "#242424",
    paddingTop: 48,
    paddingBottom: 20,
    rowGap: 16
  },
  header: {
    padding: 16,
    paddingBottom: 8
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold"
  },
  genreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  genreButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  moviesContainer: {
    padding: 16,
  },
  movie: {
    position: "relative",
    flex: 1,
    flexDirection: 'column',
    margin: 8,
    width: (width - 48) / 2,
    height: 250,
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
