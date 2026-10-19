---
modificationDate: October 13, 2026
title: Router
description: A file-based routing library for React Native and web applications.
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-58/packages/expo-router'
packageName: 'expo-router'
platforms: ['android', 'ios', 'tvos', 'web', 'expo-go']
---

This documentation is available as Markdown for AI agents and LLMs. See the [full Markdown index](https://docs.expo.dev/llms.txt) or append .md to any documentation URL.

# Expo Router

A file-based routing library for React Native and web applications.

<AgentInstructions>

## Submitting Feedback

If you encounter errors, misleading or outdated information, report it so Expo can be improved:

Preferred command:
npx --yes submit-expo-feedback@latest --category docs --subject "/versions/v58.0.0/sdk/router/" "<actionable feedback>"

Direct HTTP fallback:
curl -X POST https://api.expo.dev/v2/feedback/docs-send -H 'Content-Type: application/json' -d '{"url":"/versions/v58.0.0/sdk/router/","feedback":"🤖 Agent feedback for docs: <specific, actionable description> (<model>, <harness>)"}'

Only submit when you have something specific and actionable to report. Try to give the most context.

## Navigation

When answering a related or follow-up question, fetch the relevant page below as Markdown (.md) instead of guessing; use llms.txt for the full map.

You are here: Reference (v58.0.0) > Expo Router
Pages in this section:
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/router.md) (this page)
- [Color](https://docs.expo.dev/versions/v58.0.0/sdk/router/color.md)
- [Experimental Stack](https://docs.expo.dev/versions/v58.0.0/sdk/router/experimental-stack.md)
- [Link](https://docs.expo.dev/versions/v58.0.0/sdk/router/link.md)
- [Native tabs](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs.md)
- [Split View](https://docs.expo.dev/versions/v58.0.0/sdk/router/split-view.md)
- [Stack](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack.md)
- [UI](https://docs.expo.dev/versions/v58.0.0/sdk/router/ui.md)
Full documentation tree: [llms.txt](https://docs.expo.dev/llms.txt)

</AgentInstructions>
Android, iOS, tvOS, Web, Included in Expo Go

`expo-router` is a routing library for React Native and web apps. It enables navigation management using a file-based routing system and provides native navigation components.

[Expo Router guides](https://docs.expo.dev/router/introduction.md) — Learn about Expo Router basics, navigation patterns, core concepts, and more.

> In **SDK 56 and later**, Expo Router no longer supports importing from external `@react-navigation/*` packages in application code. Repoint those imports to the matching `expo-router` entry points. Run the [codemod](https://docs.expo.dev/router/migrate/sdk-55-to-56.md#automated-migration) or follow the [SDK 55 to 56 migration guide](https://docs.expo.dev/router/migrate/sdk-55-to-56.md) to update your project.

## Installation

To use Expo Router in your project, you need to install. Follow the instructions from the Expo Router's installation guide:

[Install Expo Router](https://docs.expo.dev/router/installation.md) — Learn how to install Expo Router in your project.

## Configuration in app config

If you are using the [default](https://docs.expo.dev/more/create-expo.md#--template) template to create a new project, `expo-router`'s [config plugin](https://docs.expo.dev/config-plugins/introduction.md) is already configured in your app config.

### Example app.json with config plugin

```json app.json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `root` | `"app"` | Changes the routes directory from `app` to another value. Avoid using this property unless you have a specific need. |
| `origin` | `undefined` | Production origin URL where assets in the public folder are hosted. The fetch function is polyfilled to support relative requests from this origin in production. The development origin is inferred using the Expo CLI development server. |
| `headOrigin` | `undefined` | A more specific origin URL used in the `expo-router/head` module for iOS handoff. Defaults to `origin`. |
| `asyncRoutes` | `{ web: true }` | Enable async routes (lazy loading). Stable and enabled by default on web in SDK 58 and later. Experimental and disabled by default on native. Can be an [`AsyncRouteOption`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#asyncrouteoption) or an object with platform-specific [`AsyncRouteOption`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#asyncrouteoption) values (`{ android, ios, web, default }`). Explicit platform values take precedence over `default`. Production async routes are web-only. |
| `platformRoutes` | `true` | Enable or disable platform-specific routes (for example, **index.android.tsx** and **index.ios.tsx**). |
| `sitemap` | `true` | Enable or disable the automatically generated sitemap at **/_sitemap**. |
| `partialRouteTypes` | `true` | Enable partial typed routes generation. This allows TypeScript to provide type checking for routes without requiring all routes to be statically known. |
| `redirects` | `undefined` | An array of static redirect rules. Each rule is a [`RedirectConfig`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#redirectconfig-1) with `source`, `destination`, and optionally `permanent` (defaults to `false`) and `methods` (HTTP methods to redirect). |
| `rewrites` | `undefined` | An array of static rewrite rules. Each rule is a [`RewriteConfig`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#rewriteconfig) with `source`, `destination`, and optionally `methods` (HTTP methods to rewrite). |
| `headers` | `undefined` | A list of headers that are set on every route response from the server. The value can be a string or an array of strings. |
| `pageHeaders` | `undefined` | An array of header rules that are set on a specific page's response from the server. Each rule is a [`PageHeadersConfig`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#pageheadersconfig) with `source` and `headers`. Rules match HTML page paths and do not apply to API routes. Later matching rules override earlier rules. See [Server headers](https://docs.expo.dev/router/web/server-headers.md#path-specific-headers). |
| `disableSynchronousScreensUpdates` | `false` | Disable synchronous layout updates for native screens. This can help with performance in some cases. |
| `unstable_useServerMiddleware` | `false` | , Deprecated. No longer required as of SDK 58 and has no effect. Remove this option from your app config. |
| `unstable_useServerDataLoaders` | `false` | , Deprecated. No longer required as of SDK 58 and has no effect. Remove this option from your app config. |
| `unstable_useServerRendering` | `false` | , Deprecated. No longer required as of SDK 58 and has no effect. Remove this option from your app config. |
| `apiRoutes` | `Depends on web.output` | Enable API routes with static or server output. Defaults to `true` for server output and `false` for static output. |

## Usage

For information core concepts, notation patterns, navigation layouts, and common navigation patterns, start with Router 101 section:

[Router 101](https://docs.expo.dev/router/basics/core-concepts.md)

## APIs

| API | Description |
| --- | --- |
| [Stack](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack.md) | Stack navigator, toolbar, and screen components |
| [Link](https://docs.expo.dev/versions/v58.0.0/sdk/router/link.md) | Link and Redirect components |
| [Color](https://docs.expo.dev/versions/v58.0.0/sdk/router/color.md) | Platform color utilities |
| [Native Tabs](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs.md) | Native tab navigation |
| [Split View](https://docs.expo.dev/versions/v58.0.0/sdk/router/split-view.md) | Split view layout |
| [UI](https://docs.expo.dev/versions/v58.0.0/sdk/router/ui.md) | Headless tab components |

## API

```js
import { useRouter, Tabs, Navigator, Slot } from 'expo-router';
```

## Components

### `Badge`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[BadgeProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#badgeprops)\>

BadgeProps

#### Inherited props

-   [NativeTabsTriggerBadgeProps](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs.md#nativetabstriggerbadgeprops)
-   [StackToolbarBadgeProps](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack.md#stacktoolbarbadgeprops)

### `ErrorBoundary`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[ErrorBoundaryProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#errorboundaryprops)\>

Props passed to a page's `ErrorBoundary` export.

ErrorBoundaryProps

### `error`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

The error that was thrown.

### `retry`

Supported platforms: Android, iOS, tvOS, Web.

Type: () => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<void\>

A function that will re-render the route component by clearing the `error` state.

### `ExperimentalStack`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<[StandardUseNavigationBuilderOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#standardusenavigationbuilderoptions)<[StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamListBase\>, [ExperimentalStackNavigationOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#experimentalstacknavigationoptions), StandardExperimentalStackNavigationEventMap\>, 'initialRouteName'\> & [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<object, 'initialRouteName'\> & { unstable_screenErrorBoundary: ComponentType<[ErrorBoundaryProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#errorboundaryprops)\> }, 'children'\> & [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)<[Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<[StandardUseNavigationBuilderOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#standardusenavigationbuilderoptions)<[StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamListBase\>, [ExperimentalStackNavigationOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#experimentalstacknavigationoptions), StandardExperimentalStackNavigationEventMap\>, 'initialRouteName'\> & [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<object, 'initialRouteName'\> & { unstable_screenErrorBoundary: ComponentType<[ErrorBoundaryProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#errorboundaryprops)\> }, 'children'\>\>\>

Renders the new `react-native-screens/experimental` native stack.

Sibling to `Stack`. Native-only — on web it falls back to the standard `Stack`. Opt-in per navigator: replace `<Stack />` with `<ExperimentalStack />` in the specific layout you want to migrate.

### `Icon`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[IconProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#iconprops)\>

IconProps

#### Inherited props

-   [NativeTabsTriggerIconProps](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs.md#nativetabstriggericonprops)
-   [StackToolbarIconProps](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack.md#stacktoolbariconprops)

### `Label`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[LabelProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#labelprops)\>

LabelProps

#### Inherited props

-   [NativeTabsTriggerLabelProps](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs.md#nativetabstriggerlabelprops)
-   [StackToolbarLabelProps](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack.md#stacktoolbarlabelprops)

### `LocaleProvider`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[LocaleProviderProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#localeproviderprops)\>

LocaleProviderProps

### `direction`

Supported platforms: Android, iOS, tvOS, Web.

Type: [LocaleDirection](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#localedirection)

### `NativeStackView`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<Props\>

### `ScrollViewStyleReset`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<React.FC\>

Root style-reset for full-screen React Native web apps with a root `<ScrollView />` should use the following styles to ensure native parity. See [React Native for Web's root element setup](https://necolas.github.io/react-native-web/docs/setup/#root-element).

### `Sitemap`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<React.FC\>

### `Slot`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<NavigatorProps<any\>, 'children' | 'activityEnabled' | 'activityDefaultThreshold'\> & { activityEnabled: boolean }\>

Renders the currently selected content.

There are actually two different implementations of `<Slot/>`:

-   Used inside a `_layout` as the `Navigator`
-   Used inside a `Navigator` as the content

Since a custom `Navigator` will set the `NavigatorContext.contextKey` to the current `_layout`, you can use this to determine if you are inside a custom navigator or not.

### `SuspenseFallback`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.Element<[SuspenseFallbackProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#suspensefallbackprops)\>

Props passed to a route's `SuspenseFallback` export.

SuspenseFallbackProps

### `params`

Supported platforms: Android, iOS, tvOS, Web.

Type: `Record<string, string | string[]>`

The route's URL parameters.

Example

`` { id: "123" } // For a route `./profile/[id].tsx` navigated to as `/profile/123` ``

### `route`

Supported platforms: Android, iOS, tvOS, Web.

Type: `string`

The route module's `contextKey`.

Example

`./index.tsx` `./profile/[id].tsx`

### `ThemeProvider`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<Props\>

### `VectorIcon`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[VectorIconProps](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#vectoriconprops)<NameT\>\>

Helper component for loading vector icons.

Prefer using the `md` and `sf` props on `Icon` rather than using this component directly. Only use this component when you need to load a specific icon from a vector icon family.

Example

```tsx
import { Icon, VectorIcon } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

<Icon src={<VectorIcon family={MaterialCommunityIcons} name="home" />} />
```

VectorIconProps

### `family`

Supported platforms: Android, iOS, tvOS, Web.

Type: { getImageSource: (name: NameT, size: number, color: [ColorValue](https://reactnative.dev/docs/colors)) => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[ImageSourcePropType](https://reactnative.dev/docs/image#imagesource) | null\> }

The family of the vector icon.

Example

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
```

### `name`

Supported platforms: Android, iOS, tvOS, Web.

Type: `NameT`

The name of the vector icon.

### `ExperimentalStack.Screen`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[StackScreenProps](https://docs.expo.dev/versions/latest/sdk/router/stack.md#stackscreenprops)\>

### `ExperimentalStack.Screen.BackButton`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[StackScreenBackButtonProps](https://docs.expo.dev/versions/latest/sdk/router/stack.md#stackscreenbackbuttonprops)\>

Component to configure the back button.

Can be used inside Stack.Screen in a layout or directly inside a screen component.

Example

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="detail">
        <Stack.Screen.BackButton displayMode="minimal">Back</Stack.Screen.BackButton>
      </Stack.Screen>
    </Stack>
  );
}
```

Example

```tsx
import { Stack } from 'expo-router';

export default function Page() {
  return (
    <>
      <Stack.Screen.BackButton hidden />
      <ScreenContent />
    </>
  );
}
```

> **Note:** If multiple instances of this component are rendered for the same screen, the last one rendered in the component tree takes precedence.

> **Deprecated:** Use `Stack.Title` instead.

### `ExperimentalStack.Screen.Title`

Supported platforms: Android, iOS, tvOS, Web.

Type: React.[Element](https://www.typescriptlang.org/docs/handbook/jsx.html#function-component)<[StackTitleProps](https://docs.expo.dev/versions/latest/sdk/router/stack.md#stacktitleprops)\>

## Constants

### `DarkTheme`

Supported platforms: Android, iOS, tvOS, Web.

Type: `Theme`

### `DefaultTheme`

Supported platforms: Android, iOS, tvOS, Web.

Type: `Theme`

### `IsWithinNativeNavigator`

Supported platforms: Android, iOS, tvOS, Web.

Type: `Context<boolean>`

Indicates that descendants are rendered inside a native navigator. Native navigator integrations should provide `true` so incompatible nested navigators can fail before reaching the native view hierarchy.

### `router`

Supported platforms: Android, iOS, tvOS, Web.

Type: [ImperativeRouter](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#imperativerouter)

### `Tabs`

Supported platforms: Android, iOS, tvOS, Web.

Renders a tabs navigator.

### `unstable_performance`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[Performance](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#performance), 'getEntries' | 'getEntriesByName' | 'getEntriesByType' | 'clearMarks'\>

Reads the performance marks that Expo Router records during navigation. It has the mark-related methods of the global [`performance`](https://developer.mozilla.org/en-US/docs/Web/API/Performance) object. On web, it is the global `performance` object, so `getEntries()` also returns entries that Expo Router did not record.

On native, Expo Router keeps the latest 250 marks. It also passes each mark to the global `performance.mark()`, so the marks show in the React Native DevTools timeline.

## Hooks

### `useCurrentRouteInfo()`

Supported platforms: Android, iOS, tvOS, Web.

Returns route info for a screen it is called from.

Returns: `UrlObject | undefined`

### `useFocusEffect(effect, do_not_pass_a_second_prop)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `effect` | [EffectCallback](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#effectcallback) | Memoized callback containing the effect, should optionally return a cleanup function. |
| `do_not_pass_a_second_prop`(optional) | `undefined` | - |

  

Hook to run an effect whenever a route is **focused**. Similar to [`React.useEffect`](https://react.dev/reference/react/useEffect), but the effect re-runs each time the screen comes into focus, and the optional cleanup function runs when the screen loses focus — not on unmount. This makes it the right primitive for refetching data, restarting subscriptions, or resetting transient screen state every time a user returns to the route.

The passed callback should be wrapped in [`React.useCallback`](https://react.dev/reference/react/useCallback) to avoid running the effect too often.

Returns: `void`

Example

```tsx
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Route() {
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("Hello, I'm focused!");

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log('This route is now unfocused.');
      };
    }, []),
   );

 return </>;
}
```

### `useGlobalSearchParams()`

Supported platforms: Android, iOS, tvOS, Web.

Returns URL parameters for globally selected route, including dynamic path segments. This function updates even when the route is not focused. Useful for analytics or other background operations that don't draw to the screen.

Route URL example: `acme://profile/baconbrix?extra=info`.

When querying search params in a stack, opt-towards using [`useLocalSearchParams`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#uselocalsearchparams) because it will only update when the route is focused.

> **Note:** For usage information, see [Local versus global search parameters](https://docs.expo.dev/router/reference/url-parameters.md#local-versus-global-url-parameters).

Returns: `RouteOutputParams<TRoute> & TParams`

Example

```tsx app/profile/[user].tsx
import { Text } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';

export default function Route() {
  // user=baconbrix & extra=info
  const { user, extra } = useGlobalSearchParams();

  return <Text>User: {user}</Text>;
}
```

### `useIsFocused()`

Supported platforms: Android, iOS, tvOS, Web.

Hook to get the current focus state of the screen. Returns a `true` if screen is focused, otherwise `false`. This can be used if a component needs to render something based on the focus state.

Returns: `boolean`

### `useLoaderData()`

Supported platforms: Android, iOS, tvOS, Web.

Returns the result of the `loader` function for the calling route.

Returns: `LoaderFunctionResult<T>`

Example

```tsx app/profile/[user].tsx
import { Text } from 'react-native';
import { useLoaderData } from 'expo-router';

export function loader() {
  return Promise.resolve({ foo: 'bar' }};
}

export default function Route() {
 const data = useLoaderData<typeof loader>(); // { foo: 'bar' }

 return <Text>Data: {JSON.stringify(data)}</Text>;
}
```

### `useLocalSearchParams()`

Supported platforms: Android, iOS, tvOS, Web.

Returns the URL parameters for the contextually focused route. Useful for stacks where you may push a new screen that changes the query parameters. For dynamic routes, both the route parameters and the search parameters are returned.

Route URL example: `acme://profile/baconbrix?extra=info`.

To observe updates even when the invoking route is not focused, use [`useGlobalSearchParams`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#useglobalsearchparams).

> **Note:** For usage information, see [Local versus global search parameters](https://docs.expo.dev/router/reference/url-parameters.md#local-versus-global-url-parameters).

Returns: `RouteOutputParams<TRoute> & TParams`

Example

```tsx app/profile/[user].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
 // user=baconbrix & extra=info
 const { user, extra } = useLocalSearchParams();

 return <Text>User: {user}</Text>;
}
```

### `useNavigation(parent)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `parent`(optional) | string | [HrefObject](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hrefobject) | Provide an absolute path such as `/(root)` to the parent route or a relative path like `../../` to the parent route. |

  

Returns the navigation object for the current route. Use it to access layout-specific functionality, such as `navigation.openDrawer()` in a [Drawer](https://docs.expo.dev/router/advanced/drawer.md) layout.

Returns: `T`

The navigation object for the current route.

> **See:** [Navigating between pages](https://docs.expo.dev/router/basics/navigation.md) for Router navigation, and [Drawer](https://docs.expo.dev/router/advanced/drawer.md) for layout-specific navigation methods.

Example

```tsx app/index.tsx
import { useNavigation } from 'expo-router';

export default function Route() {
  // Access the current navigation object for the current route.
  const navigation = useNavigation();

  return (
    <View>
      <Text onPress={() => {
        // Open the drawer view.
        navigation.openDrawer();
      }}>
        Open Drawer
      </Text>
    </View>
  );
}
```

When using nested layouts, you can access higher-order layouts by passing a secondary argument denoting the layout route. For example, `/menu/_layout.tsx` is nested inside `/app/orders/`, you can use `useNavigation('/orders/menu/')`.

Example

```tsx app/orders/menu/index.tsx
import { useNavigation } from 'expo-router';

export default function MenuRoute() {
  const rootLayout = useNavigation('/');
  const ordersLayout = useNavigation('/orders');

  // Same as the default results of `useNavigation()` when invoked in this route.
  const parentLayout = useNavigation('/orders/menu');
}
```

If you attempt to access a layout that doesn't exist, an error such as `Could not find parent navigation with route "/non-existent"` is thrown.

### `useNavigationContainerRef()`

Supported platforms: Android, iOS, tvOS, Web.

Returns: `NavigationContainerRefWithCurrent<RootParamList>`

The root `<NavigationContainer />` ref for the app. The `ref.current` may be `null` if the `<NavigationContainer />` hasn't mounted yet.

### `usePathname()`

Supported platforms: Android, iOS, tvOS, Web.

Returns the currently selected route location without search parameters. For example, `/acme?foo=bar` returns `/acme`. Segments will be normalized. For example, `/[id]?id=normal` becomes `/normal`.

Returns: `string`

Example

```tsx app/profile/[user].tsx
import { Text } from 'react-native';
import { usePathname } from 'expo-router';

export default function Route() {
  // pathname = "/profile/baconbrix"
  const pathname = usePathname();

  return <Text>Pathname: {pathname}</Text>;
}
```

### `usePreventRemove(preventRemove, callback, options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `preventRemove` | `boolean` | Boolean indicating whether to prevent screen from being removed. |
| `callback`(optional) | `(options: { data: { action: NavigationAction }, repeat: () => void }) => void` | Optional function called when the screen was prevented from being removed. |
| `options`(optional) | [PreventRemoveOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#preventremoveoptions) | Options that configure removal prevention. |

  

Prevents the screen from being removed while `preventRemove` is `true` and calls `callback` with the blocked navigation action.

To continue the blocked navigation action, set `preventRemove` to `false` and call the callback's `repeat` function. To navigate somewhere else, set `preventRemove` to `false`, call the returned `disablePrevention` function, and then navigate.

On web, this hook also prevents the browser from unloading the page while `preventRemove` is `true`.

Returns: `() => void`

Example

```tsx
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
usePreventRemove(hasUnsavedChanges, ({ repeat }) => {
  Alert.alert('Discard changes?', undefined, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Discard',
      style: 'destructive',
      onPress: () => {
        setHasUnsavedChanges(false);
        repeat();
      },
    },
  ]);
});
```

> **Deprecated:** Use [`useNavigationContainerRef`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#usenavigationcontainerref) instead, which returns a React `ref`.

### `useRootNavigation()`

Supported platforms: Android, iOS, tvOS, Web.

Returns: `NavigationContainerRef<ParamListBase> | null`

### `useRootNavigationState()`

Supported platforms: Android, iOS, tvOS, Web.

Returns the navigation state of the root navigator — the top-level navigator that contains the current screen. Its shape follows the `NavigationState` type of the installed `expo-router` version.

Returns: `NavigationState`

The current `NavigationState` of the root navigator.

Example

```tsx
import { useRootNavigationState } from 'expo-router';

export default function Route() {
 const { routes } = useRootNavigationState();

 return <Text>{routes[0].name}</Text>;
}
```

### `useRoute()`

Supported platforms: Android, iOS, tvOS, Web.

Hook to access the route prop of the parent screen anywhere.

Returns: `T`

Route prop of the parent screen.

### `useRoutePath()`

Supported platforms: Android, iOS, tvOS, Web.

Hook to get the path for the current route based on linking options.

Returns: `string`

Path for the current route.

### `useRouter()`

Supported platforms: Android, iOS, tvOS, Web.

Returns the [Router](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#imperativerouter) object for imperative navigation.

Returns: `ImperativeRouter`

Example

```tsx
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function Route() {
 const router = useRouter();

 return (
  <Text onPress={() => router.push('/home')}>Go Home</Text>
 );
}
```

### `useScrollToTop(ref)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `ref` | [RefObject](https://react.dev/reference/react/useRef)<ScrollableWrapper\> |

  

Returns: `void`

### `useSegments()`

Supported platforms: Android, iOS, tvOS, Web.

Returns a list of selected file segments for the currently selected route. Segments are not normalized, so they will be the same as the file path. For example, `/[id]?id=normal` becomes `["[id]"]`.

Returns: `RouteSegments<TSegments>`

Example

```tsx app/profile/[user].tsx
import { Text } from 'react-native';
import { useSegments } from 'expo-router';

export default function Route() {
  // segments = ["profile", "[user]"]
  const segments = useSegments();

  return <Text>Hello</Text>;
}
```

`useSegments` can be typed using an abstract. Consider the following file structure:

```md
- app
  - [user]
    - index.tsx
    - followers.tsx
  - settings.tsx
```

This can be strictly typed using the following abstract with `useSegments` hook:

```tsx
const [first, second] = useSegments<['settings'] | ['[user]'] | ['[user]', 'followers']>()
```

### `useServerDocumentContext()`

Supported platforms: Android, iOS, tvOS, Web.

Returns the server document data for server-side rendering, including `<html>`/`<body>` attributes and additional nodes to add to `<head>`/`<body>` for metadata and assets.

Returns: `ServerDocumentData`

Example

```tsx
import { useServerDocumentContext } from 'expo-router/html';

export default function Root({ children }) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return (
    <html {...htmlAttributes}>
      <head>{headNodes}</head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
```

### `useSitemap()`

Supported platforms: Android, iOS, tvOS, Web.

Returns: `SitemapType | null`

### `useTheme()`

Supported platforms: Android, iOS, tvOS, Web.

Returns: `Theme`

## Classes

### `unstable_PerformanceObserver`

Supported platforms: Android, iOS, tvOS, Web.

Type: Class implements [PerformanceObserver](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#performanceobserver)

Observes the performance marks that Expo Router records during navigation. On web, it is the global [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver). On native, it implements the same API for `mark` entries. Unlike the React Native `PerformanceObserver`, it keeps the `detail` of each mark.

Check the `name` of an entry and cast it to the matching mark type, for example `RouterPageFocusedMark`, to read its `detail`.

Example

```ts app/_layout.tsx
import {
  unstable_enablePerformanceIntegration,
  unstable_PerformanceObserver,
  type RouterPageFocusedMark,
} from 'expo-router';

unstable_enablePerformanceIntegration();

new unstable_PerformanceObserver((list) => {
  for (const entry of list.getEntriesByName('expo-router:page-focused')) {
    const { detail } = entry as RouterPageFocusedMark;
    console.log(entry.startTime, detail.pathname);
  }
}).observe({ type: 'mark', buffered: true });
```

unstable_PerformanceObserver Properties

### `supportedEntryTypes`

Supported platforms: Android, iOS, tvOS, Web.

Read only • Type: `readonly string[]`

The static **`supportedEntryTypes`** read-only property of the PerformanceObserver interface returns an array of the entryType values supported by the user agent.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/supportedEntryTypes_static)

## Methods

### `attachRouteState(route, action)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `route` | `T` |
| `action` | `StateAction` |

  

Attaches trusted nested state from a navigation action to a route and removes Expo Router's internal state markers at every nested level. State without the internal `__internal__routerActionState` marker is ignored and triggers a warning in development.

Returns: `T`

The original route object when the action has no state, the state lacks the marker, or the state after removing markers is deeply equal to the route's existing state. Otherwise, returns a new route object with the nested state attached, without mutating the original route or action.

Example

```ts
// Inside a custom router's action handler, preserve nested state from the incoming action.
const route = attachRouteState(
  {
    key: nextKey(action.payload.name),
    name: action.payload.name,
    params: action.payload.params,
  },
  action
);
```

### `createBaseStackProps(dependencies)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `dependencies` | StandardNavigatorCreatePropsFactoryDeps<[StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamListBase\>\> | The navigation state and dispatch functions provided to a `createProps` factory. |

  

Creates the shared props for integrating a stack navigator with Expo Router.

Returns: `{ isPreloaded: (key: string) => boolean, isRemovalPrevented: (key: string) => boolean, pop: (count: number, sourceRouteKey: string) => void, subscribePopToTopOnParentTabPress: () => any }`

The shared stack navigator props.

Example

```tsx
import { createBaseStackProps, StackRouter, integrateWithRouter } from 'expo-router';
import { navigator } from './navigator';

export const Stack = integrateWithRouter(navigator, StackRouter, {
  createProps: createBaseStackProps,
});
```

### `createBaseTabProps(dependencies)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `dependencies` | StandardNavigatorCreatePropsFactoryDeps<[TabNavigationState](https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators)<ParamListBase\>\> | The navigation state and dispatch function provided to a `createProps` factory. |

  

Creates the shared props for integrating a tab navigator with Expo Router.

Returns: `{ isPreloaded: (key: string) => boolean, isRemovalPrevented: (key: string) => boolean, preload: (name: string) => void, routeNames: string[] }`

The shared tab navigator props.

Example

```tsx
import { createBaseTabProps, TabRouter, integrateWithRouter } from 'expo-router';
import { navigator } from './navigator';

export const Tabs = integrateWithRouter(navigator, TabRouter, {
  createProps: createBaseTabProps,
});
```

### `createNativeStackProps(args)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | StandardNavigatorCreatePropsFactoryDeps<[StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamListBase\>\> | The navigation state and dispatch functions provided to a `createProps` factory. |

  

Creates the props required to integrate Expo Router's native stack navigator.

Returns: `NativeStackNavigatorCreateProps`

The native stack navigator props.

Example

```tsx
import {
  createNativeStackProps,
  StackRouter,
  integrateWithRouter,
} from 'expo-router';
import { navigator } from './navigator';

export const Stack = integrateWithRouter(navigator, StackRouter, {
  createProps: createNativeStackProps,
});
```

### `createStandardRouterNavigator(NavigatorContent, router, ...options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `NavigatorContent` | `ComponentType<NavigatorContentProps<NavigatorOptions, EventMap, NavigatorProps, CreateProps>>` | Renders the navigator UI; receives the standard-navigation `state`, `descriptors`, `actions`, and `emitter`. |
| `router` | RouterFactory<State, [Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<{ payload: object, source: string, target: string, type: string }\>, RouterOptions\> | The router factory to use. For example, `StackRouter` or `TabRouter`. |
| `...options` | IntegrateWithRouterOptionsTuple<State, [NoInfer](https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype)<CreateProps\>, NavigatorOptions, EventMap\> | See `IntegrateWithRouterOptions`. |

  

Creates a [`standard-navigation`](https://www.npmjs.com/package/standard-navigation) navigator and wires it into Expo Router in one step. Use `integrateWithRouter` instead if you already have a navigator from `createStandardNavigator`. Props declared in both `NavigatorProps` and `CreateProps` are intersected, so incompatible types produce `never` rather than a type error at this call.

Returns: `Component<PropsWithoutRef<PickPartial<Omit<StandardUseNavigationBuilderOptions<State, NavigatorOptions, EventMap>, 'initialRouteName'> & Omit<NavigatorProps, 'initialRouteName'> & Omit<RouterOptions, 'initialRouteName'> & { unstable_screenErrorBoundary: ComponentType<ErrorBoundaryProps> }, 'children'>>> & { Protected: FunctionComponent<ProtectedProps>, Screen: (props: ScreenProps<NavigatorOptions, State, EventMap>) => null }`

Example

```tsx
import { createStandardRouterNavigator, TabRouter } from 'expo-router';

export const Tabs = createStandardRouterNavigator(MyTabsContent, TabRouter);
```

> **Deprecated:** In a future release, the native iOS header appearance becomes the only behavior and this function will be removed.

### `enableLegacyHeaderAppearance()`

Supported platforms: iOS.

Restores the previous header appearance on iOS 26+ for all native stack screens: an opaque header that uses the theme fonts, with content below the header. Earlier iOS versions already keep this appearance. Call it before the root layout renders, for example at the top level of the root `_layout` file.

> **Note:** Apple's [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/toolbars) recommend that apps reduce custom navigation bar backgrounds, because they can interfere with the background effects that the system provides.

Returns: `void`

Example

```tsx app/_layout.tsx
import { enableLegacyHeaderAppearance, Stack } from 'expo-router';

enableLegacyHeaderAppearance();

export default function RootLayout() {
  return <Stack />;
}
```

### `extendRouter(base, extension, namedParameters)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `base` | `RouterFactory<BaseState, BaseAction, BaseOptions>` |
| `extension` | [RouterExtension](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerextensioncontext)<State, Action, Options\> |
| `namedParameters`(optional) | [RouterExtensionOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerextensionoptions)<State\> |

  

Creates a router factory that merges the members returned by `extension` over the router created by `base`.

Annotate the extension's context or return type to change the state, action, or options types.

Returns: `(options: Options) => ExtendedRouter<State, Action>`

Example

```ts
const Router = extendRouter(StackRouter, ({ baseRouter }) => ({
  getStateForRouteFocus: (state, key) => { ... },
}));
```

### `extendRouterActions(base, reducer)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `base` | `RouterFactory<State, BaseAction, BaseOptions>` |
| `reducer` | [RouterActionReducer](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionreducerstate-action-context)<State, Action, Options\> |

  

Creates a router factory whose `getStateForAction` runs `reducer` before the base router. Every other router member, including `shouldActionChangeFocus`, is inherited; use `extendRouter` to change those.

Annotate the reducer's `action` or `context` parameter to add action types or widen the router options.

Returns: `(options: Options) => ExtendedRouter<State, Action>`

Example

```ts
const Router = extendRouterActions(StackRouter, (state, action: StackAction | ClearAction, { nextKey }) => {
  if (action.type !== 'CLEAR') {
    return RouterActionHandling.Delegate;
  }
  const route = { key: nextKey('index'), name: 'index' };
  return { state: { ...state, index: 0, routes: [route] }, affectedRouteKey: route.key };
});
```

### `integrateWithRouter(navigator, router, ...options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `navigator` | `StandardNavigator<NavigatorOptions, EventMap, NavigatorProps & CreateProps>` | The object returned by `createStandardNavigator(...)`. |
| `router` | RouterFactory<State, [Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<{ payload: object, source: string, target: string, type: string }\>, RouterOptions\> | The router factory to use. For example, `StackRouter` or `TabRouter`. |
| `...options` | IntegrateWithRouterOptionsTuple<State, [NoInfer](https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype)<CreateProps\>, NavigatorOptions, EventMap\> | See `IntegrateWithRouterOptions`. |

  

Wires an existing [`standard-navigation`](https://www.npmjs.com/package/standard-navigation) navigator into Expo Router, returning a navigator component (with a `.Screen` child) usable as a layout. Use `createStandardRouterNavigator` to create and integrate in one step.

Returns: `Component<PropsWithoutRef<PickPartial<Omit<StandardUseNavigationBuilderOptions<State, NavigatorOptions, EventMap>, 'initialRouteName'> & Omit<NavigatorProps, 'initialRouteName'> & Omit<RouterOptions, 'initialRouteName'> & { unstable_screenErrorBoundary: ComponentType<ErrorBoundaryProps> }, 'children'>>> & { Protected: FunctionComponent<ProtectedProps>, Screen: (props: ScreenProps<NavigatorOptions, State, EventMap>) => null }`

Example

```tsx
import { createStandardNavigator } from 'standard-navigation';
import { integrateWithRouter, TabRouter } from 'expo-router';

const navigator = createStandardNavigator(MyTabsContent);
export const Tabs = integrateWithRouter(navigator, TabRouter);
```

### `isActionHandled(result)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `result` | [Unhandled](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#unhandled) | [RouterActionResult](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionresult)<State\> | null |

  

Checks whether a router's `getStateForAction` handled the action. Use it instead of comparing the result with `null`, because a router can leave an action unhandled with `RouterActionHandling.Unhandled` or the deprecated `null`.

Returns: `result`

Example

```ts
const result = baseRouter.getStateForAction(state, action);
if (!isActionHandled(result)) {
  return result;
}
```

### `NavigationAwareActivity(hideWhenNestedAtLevel)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `hideWhenNestedAtLevel` | { children: [ReactNode](https://reactnative.dev/docs/react-node), hideWhenNestedAtLevel: number } | How many screens must sit above this one before it hides. `1` hides the screen as soon as it loses focus, which also works in tabs and drawers. Defaults to `2`. Note: This API is unstable and may change or be removed in any release. |

  

Wraps the screen contents in a React `Activity` that hides once the screen is buried deep enough in the stack. Hiding runs effect cleanups and releases resources, but keeps React state, so the screen looks unchanged when the user navigates back to it.

Must be rendered inside a screen component.

Returns: `Element`

### `StackRouter(options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `options` | [StackRouterOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#stackrouteroptions) |

  

StackRouter is considered an internal implementation and its behavior may change without a notice between expo-router's version

Returns: `ExtendedRouter<StackNavigationState<ParamListBase>, CommonNavigationAction | StackActionType>`

### `TabRouter(options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `options` | [TabRouterOptions](https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators) |

  

TabRouter is considered an internal implementation and its behavior may change without a notice between expo-router's version

Returns: `ExtendedRouter<TabNavigationState<ParamListBase>, CommonNavigationAction | TabActionType>`

> **Deprecated:** Use `createStandardRouterNavigator` instead.

### `unstable_createStandardRouterNavigator(NavigatorContent, router, ...options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `NavigatorContent` | `ComponentType<NavigatorContentProps<NavigatorOptions, EventMap, NavigatorProps, CreateProps>>` | Renders the navigator UI; receives the standard-navigation `state`, `descriptors`, `actions`, and `emitter`. |
| `router` | RouterFactory<State, [Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<{ payload: object, source: string, target: string, type: string }\>, RouterOptions\> | The router factory to use. For example, `StackRouter` or `TabRouter`. |
| `...options` | IntegrateWithRouterOptionsTuple<State, [NoInfer](https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype)<CreateProps\>, NavigatorOptions, EventMap\> | See `IntegrateWithRouterOptions`. |

  

Returns: `Component<PropsWithoutRef<PickPartial<Omit<StandardUseNavigationBuilderOptions<State, NavigatorOptions, EventMap>, 'initialRouteName'> & Omit<NavigatorProps, 'initialRouteName'> & Omit<RouterOptions, 'initialRouteName'> & { unstable_screenErrorBoundary: ComponentType<ErrorBoundaryProps> }, 'children'>>> & { Protected: FunctionComponent<ProtectedProps>, Screen: (props: ScreenProps<NavigatorOptions, State, EventMap>) => null }`

### `unstable_enablePerformanceIntegration()`

Supported platforms: Android, iOS, tvOS, Web.

Starts recording the performance marks of Expo Router navigation. Call it before the root layout mounts, for example at the top level of the root `_layout` file.

Returns: `void`

> **Deprecated:** Use `integrateWithRouter` instead.

### `unstable_integrateWithRouter(navigator, router, ...options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `navigator` | `StandardNavigator<NavigatorOptions, EventMap, NavigatorProps & CreateProps>` | The object returned by `createStandardNavigator(...)`. |
| `router` | RouterFactory<State, [Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<{ payload: object, source: string, target: string, type: string }\>, RouterOptions\> | The router factory to use. For example, `StackRouter` or `TabRouter`. |
| `...options` | IntegrateWithRouterOptionsTuple<State, [NoInfer](https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype)<CreateProps\>, NavigatorOptions, EventMap\> | See `IntegrateWithRouterOptions`. |

  

Returns: `Component<PropsWithoutRef<PickPartial<Omit<StandardUseNavigationBuilderOptions<State, NavigatorOptions, EventMap>, 'initialRouteName'> & Omit<NavigatorProps, 'initialRouteName'> & Omit<RouterOptions, 'initialRouteName'> & { unstable_screenErrorBoundary: ComponentType<ErrorBoundaryProps> }, 'children'>>> & { Protected: FunctionComponent<ProtectedProps>, Screen: (props: ScreenProps<NavigatorOptions, State, EventMap>) => null }`

### `unstable_useIsNavigating()`

Supported platforms: Android, iOS, tvOS, Web.

Returns whether a navigation is queued or its state update is pending.

The current screen can remain visible while this returns `true` if the destination suspends. `navigation.dispatchSync` bypasses the queue, and native back gestures never enter it, so this hook does not report navigation triggered by either one. Returns `false` when called outside an Expo Router root.

Returns: `boolean`

> **Deprecated:** Use `integrateWithRouter` instead.

### `withLayoutContext(Nav, processScreens)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `Nav` | `T` | The navigator component to wrap. |
| `processScreens`(optional) | `(screens: undefined) => undefined` | A function that processes the screens before passing them to the navigator. It must preserve every screen name exactly once because guards are associated with the original screen names. |

  

Returns a navigator that automatically injects matched routes and renders nothing when there are no children. Return type with `children` prop optional.

Enables use of other built-in React Navigation navigators and other navigators built with the React Navigation custom navigator API.

Returns: `Component<PropsWithoutRef<PickPartial<ComponentProps<T>, 'children'>>> & { Protected: FunctionComponent<ProtectedProps>, Screen: (props: ScreenProps<TOptions, TState, TEventMap>) => null }`

Example

```tsx app/_layout.tsx
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const MaterialTopTabs = createMaterialTopTabNavigator();

const ExpoRouterMaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof MaterialTopTabs.Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(MaterialTopTabs.Navigator);

export default function TabLayout() {
  return <ExpoRouterMaterialTopTabs />;
}
```

## Interfaces

### `BaseRouterPerformanceMark`

Supported platforms: Android, iOS, tvOS, Web.

Extends: [PerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#performancemark)

A performance mark recorded by Expo Router. To read `detail`, check its `name` and cast it to the matching mark type, such as `RouterPageFocusedMark`.

| Property | Type | Description |
| --- | --- | --- |
| detail | [Detail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#detail) | The page or action data of the mark. |
| entryType | `'mark'` | The read-only **`entryType`** property returns a string representing the type of performance metric that this entry represents. [MDN Reference](https://developer.mozilla.org/docs/Web/API/PerformanceEntry/entryType) |
| name | [Name](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#name) | The name of the mark, which also determines the shape of `detail`. |

### `RouterActionMarkDetail`

Supported platforms: Android, iOS, tvOS, Web.

The navigation action that an `expo-router:action-enqueued` or `expo-router:action-dispatched` mark describes.

| Property | Type | Description |
| --- | --- | --- |
| actionId | `number` | Same value on the `expo-router:action-enqueued` and `expo-router:action-dispatched` marks of one action. |
| actionType | `string` | The type of the dispatched navigation action, for example `NAVIGATE`. |

### `RouterPageMarkDetail`

Supported platforms: Android, iOS, tvOS, Web.

The page that a page mark describes.

| Property | Type | Description |
| --- | --- | --- |
| params | `UnknownOutputParams` | The route and search params of the page. |
| pathname | `string` | The pathname of the page, for example `/users/42`. |
| screenId | `string` | The navigation route key of the screen. It stays the same while the screen is mounted. |
| segments | `string[]` | The route segments of the page, for example `['users', '[id]']`. |

### `StandardNavigatorDescriptor`

Supported platforms: Android, iOS, tvOS, Web.

Extends: `NavigatorDescriptor<NavigatorOptions>`

A standard-navigation descriptor extended with Expo Router route information.

| Property | Type | Description |
| --- | --- | --- |
| routeSource(optional) | [RouteSource](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routesource) | Indicates whether Expo Router received the route from a layout declaration or inferred it from the filesystem. |

## Types

### `CommonNavigationAction`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: `CommonActions.Action` | `CommonActions.InternalRouteNamesChangedAction`

### `DefaultRouterOptions`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| initialRouteName(optional) | `RouteName` | Name of the route to focus by on initial render. If not specified, usually the first route is used. |

### `EffectCallback()`

Supported platforms: Android, iOS, tvOS, Web.

Memoized callback containing the effect, should optionally return a cleanup function.

Returns:

`undefined | void | () => void`

### `ExperimentalStackNavigationEventMap`

Supported platforms: Android, iOS, tvOS, Web.

Navigator-level events emitted by `ExperimentalStack`. Mirrors the subset of `NativeStackNavigationEventMap` that the gamma `Stack.Screen` lifecycle callbacks can drive.

| Property | Type | Description |
| --- | --- | --- |
| gestureCancel | `{ data: undefined }` | - |
| removePrevented | `{ data: { action: NavigationAction } }` | - |
| transitionEnd | `{ data: { closing: boolean } }` | - |
| transitionStart | `{ data: { closing: boolean } }` | - |

### `ExperimentalStackNavigationOptions`

Supported platforms: Android, iOS, tvOS, Web.

Options accepted by `ExperimentalStack` screens. Mirrors the narrow option surface of the gamma `<Stack.HeaderConfig>` component from `react-native-screens/experimental`. Anything outside this shape is dropped with a `__DEV__` warning at runtime.

| Property | Type | Description |
| --- | --- | --- |
| headerBackVisible(optional) | `boolean` | - |
| headerShown(optional) | `boolean` | - |
| headerTransparent(optional) | `boolean` | - |
| title(optional) | `string` | - |

### `ExperimentalStackNavigationProp`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: NavigationProp<ParamList, RouteName, [NavigatorID](https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators), [StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamList\>, [ExperimentalStackNavigationOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#experimentalstacknavigationoptions), [ExperimentalStackNavigationEventMap](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#experimentalstacknavigationeventmap)\> | `StackActionHelpers<ParamList>`

### `ExternalPathString`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: `{string}:{string}` | `//{string}`

### `Href<T>`

Supported platforms: Android, iOS, tvOS, Web.

The main routing type for Expo Router. It includes all available routes with strongly typed parameters. It can either be:

-   **string**: A full path like `/profile/settings` or a relative path like `../settings`.
-   **object**: An object with a `pathname` and optional `params`. The `pathname` can be a full path like `/profile/settings` or a relative path like `../settings`. The params can be an object of key-value pairs.

An Href can either be a string or an object.

Generic: `T`

Type: T ? T[href] : string | [HrefObject](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hrefobject)

### `HrefObject`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| params(optional) | `UnknownInputParams` | Optional parameters for the route. |
| pathname | `string` | The path of the route. |

### `ImperativeRouter`

Supported platforms: Android, iOS, tvOS, Web.

Returns `router` object for imperative navigation API.

Example

```tsx
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function Route() {

 return (
  <Text onPress={() => router.push('/home')}>Go Home</Text>
 );
}
```

| Property | Type | Description |
| --- | --- | --- |
| back | `(options: TransitionOptions) => void` | Goes back in the navigation history. |
| canDismiss | `() => boolean` | Checks if it is possible to dismiss the current screen. Returns `true` if the router is within the stack with more than one screen in stack's history. |
| canGoBack | `() => boolean` | Navigates to a route in the navigator's history if it supports invoking the `back` function. |
| dismiss | `(count: number, options: TransitionOptions) => void` | Navigates to a stack lower than the current screen using the provided count if possible, otherwise 1. If the current screen is the only route, it will dismiss the entire stack. |
| dismissAll | `(options: TransitionOptions) => void` | Returns to the first screen of the closest stack, dismissing all screens above it. |
| dismissTo | (href: [Href](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft), options: [NavigationOptions](https://reactnavigation.org/docs/screen-options/)) => void | Dismisses screens until the provided href is reached. If the href is not found, it will instead replace the current screen with the provided `href`. |
| navigate | (href: [Href](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft), options: [NavigationOptions](https://reactnavigation.org/docs/screen-options/)) => void | Navigates to the provided [`href`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft). |
| prefetch | (href: [Href](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft), options: [NavigationOptions](https://reactnavigation.org/docs/screen-options/)) => void | Prefetches a route in the background before navigating to it. |
| push | (href: [Href](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft), options: [NavigationOptions](https://reactnavigation.org/docs/screen-options/)) => void | Navigates to the provided [`href`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft) using a push operation if possible. |
| replace | (href: [Href](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft), options: [NavigationOptions](https://reactnavigation.org/docs/screen-options/)) => void | Navigates to route without appending to the history. Can be used with [`useFocusEffect`](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#usefocuseffecteffect-do_not_pass_a_second_prop) to redirect imperatively to a new screen. See: Using useRouter() hook to redirect. |
| setParams | (params: [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)<RouteInputParams<T\>\>) => void | Updates the current route's query params. |
| setTransitionMode | (mode: [NavigationTransitionMode](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#navigationtransitionmode)) => void | Configures which queued navigation operations use React transitions. The default is `preload-only`; `never` cannot be overridden by individual operations. |

### `IntegrateWithRouterOptions`

Supported platforms: Android, iOS, tvOS, Web.

Type: `CreatePropsOption<State, CreateProps>` extended by:

| Property | Type | Description |
| --- | --- | --- |
| activityDefaultThreshold(optional) | `number` | Number of screens above a route that hides its content when `activityEnabled` is `true`. Default: `1` |
| processDescriptors(optional) | `(descriptors: PlaceholderDescriptorMap<NavigatorOptions>, state: State, describe: DescribePlaceholderRoute<NavigatorOptions>) => PlaceholderDescriptorMap<NavigatorOptions>` | Creates additional descriptors before `processState` and navigator rendering. |
| processScreens(optional) | `(screens: undefined) => undefined` | Transforms the screens declared as children of the navigator before they are rendered. Example.
```tsx
processScreens: (screens) =>
  screens.map((screen) => ({ ...screen, options: { ...screen.options, title: screen.name } })),
```

 |
| processState(optional) | `(state: State, descriptors: PlaceholderDescriptorMap<NavigatorOptions>, describe: DescribePlaceholderRoute<NavigatorOptions>) => State` | Pre-processes the builder state before it is converted to standard-navigation state. Example.

```tsx
processState: (state) => ({
  ...state,
  routes: state.routes.filter((route) => route.params?.hidden !== true),
})
```

 |

> **Deprecated:** Use the `I18nManager` API from `react-native` to read locale direction. Will be removed in a future SDK.

### `LocaleDirection`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `string`

Acceptable values are: `'ltr'` | `'rtl'`

### `NativeIntent`

Supported platforms: Android, iOS, tvOS, Web.

Created by using a special file called `+native-intent.tsx` at the top-level of your project's **app** directory. It exports `redirectSystemPath` or `legacy_subscribe` functions, both methods designed to handle URL/path processing.

Useful for re-writing URLs to correctly target a route when unique/referred URLs are incoming from third-party providers or stale URLs from previous versions.

> **See:** For more information on how to use `NativeIntent`, see [Customizing links](https://docs.expo.dev/router/advanced/native-intent.md).

| Property | Type | Description |
| --- | --- | --- |
| legacy_subscribe(optional) | `(listener: (url: string) => void) => undefined | void | () => void` | Experimentally available in SDK 52. Useful as an alternative API when a third-party provider doesn't support Expo Router but has support for React Navigation via `Linking.subscribe()` for existing projects. Using this API is not recommended for newer projects or integrations since it is incompatible with Server Side Routing and [Static Rendering](https://docs.expo.dev/router/web/static-rendering.md), and can become challenging to manage while offline or in a low network environment. |
| redirectSystemPath(optional) | (event: { initial: boolean, path: string }) => [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<string | null\> | string | null | A special method used to process URLs in native apps. When invoked, it receives an `options` object with the following properties:
-   **path**: represents the URL or path undergoing processing.
-   **initial**: a boolean indicating whether the path is the app's initial URL.

. Its return value should be a `string`, a `Promise<string | null>`, or `null`. When a falsy value is returned (for example, `null`), no redirection occurs and the app stays on the current path. Note that throwing errors within this method may result in app crashes. It's recommended to wrap your code inside a `try/catch` block and utilize `.catch()` when appropriate. See: For usage information, see Redirecting system paths. |

### `NativeStackDescriptorMap`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| key[(index signature)](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) | `NativeStackDescriptor` | - |

### `NativeStackHeaderItem`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

An item that can be displayed in the header. It can be a button, a menu, spacing, or a custom element.

On iOS 26, when showing items on the right side of the header, if the items don't fit the available space, they will be collapsed into a menu automatically. Items with `type: 'custom'` will not be included in this automatic collapsing behavior.

Acceptable values are: [NativeStackHeaderItemButton](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitembutton) | [NativeStackHeaderItemMenu](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitemmenu) | [NativeStackHeaderItemSpacing](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitemspacing) | [NativeStackHeaderItemCustom](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitemcustom)

### `NativeStackHeaderItemButton`

Supported platforms: Android, iOS, tvOS, Web.

A button item in the header.

Type: `SharedHeaderItem` extended by:

| Property | Type | Description |
| --- | --- | --- |
| onPress | `() => void` | Function to call when the item is pressed. |
| selected(optional) | `boolean` | Whether the item is in a selected state. Read more: [https://developer.apple.com/documentation/uikit/uibarbuttonitem/isselected](https://developer.apple.com/documentation/uikit/uibarbuttonitem/isselected) |
| type | `'button'` | Type of the item. |

### `NativeStackHeaderItemCustom`

Supported platforms: Android, iOS, tvOS, Web.

A custom item to display any React Element in the header.

| Property | Type | Description |
| --- | --- | --- |
| element | `React.ReactElement` | A React Element to display as the item. |
| hidesSharedBackground(optional) | `boolean` | Whether the background this item may share with other items in the bar should be hidden. Only available from iOS 26.0 and later. Read more: [https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground](https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground) |
| type | `'custom'` | - |

### `NativeStackHeaderItemMenu`

Supported platforms: Android, iOS, tvOS, Web.

An item that shows a menu when pressed.

Type: `SharedHeaderItem` extended by:

| Property | Type | Description |
| --- | --- | --- |
| changesSelectionAsPrimaryAction(optional) | `boolean` | Whether the menu is a selection menu. Tapping an item in a selection menu will add a checkmark to the selected item. Read more: [https://developer.apple.com/documentation/uikit/uibarbuttonitem/changesselectionasprimaryaction](https://developer.apple.com/documentation/uikit/uibarbuttonitem/changesselectionasprimaryaction) |
| menu | { items: ([NativeStackHeaderItemMenuAction](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitemmenuaction) | [NativeStackHeaderItemMenuSubmenu](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitemmenusubmenu))[], layout: 'default' | 'palette', multiselectable: boolean, title: string } | Menu for the item. |
| type | `'menu'` | - |

### `NativeStackHeaderItemMenuAction`

Supported platforms: Android, iOS, tvOS, Web.

An action item in a menu.

| Property | Type | Description |
| --- | --- | --- |
| description(optional) | `string` | The secondary text displayed alongside the label of the menu item. |
| destructive(optional) | `boolean` | Whether to apply destructive style to the item. Read more: [https://developer.apple.com/documentation/uikit/uimenuelement/attributes/destructive](https://developer.apple.com/documentation/uikit/uimenuelement/attributes/destructive) |
| disabled(optional) | `boolean` | Whether to apply disabled style to the item. Read more: [https://developer.apple.com/documentation/uikit/uimenuelement/attributes/disabled](https://developer.apple.com/documentation/uikit/uimenuelement/attributes/disabled) |
| discoverabilityLabel(optional) | `string` | An elaborated title that explains the purpose of the action. On iOS, the system displays this title in the discoverability heads-up display (HUD). If this is not set, the HUD displays the title property. Read more: [https://developer.apple.com/documentation/uikit/uiaction/discoverabilitytitle](https://developer.apple.com/documentation/uikit/uiaction/discoverabilitytitle) |
| hidden(optional) | `boolean` | Whether to apply hidden style to the item. Read more: [https://developer.apple.com/documentation/uikit/uimenuelement/attributes/hidden](https://developer.apple.com/documentation/uikit/uimenuelement/attributes/hidden) |
| icon(optional) | `PlatformIconIOS` | Icon for the menu item. |
| keepsMenuPresented(optional) | `boolean` | Whether to keep the menu presented after firing the element’s action. Read more: [https://developer.apple.com/documentation/uikit/uimenuelement/attributes/keepsmenupresented](https://developer.apple.com/documentation/uikit/uimenuelement/attributes/keepsmenupresented) |
| label | `string` | Label for the menu item. |
| onPress | `() => void` | Function to call when the menu item is pressed. |
| state(optional) | `'on' | 'off' | 'mixed'` | The state of an action- or command-based menu item. Read more: [https://developer.apple.com/documentation/uikit/uimenuelement/state](https://developer.apple.com/documentation/uikit/uimenuelement/state) |
| type | `'action'` | - |

### `NativeStackHeaderItemMenuSubmenu`

Supported platforms: Android, iOS, tvOS, Web.

A submenu item that contains other menu items.

| Property | Type | Description |
| --- | --- | --- |
| destructive(optional) | `boolean` | Whether to apply destructive style to the menu item. Read more: [https://developer.apple.com/documentation/uikit/uimenuelement/attributes/destructive](https://developer.apple.com/documentation/uikit/uimenuelement/attributes/destructive) |
| icon(optional) | `PlatformIconIOS` | Icon for the submenu item. |
| inline(optional) | `boolean` | Whether the menu is displayed inline with the parent menu. By default, submenus are displayed after expanding the parent menu item. Inline menus are displayed as part of the parent menu as a section. Defaults to `false`. Read more: [https://developer.apple.com/documentation/uikit/uimenu/options-swift.struct/displayinline](https://developer.apple.com/documentation/uikit/uimenu/options-swift.struct/displayinline) |
| items | `[items]` | Array of menu items (actions or submenus). |
| label | `string` | Label for the submenu item. |
| layout(optional) | `'default' | 'palette'` | How the submenu items are displayed.
-   `default`: menu items are displayed normally.
-   `palette`: menu items are displayed in a horizontal row.

. Defaults to `default`. Read more: [https://developer.apple.com/documentation/uikit/uimenu/options-swift.struct/displayaspalette](https://developer.apple.com/documentation/uikit/uimenu/options-swift.struct/displayaspalette) |
| multiselectable(optional) | `boolean` | Whether multiple items in the submenu can be selected, i.e. in "on" state. Defaults to `false`. Read more: [https://developer.apple.com/documentation/uikit/uimenu/options-swift.struct/singleselection](https://developer.apple.com/documentation/uikit/uimenu/options-swift.struct/singleselection) |
| type | `'submenu'` | - |

### `NativeStackHeaderItemSpacing`

Supported platforms: Android, iOS, tvOS, Web.

An item to add spacing between other items in the header.

| Property | Type | Description |
| --- | --- | --- |
| spacing | `number` | The amount of spacing to add. |
| type | `'spacing'` | - |

### `NativeStackNavigationEventMap`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| gestureCancel | `{ data: undefined }` | Event which fires when a swipe back is canceled on iOS. |
| sheetDetentChange | `{ data: { index: number, stable: boolean } }` | Event which fires when screen is in sheet presentation & it's detent changes. In payload it carries two fields:
-   `index` - current detent index in the `sheetAllowedDetents` array,
-   `stable` - on Android `false` value means that the user is dragging the sheet or it is settling; on iOS it is always `true`.

 |
| transitionEnd | `{ data: { closing: boolean } }` | Event which fires when a transition animation ends. |
| transitionStart | `{ data: { closing: boolean } }` | Event which fires when a transition animation starts. |

### `NativeStackNavigationOptions`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| animation(optional) | `ScreenProps[stackAnimation]` | How the screen should animate when pushed or popped. Supported values:
-   "default": use the platform default animation
-   "fade": fade screen in or out
-   "fade_from_bottom" – performs a fade from bottom animation
-   "flip": flip the screen, requires presentation: "modal" (iOS only)
-   "simple_push": use the platform default animation, but without shadow and native header transition (iOS only)
-   "slide_from_bottom": slide in the new screen from bottom
-   "slide_from_right": slide in the new screen from right (Android only, uses default animation on iOS)
-   "slide_from_left": slide in the new screen from left (Android only, uses default animation on iOS)
-   "ios_from_right" - iOS like slide in animation. pushes in the new screen from right to left (Android only, resolves to default transition on iOS)
-   "ios_from_left" - iOS like slide in animation. pushes in the new screen from left to right (Android only, resolves to default transition on iOS)
-   "none": don't animate the screen

. Only supported on iOS and Android. |
| animationDuration(optional) | `number` | Supported platforms: iOS. Duration (in milliseconds) for the following transition animations on iOS:

-   `slide_from_bottom`
-   `fade_from_bottom`
-   `fade`
-   `simple_push`

. Defaults to `500`. The duration is not customizable for:

-   Screens with `default` and `flip` animations
-   Screens with `presentation` set to `modal`, `formSheet`, `pageSheet` (regardless of animation)

 |
| animationMatchesGesture(optional) | `boolean` | Supported platforms: iOS. Whether the gesture to dismiss should use animation provided to `animation` prop. Defaults to `false`. Doesn't affect the behavior of screens presented modally. |
| animationTypeForReplace(optional) | `ScreenProps[replaceAnimation]` | The type of animation to use when this screen replaces another screen. Defaults to `pop`. Supported values:

-   "push": the new screen will perform push animation.
-   "pop": the new screen will perform pop animation.

. Only supported on iOS and Android. |
| autoHideHomeIndicator(optional) | `boolean` | Supported platforms: iOS. Whether the home indicator should prefer to stay hidden on this screen. Defaults to `false`. |
| contentStyle(optional) | StyleProp<[ViewStyle](https://reactnative.dev/docs/view-style-props)\> | Style object for the scene content. |
| freezeOnBlur(optional) | `boolean` | Deprecated: This option has no effect in Expo Router. |
| fullScreenGestureEnabled(optional) | `boolean` | Supported platforms: iOS. Whether the gesture to dismiss should work on the whole screen. The behavior depends on iOS version. On iOS 18 and below: `false` by default. If enabled, swipe gesture will use `simple_push` transition animation by default. It can be changed with `animation` & `animationMatchesGesture` props, but default iOS swipe animation is not achievable. On iOS 26 and up: `true` by default to match new native behavior. You can still customize it with `animation` & `animationMatchesGesture` props. Doesn't affect the behavior of screens presented modally. |
| fullScreenGestureShadowEnabled(optional) | `boolean` | Deprecated: since iOS 26. Supported platforms: iOS. iOS 18 and below. Controls whether the full screen dismiss gesture has shadow under view during transition. The gesture uses custom transition and thus doesn't have a shadow by default. When enabled, a custom shadow view is added during the transition which tries to mimic the default iOS shadow. Defaults to `true`. This does not affect the behavior of transitions that don't use gestures, enabled by `fullScreenGestureEnabled` prop. |
| gestureDirection(optional) | `ScreenProps[swipeDirection]` | Supported platforms: iOS. Sets the direction in which you should swipe to dismiss the screen. When using `vertical` option, options `fullScreenGestureEnabled: true`, `animationMatchesGesture: true` and `animation: 'slide_from_bottom'` are set by default. Supported values:

-   `vertical` – dismiss screen vertically
-   `horizontal` – dismiss screen horizontally (default)

 |
| gestureEnabled(optional) | `boolean` | Supported platforms: iOS. Whether you can use gestures to dismiss this screen. Defaults to `true`. Only supported on iOS. |
| gestureResponseDistance(optional) | `ScreenProps[gestureResponseDistance]` | Supported platforms: iOS. Use it to restrict the distance from the edges of screen in which the gesture should be recognized. To be used alongside `fullScreenGestureEnabled`. |
| header(optional) | `(props: NativeStackHeaderProps) => React.ReactNode` | Function that given `HeaderProps` returns a React Element to display as a header. |
| headerBackButtonDisplayMode(optional) | `ScreenStackHeaderConfigProps[backButtonDisplayMode]` | Supported platforms: iOS, web. How the back button displays icon and title. Supported values:

-   "default" - Displays one of the following depending on the available space: previous screen's title, generic title (e.g. 'Back') or no title (only icon).
-   "generic" – Displays one of the following depending on the available space: generic title (e.g. 'Back') or no title (only icon).
-   "minimal" – Always displays only the icon without a title.

. The space-aware behavior is disabled when:

-   The iOS version is 13 or lower
-   Custom font family or size is set (e.g. with `headerBackTitleStyle`)
-   Back button menu is disabled (e.g. with `headerBackButtonMenuEnabled`)

. In such cases, a static title and icon are always displayed. Defaults to "default" on iOS, and "minimal" on other platforms. Only supported on iOS and Web. |
| headerBackButtonMenuEnabled(optional) | `boolean` | Supported platforms: iOS. Boolean indicating whether to show the menu on longPress of iOS >= 14 back button. Defaults to `true`. Requires `react-native-screens` version >=3.3.0. Only supported on iOS. |
| headerBackground(optional) | `() => React.ReactNode` | Function which returns a React Element to render as the background of the header. This is useful for using backgrounds such as an image, a gradient, blur effect etc. You can use this with `headerTransparent` to render content underneath a translucent header. |
| headerBackIcon(optional) | { source: [ImageSourcePropType](https://reactnative.dev/docs/image#imagesource), type: 'image' } | Icon to display in the header as the icon in the back button. Defaults to back icon image for the platform

-   A chevron on iOS
-   An arrow on Android

. Example.

```js
headerBackIcon: {
  type: 'image',
  source: require('./back-icon.png'),
}
```

 |
| headerBackImageSource(optional) | [ImageSourcePropType](https://reactnative.dev/docs/image#imagesource) | Deprecated: Use headerBackIcon instead. Image to display in the header as the icon in the back button. |
| headerBackTitle(optional) | `string` | Supported platforms: iOS, web. Title string used by the back button on iOS. Defaults to the previous scene's title. On iOS the text might be shortened to "Back" or arrow icon depending on the available space, following native iOS behaviour. See `headerBackButtonDisplayMode` to read about limitations and interactions with other props. Use `headerBackButtonDisplayMode: "minimal"` to hide it. Only supported on iOS and Web. |
| headerBackTitleStyle(optional) | `StyleProp<{ fontFamily: string, fontSize: number }>` | Supported platforms: iOS, web. Style object for header back title. Supported properties:

-   fontFamily
-   fontSize

. Only supported on iOS and Web. |
| headerBackVisible(optional) | `boolean` | Whether the back button is visible in the header. You can use it to show a back button alongside `headerLeft` if you have specified it. This will have no effect on the first screen in the stack. |
| headerBlurEffect(optional) | `ScreenStackHeaderConfigProps[blurEffect]` | Supported platforms: iOS. Blur effect for the translucent header. The `headerTransparent` option needs to be set to `true` for this to work. **Note:** Using both `headerBlurEffect` and `scrollEdgeEffects` (>= iOS 26) simultaneously may cause overlapping effects. Only supported on iOS. |
| headerLargeStyle(optional) | StyleProp<{ backgroundColor: [ColorValue](https://reactnative.dev/docs/colors) }\> | Supported platforms: iOS. Style of the header when a large title is shown. The large title is shown if `headerLargeTitle` is `true` and the edge of any scrollable content reaches the matching edge of the header. Supported properties:

-   backgroundColor

. Only supported on iOS. |
| headerLargeTitle(optional) | `boolean` | Deprecated: Use headerLargeTitleEnabled instead. Whether to enable header with large title which collapses to regular header on scroll. |
| headerLargeTitleEnabled(optional) | `boolean` | Supported platforms: iOS. Whether to enable header with large title which collapses to regular header on scroll. For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`. If the scrollable area doesn't fill the screen, the large title won't collapse on scroll. You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc. Only supported on iOS. |
| headerLargeTitleShadowVisible(optional) | `boolean` | Supported platforms: iOS. Whether drop shadow of header is visible when a large title is shown. Only supported on iOS. |
| headerLargeTitleStyle(optional) | StyleProp<{ color: [ColorValue](https://reactnative.dev/docs/colors), fontFamily: string, fontSize: number, fontWeight: string }\> | Supported platforms: iOS. Style object for large title in header. Supported properties:

-   fontFamily
-   fontSize
-   fontWeight
-   color

. Only supported on iOS. |
| headerLeft(optional) | `(props: NativeStackHeaderBackProps) => React.ReactNode` | Function which returns a React Element to display on the left side of the header. This replaces the back button. See `headerBackVisible` to show the back button along side left element. Will be overriden by `headerLeftItems` on iOS. |
| headerRight(optional) | `(props: NativeStackHeaderItemProps) => React.ReactNode` | Function which returns a React Element to display on the right side of the header. Will be overriden by `headerRightItems` on iOS. |
| headerSearchBarOptions(optional) | `SearchBarProps` | Options to render a native search bar. You also need to specify `contentInsetAdjustmentBehavior="automatic"` in your `ScrollView`, `FlatList` etc. If you don't have a `ScrollView`, specify `headerTransparent: false`. |
| headerShadowVisible(optional) | `boolean` | Whether to hide the elevation shadow (Android) or the bottom border (iOS) on the header. |
| headerShown(optional) | `boolean` | Whether to show the header. The header is shown by default. Setting this to `false` hides the header. |
| headerStyle(optional) | StyleProp<{ backgroundColor: [ColorValue](https://reactnative.dev/docs/colors) }\> | Style object for header. Supported properties:

-   backgroundColor

 |
| headerTintColor(optional) | [ColorValue](https://reactnative.dev/docs/colors) | Tint color for the header. Changes the color of back button and title. |
| headerTitle(optional) | string | (props: { children: string, tintColor: [ColorValue](https://reactnative.dev/docs/colors) }) => React.ReactNode | String or a function that returns a React Element to be used by the header. Defaults to screen `title` or route name. When a function is passed, it receives `tintColor` and`children` in the options object as an argument. The title string is passed in `children`. Note that if you render a custom element by passing a function, animations for the title won't work. |
| headerTitleAlign(optional) | `'left' | 'center'` | How to align the header title. Defaults to `left` on platforms other than iOS. Not supported on iOS. It's always `center` on iOS and cannot be changed. |
| headerTitleStyle(optional) | StyleProp<[Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[TextStyle](https://reactnative.dev/docs/text-style-props), 'fontFamily' | 'fontSize' | 'fontWeight'\> & { color: [ColorValue](https://reactnative.dev/docs/colors) }\> | Style object for header title. Supported properties:

-   fontFamily
-   fontSize
-   fontWeight
-   color

 |
| headerTransparent(optional) | `boolean | { android: boolean, ios: boolean, web: boolean }` | Boolean indicating whether the navigation bar is translucent. Setting this to `true` makes the header absolutely positioned, and changes the background color to `transparent` unless specified in `headerStyle`. Pass an object to set a different value on each platform. Defaults to `{ ios: true, android: false, web: false }`. On iOS, the default applies only on iOS 26+ with Liquid Glass, and only when no header background is set. |
| headerUserInterfaceStyle(optional) | `'light' | 'dark'` | Supported platforms: iOS. Interface style of the native header. Defaults to the navigation theme's style. The native header does not support changes to this option while the screen is visible. Only supported on iOS. |
| keyboardHandlingEnabled(optional) | `boolean` | Supported platforms: iOS. Whether the keyboard should hide when swiping to the previous screen. Defaults to `false`. |
| navigationBarColor(optional) | [ColorValue](https://reactnative.dev/docs/colors) | Deprecated: For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default. This prop is subject to removal in the future. See: https://developer.android.com/about/versions/15/behavior-changes-15#ux. Supported platforms: Android. Sets the navigation bar color. Defaults to initial navigation bar color. |
| navigationBarHidden(optional) | `boolean` | Supported platforms: Android. Sets the visibility of the navigation bar. Defaults to `false`. |
| navigationBarTranslucent(optional) | `boolean` | Deprecated: For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default. This prop is subject to removal in the future. See: https://developer.android.com/about/versions/15/behavior-changes-15#ux. Supported platforms: Android. Boolean indicating whether the content should be visible behind the navigation bar. Defaults to `false`. |
| orientation(optional) | `ScreenProps[screenOrientation]` | The display orientation to use for the screen. Supported values:

-   "default" - resolves to "all" without "portrait_down" on iOS. On Android, this lets the system decide the best orientation.
-   "all": all orientations are permitted.
-   "portrait": portrait orientations are permitted.
-   "portrait_up": right-side portrait orientation is permitted.
-   "portrait_down": upside-down portrait orientation is permitted.
-   "landscape": landscape orientations are permitted.
-   "landscape_left": landscape-left orientation is permitted.
-   "landscape_right": landscape-right orientation is permitted.

. Only supported on iOS and Android. |
| presentation(optional) | [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)<ScreenProps[stackPresentation], 'push'\> | 'card' | How should the screen be presented. Supported values:

-   "card": the new screen will be pushed onto a stack, which means the default animation will be slide from the side on iOS, the animation on Android will vary depending on the OS version and theme.
-   "modal": the new screen will be presented modally. this also allows for a nested stack to be rendered inside the screen.
-   "transparentModal": the new screen will be presented modally, but in addition, the previous screen will stay so that the content below can still be seen if the screen has translucent background.
-   "containedModal": will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
-   "containedTransparentModal": will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
-   "fullScreenModal": will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
-   "formSheet": will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to "modal" on Android.
-   "pageSheet": will use "UIModalPresentationPageSheet" modal style on iOS and will fallback to "modal" on Android.

. Only supported on iOS and Android. |
| scrollEdgeEffects(optional) | `{ bottom: ScrollEdgeEffect, left: ScrollEdgeEffect, right: ScrollEdgeEffect, top: ScrollEdgeEffect }` | Supported platforms: iOS only supported on ios 26 and later.. Configures the scroll edge effect for the _content ScrollView_ (the ScrollView that is present in first descendants chain of the Screen). Depending on values set, it will blur the scrolling content below certain UI elements (header items, search bar) for the specified edge of the ScrollView. When set in nested containers, i.e. Native Stack inside Native Bottom Tabs, or the other way around, the ScrollView will use only the innermost one's config. **Note:** Using both `headerBlurEffect` and `scrollEdgeEffects` (>= iOS 26) simultaneously may cause overlapping effects. Edge effects can be configured for each edge separately. The following values are currently supported:

-   `automatic` - the automatic scroll edge effect style,
-   `hard` - a scroll edge effect with a hard cutoff and dividing line,
-   `soft` - a soft-edged scroll edge effect,
-   `hidden` - no scroll edge effect.

. Defaults to `automatic` for each edge. |
| sheetAllowedDetents(optional) | `number[] | 'fitToContents'` | Describes heights where a sheet can rest. Works only when `presentation` is set to `formSheet`. Heights should be described as fraction (a number from `[0, 1]` interval) of screen height / maximum detent height. You can pass an array of ascending values each defining allowed sheet detent. iOS accepts any number of detents, while **Android is limited to three**. There is also possibility to specify `fitToContents` literal, which intents to set the sheet height to the height of its contents. Note that the array **must** be sorted in ascending order. This invariant is verified only in development mode, where violation results in error. **Android is limited to up 3 values in the array** -- any surplus values, beside first three are ignored. Defaults to `[1.0]`. |
| sheetCornerRadius(optional) | `number` | The corner radius that the sheet will try to render with. Works only when `presentation` is set to `formSheet`. If set to non-negative value it will try to render sheet with provided radius, else it will apply system default. If left unset system default is used. |
| sheetElevation(optional) | `number` | Supported platforms: Android. Integer value describing elevation of the sheet, impacting shadow on the top edge of the sheet. Not dynamic - changing it after the component is rendered won't have an effect. Defaults to `24`. |
| sheetExpandsWhenScrolledToEdge(optional) | `boolean` | Supported platforms: iOS. Whether the sheet should expand to larger detent when scrolling. Works only when `presentation` is set to `formSheet`. Defaults to `true`. |
| sheetGrabberVisible(optional) | `boolean` | Supported platforms: iOS. Boolean indicating whether the sheet shows a grabber at the top. Works only when `presentation` is set to `formSheet`. Defaults to `false`. |
| sheetInitialDetentIndex(optional) | `number | 'last'` | Index of the detent the sheet should expand to after being opened. Works only when `stackPresentation` is set to `formSheet`. If the specified index is out of bounds of `sheetAllowedDetents` array, in dev environment an error will be thrown, in production the value will be reset to default value. Additionally there is `last` value available, when set the sheet will expand initially to last (largest) detent. Defaults to `0` - which represents first detent in the detents array. |
| sheetLargestUndimmedDetentIndex(optional) | `number | 'none' | 'last'` | The largest sheet detent for which a view underneath won't be dimmed. Works only when `presentation` is set to `formSheet`. This prop can be set to a number, which indicates index of detent in `sheetAllowedDetents` array for which there won't be a dimming view beneath the sheet. Additionally there are following options available:

-   `none` - there will be dimming view for all detents levels,
-   `last` - there won't be a dimming view for any detent level.

. On iOS, the native implementation might resize the sheet w/o explicitly changing the detent level, e.g. in case of keyboard appearance. In case after such resize the sheet exceeds height for which in regular scenario a dimming view would be applied - it will be applied, even if the detent has not effectively been changed. Defaults to `none`, indicating that the dimming view should be always present. |
| sheetResizeAnimationEnabled(optional) | `boolean` | Supported platforms: Android. Whether the default native animation should be used when the sheet's with `fitToContents` content size changes. When set to `true`, the sheet uses internal logic to synchronize size updates and translation animations during entry, exit, or content updates. This ensures a smooth transition for standard, static content mounting/unmounting. When set to `false`, the internal animation and translation logic is ignored. This allows the sheet to adjust its size dynamically based on the current dimensions of the content provided by the developer, allowing implementing custom resizing animations. Defaults to `true`. |
| sheetShouldOverflowTopInset(optional) | `boolean` | Supported platforms: Android. Whether the sheet content should be rendered behind the Status Bar or display cutouts. When set to `true`, the sheet will extend to the physical edges of the stack, allowing content to be visible behind the status bar or display cutouts. Detent ratios in sheetAllowedDetents will be measured relative to the full stack height. When set to `false`, the sheet's layout will be constrained by the inset from the top and the detent ratios will then be measured relative to the adjusted height (excluding the top inset). This means that sheetAllowedDetents will result in different sheet heights depending on this prop. Defaults to `false`. |
| statusBarAnimation(optional) | `ScreenProps[statusBarAnimation]` | Supported platforms: android, iOS. Sets the status bar animation (similar to the `StatusBar` component). On Android, setting either `fade` or `slide` will set the transition of status bar color. On iOS, this option applies to appereance animation of the status bar. Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file. Defaults to `fade` on iOS and `none` on Android. Only supported on Android and iOS. |
| statusBarBackgroundColor(optional) | [ColorValue](https://reactnative.dev/docs/colors) | Deprecated: For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default. This prop is subject to removal in the future. See: https://developer.android.com/about/versions/15/behavior-changes-15#ux. Supported platforms: Android. Sets the status bar color (similar to the `StatusBar` component). Defaults to initial status bar color. |
| statusBarHidden(optional) | `boolean` | Supported platforms: android, iOS. Whether the status bar should be hidden on this screen. Requires setting `View controller-based status bar appearance -> YES` in your Info.plist file. Only supported on Android and iOS. |
| statusBarStyle(optional) | `ScreenProps[statusBarStyle]` | Supported platforms: android, iOS. Sets the status bar color (similar to the `StatusBar` component). Requires setting `View controller-based status bar appearance -> YES` (or removing the config) in your `Info.plist` file. `auto` and `inverted` are supported only on iOS. On Android, they will fallback to `light`. Defaults to `auto` on iOS and `light` on Android. Only supported on Android and iOS. |
| statusBarTranslucent(optional) | `boolean` | Deprecated: For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default. This prop is subject to removal in the future. See: https://developer.android.com/about/versions/15/behavior-changes-15#ux. Supported platforms: Android. Sets the translucency of the status bar. Defaults to `false`. |
| title(optional) | `string` | String that can be displayed in the header as a fallback for `headerTitle`. |
| unstable_headerLeftItems(optional) | (props: NativeStackHeaderItemProps) => [NativeStackHeaderItem[]](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitem) | Supported platforms: iOS. Function which returns an array of items to display as on the left side of the header. Overrides `headerLeft`. This is an unstable API and might change in the future. |
| unstable_headerRightItems(optional) | (props: NativeStackHeaderItemProps) => [NativeStackHeaderItem[]](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#nativestackheaderitem) | Supported platforms: iOS. Function which returns an array of items to display as on the right side of the header. Overrides `headerRight`. This is an unstable API and might change in the future. |
| unstable_nativeProps(optional) | `NativeStackNativeProps` | Supported platforms: Android, iOS. Props passed to the underlying native stack implementation in `react-native-screens`. Use this to configure props that are not directly exposed by Expo Router. Note: This will override any other props set by Expo Router and may lead to unexpected behavior. Note: This is an unstable API and may change or be removed in minor versions. |
| unstable_sheetFooter(optional) | `() => React.ReactNode` | Supported platforms: Android. Footer component that can be used alongside formSheet stack presentation style. This option is provided, because due to implementation details it might be problematic to implement such layout with JS-only code. Note that this prop is marked as unstable and might be subject of breaking changes, including removal, in particular when we find solution that will make implementing it with JS straightforward. |

### `NativeStackNavigationProp`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: NavigationProp<ParamList, RouteName, [NavigatorID](https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators), [StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamList\>, [NativeStackNavigationOptions](https://reactnavigation.org/docs/native-stack-navigator#options), [NativeStackNavigationEventMap](https://docs.expo.dev/versions/latest/sdk/router.md#nativestacknavigationeventmap)\> | `StackActionHelpers<ParamList>`

### `NativeStackOptionsArgs`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<NativeStackScreenProps<ParamList, RouteName, [NavigatorID](https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators)\>, 'route'\> extended by:

| Property | Type | Description |
| --- | --- | --- |
| route | `DescriptorRouteProp<ParamList, RouteName>` | - |
| theme | `Theme` | - |

### `NativeStackViewState`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[StackNavigationState](https://docs.expo.dev/versions/latest/sdk/router.md#stacknavigationstate)<ParamListBase\>, 'index' | 'routes'\>

The navigator-level state consumed by `NativeStackView`.

Routes after `index` are preloaded and rendered natively-detached.

### `NavigationAction`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<{ payload: object, source: string, target: string, type: string }\>

### `NavigationState`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)<{ history: unknown[], index: number, key: string, routeKeySeq: number, routeNames: [Extract[]](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union), routes: NavigationRoute[], stale: false, type: string }\>

### `NavigationTransitionMode`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `string`

Acceptable values are: `'always'` | `'never'` | `'preload-only'`

### `PickPartial`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

The list of input keys will become optional, everything else will remain the same.

Acceptable values are: [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<T, K\> | [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)<[Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<T, K\>\>

### `PreventRemoveOptions`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| preventInPreloadedRoutes(optional) | `boolean` | Whether removal prevention remains active while the screen is preloaded. Default: `false` |

### `RedirectConfig`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| destination | `string` | - |
| destinationContextKey | `string` | - |
| external(optional) | `boolean` | - |
| methods(optional) | `string[]` | - |
| permanent(optional) | `boolean` | - |
| source | `string` | - |

### `RelativePathString`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: `./{string}` | `../{string}` | `'..'`

### `ResultState`

Supported platforms: Android, iOS, tvOS, Web.

Type: PartialState<[NavigationState](https://reactnavigation.org/docs/navigation-state)\> extended by:

| Property | Type | Description |
| --- | --- | --- |
| state(optional) | [ResultState](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#resultstate) | - |

### `RoutePath`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)<Extract[pathname], [RelativePathString](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#relativepathstring) | [ExternalPathString](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#externalpathstring)\>

### `Router`

Supported platforms: Android, iOS, tvOS, Web.

Type: `RouterType<State>` extended by:

| Property | Type | Description |
| --- | --- | --- |
| actionCreators(optional) | `ActionCreators<Action>` | Action creators for the router. |
| getBrowserHistoryForAction(optional) | (previous: State, next: State, action: Action) => [RouterBrowserHistoryAction](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerbrowserhistoryaction) | undefined | Chooses how an accepted action changes browser history. For example, Stack PUSH returns `{ type: 'push' }`, so browser Back can return to the previous screen. `extendRouter` calls this after `normalizeState`. Its return value replaces any instruction from the base router; `undefined` updates the current browser entry without adding one. |
| getBrowserHistoryForRouteFocus(optional) | (previous: State, next: State, childAction?: [RouterBrowserHistoryAction](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerbrowserhistoryaction)) => [RouterBrowserHistoryAction](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerbrowserhistoryaction) | undefined | Adjusts browser history when navigation inside a child also changes its parent. For example, pushing Details inside an open drawer closes the drawer: return `replace` to reuse the drawer's browser entry for Details. Return `undefined` to keep the child's choice. |
| getStateForAction | (state: State, action: Action, options: [RouterConfigOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerconfigoptions)) => [RouterActionResult](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionresult)<State\> | [Unhandled](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#unhandled) | null | Take the current state and action, and return a new state and the affected route key. If the action cannot be handled, return `RouterActionHandling.Unhandled`. Returning `null` is deprecated. Use `isActionHandled` to check a result. Custom routers must explicitly handle `ROUTE_NAMES_CHANGED` to durably reconcile state when their declared routes change. |
| getStateForDeclaredRoutes | `(state: State, routeNames: string[]) => State` | Take the current state and the route names the navigator declares, and return the state to render until `ROUTE_NAMES_CHANGED` has been reconciled. This is a render-phase fallback, not a state change. Return `state` when nothing was removed, and set `index` to `-1` when no declared route is left to focus. This function will only be called in development, when route file is removed. |
| getStateForRouteFocus | `(state: State, key: string) => State` | Take the current state and key of a route, and return a new state with the route focused |
| normalizeState(optional) | `(state: State) => State` | Restores router invariants, such as preload markers, on a returned state. `extendRouter` applies it to every state the router it creates returns; `useNavigationBuilder` does not call it. It must be idempotent and must not change the state's `type`. |
| shouldActionChangeFocus | `(action: NavigationAction) => boolean` | Whether the action should also change focus in parent navigator |

### `RouterActionContext`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: [RouterConfigOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerconfigoptions) | [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[RouterExtensionContext](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerextensioncontext)<State, Action, Options\>, 'baseRouter' | 'options' | 'nextKey'\>

### `RouterActionDispatchedMark`

Supported platforms: Android, iOS, tvOS, Web.

Type: [BaseRouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#baserouterperformancemark)<'expo-router:action-dispatched', [RouterActionMarkDetail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionmarkdetail)\>

A navigation action changed the navigation state.

### `RouterActionEnqueuedMark`

Supported platforms: Android, iOS, tvOS, Web.

Type: [BaseRouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#baserouterperformancemark)<'expo-router:action-enqueued', [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)<[RouterActionMarkDetail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionmarkdetail), 'actionId'\>\>

Expo Router received a navigation action, before it reduced it. If the action changes the navigation state, `expo-router:action-dispatched` marks with the same `actionId` follow.

### `RouterActionReducer(state, action, context)`

Supported platforms: Android, iOS, tvOS, Web.

Reduces one action. Return a result to handle the action, `RouterActionHandling.Delegate` to let the base router handle it, or `RouterActionHandling.Unhandled` to leave it unhandled.

| Parameter | Type |
| --- | --- |
| `state` | `State` |
| `action` | `Action` |
| `context` | [RouterActionContext](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractioncontext)<State, Action, Options\> |

Returns:

[RouterActionResult](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionresult)<State\> | [RouterActionHandling](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionhandling) | null | undefined

### `RouterActionResult`

Supported platforms: Android, iOS, tvOS, Web.

The result of reducing a navigation action.

| Property | Type | Description |
| --- | --- | --- |
| affectedRouteKey | `string | undefined` | The key of the route affected by the action. |
| browserHistory(optional) | [RouterBrowserHistoryAction](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerbrowserhistoryaction) | How this action changes browser history: `push` adds an entry, `pop` goes back, and `replace` (or omission) updates the current entry. For example, pushing Details returns `{ type: 'push' }`; Back returns `{ type: 'pop', count: 1 }`. Applied only if navigation succeeds. Restoring a browser entry does not add another entry. |
| state | `State` | The navigation state produced by the action. |

### `RouterBrowserHistoryAction`

Supported platforms: Android, iOS, tvOS, Web.

A router's instruction for synchronizing an accepted action with browser history.

Type: `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| type | `'push'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| type | `'replace'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| count | `number` | Fallback count for destinations without a tracked browser entry (e.g. an initial anchor). |
| target(optional) | `{ navigatorKey: string, routeKey: string }` | Find the destination among tracked entries, including entries made by nested navigators. |
| type | `'pop'` | - |

### `RouterConfigOptions`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| routeGetIdList | `Record<string, (options: { params: Record<string, any> }) => string | undefined | undefined>` | - |
| routeNames | `string[]` | - |

### `RouterExtension(context)`

Supported platforms: Android, iOS, tvOS, Web.

Returns the router members to merge over the base router. Members that are left out are inherited from the base router, including `actionCreators`: return a merged object to add action creators instead of replacing them. An inherited `normalizeState` runs on the extended state type, so an extension that changes the state type returns its own unless the base's fits.

| Parameter | Type |
| --- | --- |
| `context` | [RouterExtensionContext](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerextensioncontext)<State, Action, Options\> |

Returns:

[Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)<[RouterExtensionMembers](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerextensionmembers)<State, Action\>\>

### `RouterExtensionContext`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| baseRouter | [Router](https://reactnavigation.org/docs/custom-routers)<State, Action\> & { } | The router being extended. Delegate to it or return `RouterActionHandling.Delegate` for everything the extension does not handle. It is typed for the extended state and actions; actions it does not recognize return `RouterActionHandling.Unhandled`. Use `isActionHandled` to detect whether the router handled the action. |
| options | `Options` | The options the navigator passed to the router factory. |
| nextKey | `(name: string) => string` | Mints the next route key for the state being reduced or focused. `routeKeySeq` is tracked for you and stamped onto the returned state. |

### `RouterExtensionOptions`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| type(optional) | `NonNullable<State[type]>` | The router's `type`, also stamped onto the states it focuses or reduces. Defaults to the base router's type. |

### `RouterFactory(options)`

Supported platforms: Android, iOS, tvOS, Web.

Two instantiations with different `State` types are not assignable to each other, because `Router` requires `type` conditionally on `State`. Annotate a factory that should accept any router as a function type instead, as `extendRouter` does.

| Parameter | Type |
| --- | --- |
| `options` | `RouterOptions` |

Returns:

[Router](https://reactnavigation.org/docs/custom-routers)<State, Action\>

### `RouterPageBlurredMark`

Supported platforms: Android, iOS, tvOS, Web.

Type: [BaseRouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#baserouterperformancemark)<'expo-router:page-blurred', [RouterPageMarkDetail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpagemarkdetail)\>

A focused screen lost focus.

### `RouterPageFocusedMark`

Supported platforms: Android, iOS, tvOS, Web.

Type: [BaseRouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#baserouterperformancemark)<'expo-router:page-focused', [RouterPageMarkDetail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpagemarkdetail)\>

A screen became focused, after its content committed.

### `RouterPagePreloadedMark`

Supported platforms: Android, iOS, tvOS, Web.

Type: [BaseRouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#baserouterperformancemark)<'expo-router:page-preloaded', [RouterPageMarkDetail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpagemarkdetail)\>

A screen that rendered as part of a preload (for example, `router.prefetch()`) and is not focused. If the user later navigates to it, Expo Router records `expo-router:page-focused`.

### `RouterPageRemovedMark`

Supported platforms: Android, iOS, tvOS, Web.

Type: [BaseRouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#baserouterperformancemark)<'expo-router:page-removed', [RouterPageMarkDetail](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpagemarkdetail)\>

A screen unmounted, or its route info changed.

### `RouterPerformanceMark`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Any performance mark recorded by Expo Router. Check `name` to narrow the type of `detail`.

Acceptable values are: [RouterPagePreloadedMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpagepreloadedmark) | [RouterPageFocusedMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpagefocusedmark) | [RouterPageBlurredMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpageblurredmark) | [RouterPageRemovedMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerpageremovedmark) | [RouterActionEnqueuedMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractionenqueuedmark) | [RouterActionDispatchedMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routeractiondispatchedmark)

### `RouterPerformanceMarkByName`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Extract](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)<[RouterPerformanceMark](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#routerperformancemark), { name: [Name](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#name) }\>

The performance mark type with the given `name`, for example `RouterPerformanceMarkByName<'expo-router:page-focused'>`.

### `RouteSource`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `string`

Whether a screen was declared in the layout (`<Screen>`/`<NativeTabs.Trigger>`) or inferred from the filesystem.

Acceptable values are: `'layout'` | `'filesystem'`

### `ScreenProps`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| activityEnabled(optional) | `undefined` | Overrides React Activity behavior inherited from the navigator. For stack navigators, a number specifies how many screens must be above this route before its content is hidden. |
| dangerouslySingular(optional) | [SingularOptions](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#singularoptions) | - |
| getId(optional) | `({ params }: { params: Record<string, any> }) => string | undefined` | - |
| listeners(optional) | ScreenListeners<TState, TEventMap\> | (prop: { navigation: any, route: [RouteProp](https://reactnavigation.org/docs/glossary-of-terms/#route-object)<ParamListBase, string\> }) => ScreenListeners<TState, TEventMap\> | - |
| name(optional) | `string` | Name is required when used inside a Layout component. |
| options(optional) | `TOptions | (prop: { navigation: any, route: DescriptorRouteProp<ParamListBase, string> }) => TOptions` | - |

### `SearchOrHash`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: `?{string}` | `#{string}`

### `SingularOptions`

Supported platforms: Android, iOS, tvOS, Web.

Type: `boolean` or `object` shaped as below:

#### `` (name, params) => `string | undefined` ``

| Parameter | Type | Description |
| --- | --- | --- |
| name[(index signature)](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) | `string` | - |
| params[(index signature)](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) | `UnknownOutputParams` | - |

### `SitemapType`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| children | [SitemapType[]](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#sitemaptype) | - |
| contextKey | `string` | - |
| filename | `string` | - |
| href | string | [Href](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#hreft) | - |
| isGenerated | `boolean` | - |
| isInternal | `boolean` | - |

### `StackActionType`

Supported platforms: Android, iOS, tvOS, Web.

Type: `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ name: string, params: object, state: RouteState }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'REPLACE'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ name: string, params: object, state: RouteState }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'PUSH'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ count: number }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'POP'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'POP_TO_TOP'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ merge: boolean, name: string, params: object, state: RouteState }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'POP_TO'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ routeNames: string[] }` | - |
| type | `'REMOVE_ROUTES'` | - |

### `StackNavigationState`

Supported platforms: Android, iOS, tvOS, Web.

Type: [NavigationState](https://reactnavigation.org/docs/navigation-state)<ParamList\> extended by:

| Property | Type | Description |
| --- | --- | --- |
| type(optional) | `'stack'` | Type of the router, in this case, it's stack. |

### `StackRouterOptions`

Supported platforms: Android, iOS, tvOS, Web.

Type: `DefaultRouterOptions`

### `StandardNavigatorEmit(event)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `event` | `[]` |

Returns:

`void`

### `StandardNavigatorEventMapBase`

Supported platforms: Android, iOS, tvOS, Web.

Type: `Record<string, { canPreventDefault: boolean, data: object | undefined }>`

### `StandardUseNavigationBuilderOptions`

Supported platforms: Android, iOS, tvOS, Web.

Type: [DefaultNavigatorOptions](https://reactnavigation.org/docs/custom-navigators/#type-checking-navigators)<ParamListBase, string | undefined, State, NavigatorOptions, EventMap, any\>

### `TabActionType`

Supported platforms: Android, iOS, tvOS, Web.

Type: `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ name: string, params: object, state: RouteState }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'JUMP_TO'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ name: string, params: object, state: RouteState }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'REPLACE'` | - |

Or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| payload | `{ name: string, params: object, state: RouteState }` | - |
| source(optional) | `string` | - |
| target(optional) | `string` | - |
| type | `'PUSH'` | - |

### `TabNavigationState`

Supported platforms: Android, iOS, tvOS, Web.

Type: [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)<[NavigationState](https://reactnavigation.org/docs/navigation-state)<ParamList\>, 'history'\> extended by:

| Property | Type | Description |
| --- | --- | --- |
| history(optional) | `undefinedarray` | List of previously visited route keys. |
| type(optional) | `'tab'` | Type of the router, in this case, it's tab. |

### `TabRouterOptions`

Supported platforms: Android, iOS, tvOS, Web.

Type: `DefaultRouterOptions` extended by:

| Property | Type | Description |
| --- | --- | --- |
| backBehavior(optional) | [BackBehavior](https://docs.expo.dev/versions/latest/sdk/router/native-tabs.md#backbehavior) | Control how going back should behave
-   `firstRoute` - return to the first defined route
-   `initialRoute` - return to the route from `initialRouteName`
-   `order` - return to the route defined before the focused route
-   `history` - return to last visited route; if the same route is visited multiple times, the older entries are dropped from the history
-   `fullHistory` - return to last visited route; doesn't drop duplicate entries unlike `history` - matches behavior of web pages
-   `none` - do not handle going back

 |

### `Theme`

Supported platforms: Android, iOS, tvOS, Web.

Type: `NativeTheme`

## Config plugin types

### `AsyncRouteOption`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Controls whether async routes are enabled. `'development'` and `'production'` enable them for that environment only. Production async routes are web-only.

Acceptable values are: `'development'` | `'production'` | `boolean`

### `HttpMethod`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `string`

HTTP methods a redirect or rewrite rule can match.

Acceptable values are: `'GET'` | `'POST'` | `'PUT'` | `'DELETE'` | `'PATCH'` | `'OPTIONS'` | `'HEAD'`

### `PageHeadersConfig`

Supported platforms: Android, iOS, tvOS, Web.

Response headers applied to routes matching a path.

| Property | Type | Description |
| --- | --- | --- |
| headers | `Record<string, string | string[]>` | Response headers to apply for matching paths. |
| source | `string` | The path to match for the headers to apply. |

### `RedirectConfig`

Supported platforms: Android, iOS, tvOS, Web.

A static redirect from one route to another.

| Property | Type | Description |
| --- | --- | --- |
| destination | `string` | The target file path that this route should redirect to. |
| methods(optional) | [HttpMethod[]](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#httpmethod) | HTTP methods that should be redirected. Omit to redirect all methods. |
| permanent(optional) | `boolean` | Whether the redirect is permanent (301 or 308) instead of temporary (302 or 307). Default: `false` |
| source | `string` | The previous file path that this route should redirect from. |

### `RewriteConfig`

Supported platforms: Android, iOS, tvOS, Web.

A static rewrite from one route to another.

| Property | Type | Description |
| --- | --- | --- |
| destination | `string` | The target file path that this route should rewrite to. |
| methods(optional) | [HttpMethod[]](https://docs.expo.dev/versions/v58.0.0/sdk/router.md#httpmethod) | HTTP methods that should be rewritten. Omit to rewrite all methods. |
| source | `string` | The previous file path that should be rewritten. |

## Enums

### `RouterActionHandling`

Supported platforms: Android, iOS, tvOS, Web.

What a router's `getStateForAction` returns when it does not produce a result itself.

#### `Delegate`

`RouterActionHandling.Delegate = "DELEGATE"`

Lets the base router handle the action. Only an `extendRouter` extension or an `extendRouterActions` reducer can return it.

#### `Unhandled`

`RouterActionHandling.Unhandled = "UNHANDLED"`

Leaves the action unhandled, so the navigator ignores it.
