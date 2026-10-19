---
modificationDate: May 18, 2026
title: Using URL parameters
description: Learn how to access and modify route and search parameters in your app.
---

This documentation is available as Markdown for AI agents and LLMs. See the [full Markdown index](https://docs.expo.dev/llms.txt) or append .md to any documentation URL.

# Using URL parameters

Learn how to access and modify route and search parameters in your app.

<AgentInstructions>

## Submitting Feedback

If you encounter errors, misleading or outdated information, report it so Expo can be improved:

Preferred command:
npx --yes submit-expo-feedback@latest --category docs --subject "/router/reference/url-parameters/" "<actionable feedback>"

Direct HTTP fallback:
curl -X POST https://api.expo.dev/v2/feedback/docs-send -H 'Content-Type: application/json' -d '{"url":"/router/reference/url-parameters/","feedback":"🤖 Agent feedback for docs: <specific, actionable description> (<model>, <harness>)"}'

Only submit when you have something specific and actionable to report. Try to give the most context.

## Navigation

When answering a related or follow-up question, fetch the relevant page below as Markdown (.md) instead of guessing; use llms.txt for the full map.

You are here: Guides > Expo Router > Reference
Pages in this section:
- [Error handling and loading states](https://docs.expo.dev/router/error-handling.md)
- [URL parameters](https://docs.expo.dev/router/reference/url-parameters.md) (this page)
- [Color](https://docs.expo.dev/router/reference/color.md)
- [Sitemap](https://docs.expo.dev/router/reference/sitemap.md)
- [Redirects](https://docs.expo.dev/router/reference/redirects.md)
- [Link preview](https://docs.expo.dev/router/reference/link-preview.md)
- [Typed routes](https://docs.expo.dev/router/reference/typed-routes.md)
- [Screen tracking for analytics](https://docs.expo.dev/router/reference/screen-tracking.md)
- [Handle screen focus](https://docs.expo.dev/router/reference/focus-handling.md)
- [Top-level src directory](https://docs.expo.dev/router/reference/src-directory.md)
- [Testing](https://docs.expo.dev/router/reference/testing.md)
- [Troubleshooting](https://docs.expo.dev/router/reference/troubleshooting.md)
- [Reserved paths](https://docs.expo.dev/router/reference/reserved-paths.md)
Full documentation tree: [llms.txt](https://docs.expo.dev/llms.txt)

</AgentInstructions>

URL parameters include both **route parameters** and **search parameters**. Expo Router provides hooks for accessing and modifying these parameters.

## Difference between route and search parameters

Route parameters are dynamic segments defined in a URL path, such as `/profile/[user]`, where `user` is a route parameter. They are used to match a route.

Search parameters (also known as query params) are serializable fields that can be appended to a URL, such as `/profile?extra=info`, where `extra` is a search parameter. They are commonly used to pass data between pages.

## Local versus global URL parameters

In apps with nested navigators, you'll often have **multiple pages mounted** at the same time. For example, a stack has the previous page and current page in memory when a new route is pushed. Because of this, Expo Router provides two different hooks for accessing URL parameters:

-   **useLocalSearchParams**: Returns the URL parameters for the current component. It only updates when the global URL conforms to the route.
-   **useGlobalSearchParams**: Returns the global URL regardless of the component. It updates on every URL param change and might cause components to update extraneously in the background.

The hooks `useGlobalSearchParams` and `useLocalSearchParams` allow you to access these parameters within your components, enabling you to retrieve and utilize both types of URL parameters.

Both hooks are typed and accessed the same way. However, the only difference is how frequently they update.

The example below demonstrates the difference between `useLocalSearchParams` and `useGlobalSearchParams`. It uses the following **app** directory structure:

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

  `[user].tsx`

The Root Layout is a stack navigator:

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

The initial route redirects to the dynamic route **src/app/[user].tsx**, with **user=evanbacon**:

```tsx src/app/index.tsx
import { Redirect } from 'expo-router';

export default function Route() {
  return <Redirect href="/evanbacon" />;
}
```

The dynamic route **src/app/[user]** prints out the global and local URL parameters (route parameters, in this case). It also allows for pushing new instances of the same route with different **route parameters**:

```tsx src/app/[user].tsx
import { Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

const friends = ['charlie', 'james']

export default function Route() {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  console.log("Local:", local.user, "Global:", glob.user);

  return (
    <View>
      <Text>User: {local.user}</Text>
      {friends.map(friend => (
        <Link key={friend} href={`/${friend}`}>
          Visit {friend}
        </Link>
      ))}
    </View>
  );
}
```

When the app starts, the following log is printed:

```sh
Local: evanbacon Global: evanbacon
```

Pressing "Visit charlie" pushes a new instance of `/[user]` with **user=charlie**, and logs the following:

```sh
# This log came from the new screen
Local: charlie Global: charlie
# This log came from the first screen
Local: evanbacon Global: charlie
```

Pressing "Visit james" has a similar effect:

```sh
# This log came from the new, "/james" screen
Local: james Global: james
# This log came from the "/evanbacon" screen
Local: evanbacon Global: james
# This log came from the "/charlie" screen
Local: charlie Global: james
```

**Results:**

-   `useGlobalSearchParams` made the background screens re-render when the URL **route parameters** changed. It can cause performance issues if overused.
-   Global re-renders are executed in order of the stack, so the first screen is re-rendered first, then the **user=charlie** screen is re-rendered after.
-   `useLocalSearchParams` remained the same, even when the global URL **route parameters** changed. You can leverage this behavior for data fetching to ensure the previous screen's data is still available when you navigate back.

## Statically-typed URL parameters

Both the `useLocalSearchParams` and `useGlobalSearchParams` can be statically typed using a generic. The following is an example for the `user` route parameter:

```tsx src/app/[user].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { user } = useLocalSearchParams<{ user: string }>();

  return <Text>User: {user}</Text>;
}

// Given the URL: `/evanbacon`
// The following is returned: { user: "evanbacon" }
```

Any search parameters (for example, `?query=...`) can be typed optionally:

```tsx src/app/[user].tsx
const { user, query } = useLocalSearchParams<{ user: string; query?: string }>();

// Given the URL: `/evanbacon?query=hello`
// The following is returned: { user: "evanbacon", query: "hello" }
```

When used with the rest syntax (`...`), route parameters are returned as a string array:

```tsx src/app/[...everything].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { everything } = useLocalSearchParams<{
    everything: string[];
  }>();
  const user = everything[0];

  return <Text>User: {user}</Text>;
}

// Given the URL: `/evanbacon/123`
// The following is returned: { everything: ["evanbacon", "123"] }
```

Any search parameters will continue to be returned as individual strings:

```tsx src/app/[...everything].tsx
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { everything } = useLocalSearchParams<{
    everything: string[];
    query?: string;
    query2?: string;
  }>();
  const user = everything[0];

  return <Text>User: {user}</Text>;
}

// Given the URL: `/evanbacon/123?query=hello&query2=world`
// The following is returned: { everything: ["evanbacon", "123"], query: "hello", query2: "world" }
```

## Updating URL parameters

URL parameters can be updated using the **router.setParams** function from the imperative API. Updating a URL parameter will not push anything new to the history stack.

The following example uses a `<TextInput>` to update the search parameter **q**:

```tsx src/app/search.tsx
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

export default function Page() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  return (
    <TextInput
      value={search}
      onChangeText={search => {
        setSearch(search);
        router.setParams({ query: search });
      }}
      placeholderTextColor="#A0A0A0"
      placeholder="Search"
      style={{
        borderRadius: 12,
        backgroundColor: '#fff',
        fontSize: 24,
        color: '#000',
        margin: 12,
        padding: 16,
      }}
    />
  );
}
```

Here is an example using an `onPress` event to update the route parameter **user**:

```tsx src/app/[user].tsx
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from 'react-native';

export default function User() {
  const params = useLocalSearchParams<{ user: string }>();

  return (
    <>
      <Text>User: {params.user}</Text>
      <Text onPress={() => router.setParams({ user: 'evan' })}>Go to Evan</Text>
    </>
  );
}
```

## Route parameters versus search parameters

Route parameters are used to match a route, while search parameters are used to pass data between routes. Consider the following structure, where a route parameter is used to match the _user_ route:

`src`

 `app`

  `index.tsx`

  `[user].tsx``` `user` is a **route parameter** ``

When the `src/app/[user]` route is matched, the `user` parameter is passed to the component and never a nullish value. Both search and route parameters can be used together and are accessible with the `useLocalSearchParams` and `useGlobalSearchParams` hooks:

```tsx src/app/[user].tsx
import { useLocalSearchParams } from 'expo-router';

export default function User() {
  const {
    // The route parameter
    user,
    // An optional search parameter.
    tab,
  } = useLocalSearchParams<{ user: string; tab?: string }>();

  console.log({ user, tab });

  // Given the URL: `/bacon?tab=projects`, the following is printed:
  // { user: 'bacon', tab: 'projects' }

  // Given the URL: `/expo`, the following is printed:
  // { user: 'expo', tab: undefined }
}
```

Whenever a route parameter is changed, the component will re-mount.

```tsx src/app/[user].tsx
import { Text } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';

export default function User() {
  // All three of these will change the route parameter `user`, and add a new user page.
  return (
    <>
      <Text onPress={() => router.setParams({ user: 'evan' })}>Go to Evan</Text>
      <Text onPress={() => router.push('/mark')}>Go to Mark</Text>
      <Link href="/charlie">Go to Charlie</Link>
    </>
  );
}
```

## Hash support

The URL [hash](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash) is a string that follows the `#` symbol in a URL. It is commonly used on websites to link to a specific section of a page, but it can also be used to store data. Expo Router treats the hash as a special search parameter using the name `#`. It can be accessed and modified using the same hooks and APIs from [search parameters](https://docs.expo.dev/router/reference/url-parameters.md#local-versus-global-url-parameters).

```tsx src/app/hash.tsx
import { Text } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';

export default function User() {
  // Access the hash
  const { '#': hash } = useLocalSearchParams<{ '#': string }>();

  return (
    <>
      <Text onPress={() => router.setParams({ '#': 'my-hash' })}>Set a new hash</Text>
      <Text onPress={() => router.push('/#my-hash')}>Push with a new hash</Text>
      <Link href="/#my-hash">Link with a hash</Link>
    </>
  );
}
```

## Reserved parameters

Certain URL parameters are reserved for internal use by Expo Router and React Navigation. Avoid using the following names for your own parameters to prevent conflicts:

-   `screen`
-   `params`
-   `initial`
-   `state`
