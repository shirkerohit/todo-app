import { View, Text, StyleSheet, Pressable, TextInput, StatusBar } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState({});
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const router = useRouter();
    const styles = c(colorScheme, theme);

    const [loaded, error] = useFonts({ Inter_500Medium });

    useEffect(() => {
        const fetchData = async (id) => {
            const todos = await AsyncStorage.getItem('todos');
            if (todos !== null) {
                const storedTodo = JSON.parse(todos);
                const todo = storedTodo.find((todo) => todo.id === parseInt(id));
                setTodo(todo);
            }
        }
        fetchData(id);
    }, [id]);

    if (!loaded && !error) {
        return null;
    }

    const handleSave = async () => {
        const todos = await AsyncStorage.getItem('todos');
        if (todos !== null) {
            const storedTodo = JSON.parse(todos);
            const index = storedTodo.findIndex((todo) => todo.id === parseInt(id));
            storedTodo[index] = todo;
            await AsyncStorage.setItem('todos', JSON.stringify(storedTodo));
        } else {
            await AsyncStorage.setItem('todos', JSON.stringify([todo]));
        }
        router.push('/');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input}
                    placeholder='Edit Todo'
                    placeholderTextColor="gray"
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }))}
                />
                <Pressable onPress={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
                    style={styles.themeButton}>
                    <Octicons name={colorScheme === "light" ? "sun" : "moon"} size={20}
                        color={theme.icon} selectable={undefined}
                    />
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable style={styles.saveButton} onPress={() => handleSave()}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable style={[styles.saveButton, { backgroundColor: 'red' }]}
                    onPress={() => router.push('/')}>
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar
                backgroundColor={theme.background}
            />
        </SafeAreaView>
    );
}

function c(colorScheme, theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            gap: 6,
            width: '100%',
            marginHorizontal: 'auto',
            pointerEvents: "auto",
            justifyContent: "start",
            backgroundColor: theme.background,
            margin: 5,
        },
        input: {
            flex: 1,
            borderColor: "gray",
            borderWidth: 1,
            height: 40,
            borderRadius: 5,
            padding: 10,
            margin: 10,
            pointerEvents: "auto",
            fontSize: 18,
            fontFamily: "Inter_500Medium",
            color: theme.text
        },
        addButton: {
            backgroundColor: theme.button,
            color: theme.text,
            padding: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
            margin: 5,
        },
        themeButton: {
            padding: 10,
            backgroundColor: theme.background,
            color: theme.icon
        },
        saveButton: {
            backgroundColor: theme.button,
            color: theme.text,
            padding: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
            margin: 5,
        },
        saveButtonText: {
            fontFamily: "Inter_500Medium",
            color: theme.text
        },
    });
}