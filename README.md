# Movie App

This is my first time making a React Native project, and I'm more fluent in React, so please be lenient and try to ignore any amateur mistakes. I have built this project using Expo.

## Getting Started

To run this Expo project, follow these steps:

1. **Install the dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npx expo start
   ```

3. **Run the app on your device**:
   - For iOS: Press `i` to open in iOS simulator.
   - For Android: Press `a` to open in Android emulator.
   - Alternatively, scan the QR code with the Expo Go app on your physical device.

## Features

### 1. Appropriate Details on Touch of a Movie Card

- Each card initially shows the title, image, rating and genre.
- On touching the card, a modal will open with more details about the movie.

### 2. Infinite Scrolling on Both Ends

- Infinite scrolling is supported on both ends
- At a time 20 movies are loaded.
- The upward scroll has a spring like mechanism for loading. Once you reach the top, scroll above again for more movies to load.

### 3. Genre Filter

- You can filter movies by genre using the genre filter feature.
- This helps in finding movies that match your specific interests.

### 4. Searchbar

- A search bar is provided to allow you to search for movies by title.
- The search results update in real-time as you type.
- It even has a debounce of 300ms
- It takes into account selected genres

### 5. TypeScript Safety

- The project is built with TypeScript, ensuring type safety and reducing the likelihood of runtime errors.
- This helps in maintaining a robust codebase.

## Requirements Met

- **Movie Card Details**: Provides comprehensive details on touch.
- **Infinite Scrolling**: Seamless scrolling experience with dynamic loading.
- **Genre Filter**: Filters movies based on selected genres.
- **Searchbar**: Real-time search functionality.
- **TypeScript Safety**: Type-safe codebase for better maintainability.

## Side Note

- I have tested this on my Android phone using the Expo app. It will work best for an Android.
- The `maintainVisibileContentPosition` seems to be not working. I have checked Github for it and the issue is still open as per today's date. To tackle the situation, I have used the `scrollToLocation` function provided by `SectionList`.

## Conclusion

Thank you for checking out my first React Native project. Any feedback or suggestions for improvement are welcome. It was really fun working on this and if this is the kind of work i'm going to continue, I would love to be part of your company
