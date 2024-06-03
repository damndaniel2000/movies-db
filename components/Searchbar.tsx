import React, { useState, useEffect, FC } from 'react';
import { TextInput, StyleSheet, View, TextInputProps } from 'react-native';

type SearchInputProps = {
    onChange: (text: string) => void;
    delay?: number;
} & Omit<TextInputProps, 'onChange'>;

const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const SearchInput: FC<SearchInputProps> = ({ onChange, delay = 300, ...props }) => {
    const [value, setValue] = useState<string>('');

    const debouncedOnChange = debounce(onChange, delay);

    useEffect(() => {
        debouncedOnChange(value);
    }, [value]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholderTextColor="#888"
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    input: {
        height: 40,
        borderColor: '#555',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
        color: '#fff',
        backgroundColor: '#333',
    },
});

export default SearchInput;
