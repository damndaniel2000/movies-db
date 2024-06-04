import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, FlatList, View, Text, Image, StyleSheet, SectionList, Dimensions } from 'react-native';
import Axios from 'axios';
import { MovieSectionComponent, MovieCard, MovieSkeletonLoader } from './components/MovieSection';
import { Genre, Movie, MovieSection } from './utils/types';
import { MOVIES_API, GENRES_API, SEARCH_API } from './utils/constants';
import GenreButton from './components/GenreButton';
import Loader from './components/Loader';
import SearchInput from './components/Searchbar';

const LOGO = require("./assets/fancode-fclogo.png")
const DEFAULT_YEAR = 2012
const DEFAULT_GENRE =
{
  name: "All",
  id: -1,
}


export default function App() {
  const [movies, setMovies] = useState<MovieSection[]>([]);
  const [isMoviesLoading, setIsMoviesLoading] = useState(false)

  const [genres, setGenres] = useState<Genre[]>([DEFAULT_GENRE])
  const [selectedGenres, setSelectedGenres] = useState<number[]>([DEFAULT_GENRE.id])

  const [isPrevFetching, setIsPrevFetching] = useState(false)
  const [isNextFetching, setIsNextFetching] = useState(false)
  const [currentPrevYear, setCurrentPrevYear] = useState(DEFAULT_YEAR)
  const [currentNextYear, setCurrentNextYear] = useState(DEFAULT_YEAR)

  //kept this different as the structure and API is different for search
  const [searchString, setSearchString] = useState('');
  const [searchMovies, setSearchMovies] = useState<Movie[]>([])
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);

  const moviesListRef = useRef(null) as any

  const scrollToDefaultPosition = () => {
    moviesListRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewOffset: -5,
      animated: false
    })
  }

  const resetData = () => {
    setCurrentNextYear(DEFAULT_YEAR)
    setCurrentPrevYear(DEFAULT_YEAR)
    scrollToDefaultPosition()
  }

  const handleGenre = (id: number) => {
    //is user selects All filter
    if (id === DEFAULT_GENRE.id) {
      //if user touches All when its already selected
      if (selectedGenres.includes(DEFAULT_GENRE.id)) return
      setSelectedGenres([DEFAULT_GENRE.id])
      resetData()
      return
    }
    resetData()
    if (selectedGenres.includes(id)) {
      setSelectedGenres(prev => {
        const arr = prev.filter(item => item !== id)
        //if all the other genres are not selected, go back to All
        if (arr.length === 0) return [DEFAULT_GENRE.id]
        else return arr
      })
    } else {
      setSelectedGenres(prev => {
        if (prev.includes(DEFAULT_GENRE.id)) return [id]
        else return [...prev, id]
      })
    }
  }

  const fetchMovies = async (yearToFetch: number, updateState: (newMovies: MovieSection) => void) => {
    let url = MOVIES_API;
    url += `&primary_release_year=${yearToFetch}`;

    if (selectedGenres.length > 0 && !selectedGenres.includes(DEFAULT_GENRE.id)) {
      url += `&with_genres=${selectedGenres.join('|')}`;
    }

    try {
      const res = await Axios.get(url);
      const newMovies: MovieSection = {
        title: yearToFetch,
        data: [{ key: yearToFetch, movies: res.data.results }],
      };
      updateState(newMovies);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMovieData = () => {
    const yearToFetch = DEFAULT_YEAR;
    setIsMoviesLoading(true)
    fetchMovies(yearToFetch, (newMovies) => {
      setMovies([newMovies]);
      setIsMoviesLoading(false)
      moviesListRef.current?.scrollToLocation({
        animated: false,
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: -5,
      });
    });
  };

  const loadMoreMovieData = (prev?: boolean, next?: boolean) => {
    let yearToFetch = prev ? currentPrevYear : currentNextYear

    if (prev) {
      setIsPrevFetching(true);
      yearToFetch -= 1;
    } else if (next) {
      if (new Date().getFullYear() === yearToFetch) return;
      yearToFetch += 1;
      setIsNextFetching(true);
    }

    fetchMovies(yearToFetch, (newMovies) => {
      if (prev) {
        setMovies(prev => [newMovies].concat(prev));
        setCurrentPrevYear(yearToFetch)
      }
      else {
        setMovies(prev => [...prev, newMovies]);
        setCurrentNextYear(yearToFetch)
      }
      setIsNextFetching(false);
      setIsPrevFetching(false);
    });
  };

  //specifically made for search because it doesn't support a genre filter
  const applyGenreFilter = (movies: Movie[]) => {
    if (selectedGenres.length > 0 && !selectedGenres.includes(DEFAULT_GENRE.id)) {
      return movies.filter((movie) =>
        selectedGenres.some((genre) => movie.genre_ids.includes(genre))
      );
    }
    return movies;
  };

  const onSearchMovies = async (text: string) => {
    setSearchString(text);
    //when search is cleared, go back to default view
    //takes into account any genres selected during search
    if (text.length === 0) {
      loadMovieData()
    }
    if (text.length > 2) {
      setIsMoviesLoading(true);
      setSearchPage(1);
      setSearchHasMore(true);
      try {
        const res = await Axios.get(`${SEARCH_API}&query=${text}&page=1`);
        const filteredMovies = applyGenreFilter(res.data.results);
        setSearchMovies(filteredMovies);
        if (filteredMovies.length === 0) {
          setSearchHasMore(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsMoviesLoading(false);
      }
    }
  };

  const onSearchMoreMovies = async () => {
    if (!searchHasMore) return; // Stop if no more results
    setIsNextFetching(true)
    try {
      const res = await Axios.get(`${SEARCH_API}&query=${searchString}&page=${searchPage + 1}`);
      const filteredMovies = applyGenreFilter(res.data.results);
      if (filteredMovies.length === 0) {
        setSearchHasMore(false);
      } else {
        setSearchMovies(prevMovies => [...prevMovies, ...filteredMovies]);
        setSearchPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsNextFetching(false);
    }
  };

  useEffect(() => {
    if (searchString.length < 2)
      loadMovieData()
    else onSearchMovies(searchString)
  }, [selectedGenres]);


  useEffect(() => {
    Axios.get(GENRES_API)
      .then(res => {
        setGenres(prev => [...prev, ...res.data.genres])
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={{
          marginLeft: 20
        }}
          source={LOGO} />
        <View style={{
          marginLeft: 8
        }}>
          <SearchInput handleChange={onSearchMovies} delay={500} placeholder="Search a movie..." />
        </View>
        <FlatList
          contentContainerStyle={{
            columnGap: 8,
            paddingHorizontal: 20,
          }}
          data={genres}
          renderItem={({ item }) =>
            <GenreButton item={item} onPress={handleGenre} selectedItems={selectedGenres} />
          }
          keyExtractor={item => item.id.toString()}
          horizontal
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        {
          isMoviesLoading ?
            <MovieSkeletonLoader />
            :
            searchString.length < 2 ?
              <SectionList
                ref={moviesListRef}
                sections={movies}
                renderItem={MovieSectionComponent}
                renderSectionHeader={({ section }: { section: MovieSection }) => (
                  <View style={styles.header}>
                    <Text style={styles.headerText}>{section.title}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => item.key.toString() + index.toString()}
                onEndReached={e => loadMoreMovieData(false, true)}
                onEndReachedThreshold={1}
                onScroll={(e) => {
                  if (e.nativeEvent.contentOffset.y === 0) {
                    loadMoreMovieData(true)
                  }
                }}
                ListHeaderComponent={() => <Loader isLoading={isPrevFetching && movies.length > 0} />}
                ListFooterComponent={() => <Loader isLoading={isNextFetching && movies.length > 0} />}
              />
              :
              <FlatList
                data={searchMovies}
                keyExtractor={(item, index) => item.id.toString() + index.toString()}
                renderItem={MovieCard}
                numColumns={2}
                onEndReached={onSearchMoreMovies}
                onEndReachedThreshold={1}
                ListFooterComponent={() => <Loader isLoading={isNextFetching && movies.length > 0} />}
              />
        }
      </SafeAreaView>
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
});
