import {
  ButtonStylesNames,
  ButtonStylesParams,
  FileInputStylesNames,
  MantineThemeOverride,
  PasswordInputStylesNames,
  PasswordInputStylesParams,
  SelectStylesNames,
  Styles,
  TextInputStylesNames,
  MultiSelectStylesNames,
  NumberInputStylesParams,
} from "@mantine/core";
import { DateTimePickerStylesNames } from "@mantine/dates";
import { COLORS } from "../constants/colors.contant";

const inputStyle = {
  width: "100%",
  marginTop: ".5rem",
  borderRadius: "10px",
  height: "48px",
  backgroundColor: COLORS.INPUT_COLOR,
};

export const mantineProviderTheme: MantineThemeOverride = {
  /** Put your mantine theme override here */
  colorScheme: "light",
  fontFamily:
    "Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  colors: {
    primary: [
      COLORS.PRIMARY,
      COLORS.PRIMARY2,
      COLORS.PRIMARY3,
      COLORS.PRIMARY4,
      COLORS.PRIMARY5,
      COLORS.PRIMARY,
      COLORS.PRIMARY2,
      COLORS.PRIMARY3,
      COLORS.PRIMARY4,
      COLORS.PRIMARY5,
    ],
    secondary: new Array(10).fill(COLORS.SECONDARY) as any,
    green: new Array(10).fill(COLORS.PRIMARY) as any,
    danger: new Array(10).fill(COLORS.DANGER) as any,
  },
  primaryColor: "primary",
  components: {
    Button: {
      sizes: {
        fluid: (theme) => {
          var styles: Styles<ButtonStylesNames, Record<string, any>> = {
            root: {
              width: "100%",
            },
          };

          return styles;
        },
      },
      styles: (theme, params: ButtonStylesParams, context) => {
        const defaultStyle: Styles<ButtonStylesNames, Record<string, any>> = {
          root: {
            height: "2.5rem",
            borderRadius: ".6rem",
          },
        };
        return defaultStyle;
      },
    },
    PasswordInput: {
      styles: (theme, params: PasswordInputStylesParams) => {
        const defaultStyle: Styles<
          PasswordInputStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
          innerInput: {
            height: "100%",
          },
        };
        return defaultStyle;
      },
    },
    NumberInput: {
      styles: (theme, params: NumberInputStylesParams) => {
        const textInputDefaultStyles: Styles<
          TextInputStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
        };
        return textInputDefaultStyles;
      },
    },
    DateTimePicker: {
      styles: (theme, params: DateTimePickerStylesNames) => {
        const textInputDefaultStyles: Styles<
          DateTimePickerStylesNames,
          Record<string, any>
        > = {
          input: { ...inputStyle },
          rightSection: {
            paddingRight: ".6rem",
          },
        };
        return textInputDefaultStyles;
      },
    },
    Input: {
      styles: (theme, params: TextInputStylesNames) => {
        const textInputDefaultStyles: Styles<
          TextInputStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
        };
        return textInputDefaultStyles;
      },
    },
    TextInput: {
      styles: (theme, params: TextInputStylesNames) => {
        const textInputDefaultStyles: Styles<
          TextInputStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
        };
        return textInputDefaultStyles;
      },
    },
    Textarea: {
      styles: (theme, params: TextInputStylesNames) => {
        const textInputDefaultStyles: Styles<
          TextInputStylesNames,
          Record<string, any>
        > = {
          input: { ...inputStyle, height: "200px" },
        };
        return textInputDefaultStyles;
      },
    },
    FileInput: {
      styles: (theme, params: FileInputStylesNames) => {
        const textInputDefaultStyles: Styles<
          FileInputStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
          rightSection: {
            position: "absolute",
            right: "0",
          },
        };
        return textInputDefaultStyles;
      },
    },
    Select: {
      styles: (theme, params: SelectStylesNames) => {
        const selectInputDefaultStyles: Styles<
          SelectStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
          rightSection: {
            paddingRight: ".6rem",
          },
        };
        return selectInputDefaultStyles;
      },
    },
    MultiSelect: {
      styles: (theme, params: MultiSelectStylesNames) => {
        const multiSelectInputDefaultStyles: Styles<
          MultiSelectStylesNames,
          Record<string, any>
        > = {
          input: inputStyle,
          rightSection: {
            paddingRight: ".6rem",
          },
        };
        return multiSelectInputDefaultStyles;
      },
    },
    Text: {
      sizes: {
        xs: () => 10 - 2,
        sm: () => 12 - 2,
        md: () => 14 - 2,
        lg: () => 16 - 2,
      } as any,
    },
  },
};
