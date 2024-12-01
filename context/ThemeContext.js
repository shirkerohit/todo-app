import { createContext, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "../constants/Colors";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState(
        Appearance.getColorScheme() === "dark" ? "dark" : "light"
    );

    const theme = colorScheme === "light" ? Colors.light : Colors.dark;

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    )
};
