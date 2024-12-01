import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";

import data from "@/data/data";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Animation, { LinearTransition } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "react-native";

import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';

export default function Index() {
  const [todo, setTodo] = useState([]);
  const [text, setText] = useState("");
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();
  const styles = createStyle(colorScheme, theme);

  const [loaded, error] = useFonts({ Inter_500Medium });
  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem('todos');
        if (todos !== null) {
          const storedTodo = JSON.parse(todos);
          setTodo(storedTodo.sort((a, b) => b.id - a.id));
        } else {
          setTodo(data.sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.log(e);
      }
    }
    getTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todo));
      } catch (e) {
        console.log(e);
      }
    }
    saveTodos();
  }, [todo]);

  if (!loaded && !error) {
    return null;
  }

  const addTodo = () => {
    if (text.length > 0) {
      const newTodo = {
        id: todo.length > 0 ? todo[0].id + 1 : 1,
        title: text,
        completed: false,
      };
      const sortedTodo = [newTodo, ...todo].sort((a, b) => b.id - a.id);
      setTodo(sortedTodo);
      setText('');
    }
  };

  const toggleTodo = (id) => {
    setTodo(todo.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    }));
  }

  const removeTodo = (id) => {
    setTodo(todo.filter((todo) => todo.id !== id));
  }

  const handlePress = (id) => {
    router.push(`/todos/${id}`);
  }

  const renderItems = ({ item }) => {
    return (
      <View style={styles.todoItem}>
        <Pressable
          onPress={() => handlePress(item.id)}
          onLongPress={() => toggleTodo(item.id)}>
          <Text style={[styles.todoText, item.completed && styles.completedText]}>
            {item.title}
          </Text>
        </Pressable>
        <Pressable onPress={() => removeTodo(item.id)} style={styles.itemButton}>
          <MaterialCommunityIcons name="delete-circle" size={25} color="red" selectable={undefined} />
        </Pressable>
      </View>
    );
  };

  const emptyData = () => {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>
          Nothing on the list yet, lets start!
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          maxLength={40}
          style={styles.input}
          placeholder="Add a todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add </Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
          style={styles.themeButton}>
          <Octicons name={colorScheme === "light" ? "sun" : "moon"} size={20}
            color={theme.icon} selectable={undefined}
          />
        </Pressable>
      </View>
      <Animation.FlatList
        data={todo}
        renderItem={renderItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={emptyData}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar
        backgroundColor={theme.background}
      />
    </SafeAreaView>
  );
}

function createStyle(colorScheme, theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 5,
      margin: 5,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 0,
      padding: 10,
      margin: 10,
      pointerEvents: "auto",
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
    addButtonText: {
      color: theme.text,
      fontWeight: "bold",
    },
    todoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 10,
      borderRadius: 0,
      margin: 5,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 0,
      elevation: 1,
    },
    todoText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
      color: "gray",
    },
    emptyItem: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 10,
      margin: 10,
    },
    emptyItemText: {
      fontSize: 16,
      color: theme.text,
    }
  });
}