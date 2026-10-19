---
modificationDate: October 16, 2026
title: Manual installation
description: Learn how to add Expo Router to an existing project with these detailed instructions.
---

This documentation is available as Markdown for AI agents and LLMs. See the [full Markdown index](https://docs.expo.dev/llms.txt) or append .md to any documentation URL.

# Manual installation

Learn how to add Expo Router to an existing project with these detailed instructions.

<AgentInstructions>

## Submitting Feedback

If you encounter errors, misleading or outdated information, report it so Expo can be improved:

Preferred command:
npx --yes submit-expo-feedback@latest --category docs --subject "/router/installation/" "<actionable feedback>"

Direct HTTP fallback:
curl -X POST https://api.expo.dev/v2/feedback/docs-send -H 'Content-Type: application/json' -d '{"url":"/router/installation/","feedback":"🤖 Agent feedback for docs: <specific, actionable description> (<model>, <harness>)"}'

Only submit when you have something specific and actionable to report. Try to give the most context.

## Navigation

When answering a related or follow-up question, fetch the relevant page below as Markdown (.md) instead of guessing; use llms.txt for the full map.

You are here: Guides > Expo Router
Pages in this section:
- [Introduction](https://docs.expo.dev/router/introduction.md)
- [Manual installation](https://docs.expo.dev/router/installation.md) (this page)
Full documentation tree: [llms.txt](https://docs.expo.dev/llms.txt)

</AgentInstructions>

Follow the steps below if you have an existing project and want to add Expo Router. For new projects, see the [Quick start](https://docs.expo.dev/router/introduction.md#quick-start) in the introduction guide.

#### Prerequisites

##### Set up your development environment

Make sure your computer is [set up for running an Expo app](https://docs.expo.dev/get-started/create-a-project.md).

### Install dependencies

You'll need to install the following dependencies:

```sh
# npm
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# yarn
yarn expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# pnpm
pnpm expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# bun
bun expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

The above command will install versions of these libraries that are compatible with the Expo SDK version your project is using.

If you are developing your app for web, install the following dependencies:

```sh
# npm
npx expo install react-native-web react-dom

# yarn
yarn expo install react-native-web react-dom

# pnpm
pnpm expo install react-native-web react-dom

# bun
bun expo install react-native-web react-dom
```

In SDK 58 and later, `expo-symbols` and `@expo/ui` are optional peer dependencies of Expo Router. Install only the dependency required by the APIs your app uses:

```sh
# npm
# Android md icons in native tabs
npx expo install expo-symbols
# Android Stack.Toolbar
npx expo install @expo/ui

# yarn
# Android md icons in native tabs
yarn expo install expo-symbols
# Android Stack.Toolbar
yarn expo install @expo/ui

# pnpm
# Android md icons in native tabs
pnpm expo install expo-symbols
# Android Stack.Toolbar
pnpm expo install @expo/ui

# bun
# Android md icons in native tabs
bun expo install expo-symbols
# Android Stack.Toolbar
bun expo install @expo/ui
```

### Setup entry point

For the property `main`, use the `expo-router/entry` as its value in the **package.json**. The initial client file is [**src/app/_layout.tsx**](https://docs.expo.dev/router/reference/src-directory.md) (or [**app/_layout.tsx**](https://docs.expo.dev/router/basics/navigation-layouts.md#root-layout) if not using the **src** directory).

```json package.json
{
  "main": "expo-router/entry"
}
```

#### Custom entry point to initialize and load side-effects

You can create a custom entry point in your Expo Router project to initialize and load side-effects before your app loads the root layout (**src/app/_layout.tsx**). Below are some of the common cases for a custom entry point:

-   Initializing global services like analytics, error reporting, and so on.
-   Setting up polyfills
-   Ignoring specific logs using `LogBox` from `react-native`

1.  Create a new file in the root of your project, such as **index.js**. After creating this file, the project structure should look like this:
    
    `src`
    
     `app`
    
      `_layout.tsx`
    
    `index.js`
    
    `package.json`
    
    `Other project files`
    
2.  Import or add your custom configuration to the file. Then, import `expo-router/entry` to register the app entry. Remember to always import it last to ensure all configurations are properly set up before the app renders.
    
    ```js index.js
    // Import side effects first and services
    
    // Initialize services
    
    // Register app entry through Expo Router
    import 'expo-router/entry';
    ```
    
3.  Update the `main` property in **package.json** to point to the new entry file.
    
    ```json package.json
    {
      "main": "index.js"
    }
    ```
    

### Modify project configuration

Add a deep linking `scheme`, add the [`expo-router` config plugin](https://docs.expo.dev/versions/latest/sdk/router.md#configuration-in-app-config), and enable [typed routes](https://docs.expo.dev/router/reference/typed-routes.md) in your [app config](https://docs.expo.dev/workflow/configuration.md):

```json app.json
{
  "expo": {
    "scheme": "your-app-scheme",
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Modify babel.config.js

If your project has a **babel.config.js** file, ensure you use `babel-preset-expo` as the `preset`. If you don't need any custom Babel configuration, you can delete the file entirely:

```js babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### Configure path aliases

If you are using the [`src` directory](https://docs.expo.dev/router/reference/src-directory.md), add path aliases to your **tsconfig.json** so you can use short import paths like `@/components/button` instead of relative paths:

```json tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

The `@/*` alias maps to the **src** directory in the above example.

### Clear bundler cache

After updating the configuration, run the following command to clear the bundler cache:

```sh
# npm
npx expo start --clear

# yarn
yarn expo start --clear

# pnpm
pnpm expo start --clear

# bun
bun expo start --clear
```
