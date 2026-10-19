---
modificationDate: October 16, 2026
title: Introduction to Expo Router
description: Expo Router is an open-source routing library for Universal React Native applications built with Expo.
---

This documentation is available as Markdown for AI agents and LLMs. See the [full Markdown index](https://docs.expo.dev/llms.txt) or append .md to any documentation URL.

# Introduction to Expo Router

Expo Router is an open-source routing library for Universal React Native applications built with Expo.

<AgentInstructions>

## Submitting Feedback

If you encounter errors, misleading or outdated information, report it so Expo can be improved:

Preferred command:
npx --yes submit-expo-feedback@latest --category docs --subject "/router/introduction/" "<actionable feedback>"

Direct HTTP fallback:
curl -X POST https://api.expo.dev/v2/feedback/docs-send -H 'Content-Type: application/json' -d '{"url":"/router/introduction/","feedback":"🤖 Agent feedback for docs: <specific, actionable description> (<model>, <harness>)"}'

Only submit when you have something specific and actionable to report. Try to give the most context.

## Navigation

When answering a related or follow-up question, fetch the relevant page below as Markdown (.md) instead of guessing; use llms.txt for the full map.

You are here: Guides > Expo Router
Pages in this section:
- [Introduction](https://docs.expo.dev/router/introduction.md) (this page)
- [Manual installation](https://docs.expo.dev/router/installation.md)
Full documentation tree: [llms.txt](https://docs.expo.dev/llms.txt)

</AgentInstructions>

Expo Router is a file-based router for React Native and web applications. It allows you to manage navigation between screens in your app, allowing users to move seamlessly between different parts of your app's UI, using the same components on multiple platforms (Android, iOS, and web).

Expo Router brings the best file-system routing concepts from the web to a universal application — allowing your routing to work across every platform. When a file is added to the **app** directory, the file automatically becomes a route in your navigation.

## Quick start

We recommend creating a new Expo app using `create-expo-app` to create a project with Expo Router library already installed and configured:

```sh
# npm
npx create-expo-app@latest --template default@sdk-58

# yarn
yarn create expo-app --template default@sdk-58

# pnpm
pnpm create expo-app --template default@sdk-58

# bun
bun create expo --template default@sdk-58
```

> During the SDK 58 transition period, `create-expo-app@latest` without the `--template` flag creates an SDK 57 project. If you plan to use Expo Go on a physical device, use an SDK 57 project. Otherwise, use `--template default@sdk-58` to create an SDK 58 project.

Now, you can start your project by running:

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

-   To view your app on a mobile device, we recommend starting with [Expo Go](https://docs.expo.dev/get-started/set-up-your-environment.md#how-would-you-like-to-develop). As your application grows in complexity and you need more control, you can create a [development build](https://docs.expo.dev/develop/development-builds/introduction.md).
-   Open the project in a web browser by pressing W in the Terminal UI. Press A for Android (Android Studio is required), or I for iOS (macOS with Xcode is required).

## Resources

[Expo Tutorial](https://docs.expo.dev/tutorial/introduction.md) — A step-by-step guide to build an Expo app that runs on Android, iOS, and web.

[Expo Router API reference](https://docs.expo.dev/versions/latest/sdk/router.md) — API components, hooks, methods, and configuration options.

[Expo Router video playlist](https://www.youtube.com/playlist?list=PLsXDmrmFV_AT17JDf-otXSNE_eH7s0uDD) — A tutorial series from core concepts to more complex navigation flows.

### Expo Skills for AI agents

If you use an AI agent, install [Expo Skills](https://docs.expo.dev/skills.md) to teach it file-based navigation patterns:

[expo-router](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-router/SKILL.md) — Navigation and routing for Expo Router.

## Key features

-   **Native**: Built on top of [React Native Screens](https://github.com/software-mansion/react-native-screens), Expo Router navigation is truly native and platform-optimized by default.
-   **Shareable**: Every screen in your app is automatically [deep linkable](https://docs.expo.dev/linking/overview.md), making any route in your app shareable with links.
-   **Offline-first**: Apps are cached and run offline-first, with automatic updates when you publish a new version. Handles all incoming native URLs without a network connection or server.
-   **Optimized**: Routes are automatically optimized with [lazy-evaluation in production](https://docs.expo.dev/router/web/async-routes.md), and deferred bundling in development.
-   **Iteration**: Universal Fast Refresh across Android, iOS, and web, along with artifact memoization in the bundler to keep you moving fast at scale.
-   **Universal**: Android, iOS, and web share a unified navigation structure, with the ability to drop-down to platform-specific APIs at the route level.
-   **Discoverable**: Expo Router enables build-time [static rendering](https://docs.expo.dev/router/web/static-rendering.md) on web, and [universal linking](https://docs.expo.dev/linking/overview.md) to native. Meaning your app content can be indexed by search engines.

## Using a different navigation library

You can use any other navigation library, like [React Navigation](https://reactnavigation.org/docs/getting-started#installation), in your Expo project. However, if you are building a new app, **we recommend using Expo Router for all the features described above**. With other navigation libraries, you might have to implement your own strategies for some of these features, such as shareable links or handling web and native navigation in the same project.

If you are looking to use [React Native Navigation by Wix](https://github.com/wix/react-native-navigation), it is not available in Expo Go and is not yet compatible with `expo-dev-client`. We recommend using [`createNativeStackNavigator`](https://reactnavigation.org/docs/native-stack-navigator) from React Navigation to use Android and iOS native navigation APIs.

## Common questions

#### Expo Router versus Expo versus React Native CLI

Historically, React Native has been non prescriptive about how apps should be built which is similar to using React without a modern web framework. Expo Router is an opinionated framework for React Native, similar to how Remix and Next.js are opinionated frameworks for web-only React.

Expo Router is designed to bring the best architectural patterns to everyone, to ensure React Native is leveraged to its fullest. For example, Expo Router's [Async Routes](https://docs.expo.dev/router/web/async-routes.md) feature enables lazy bundling for everyone. Previously, lazy bundling was only used at Meta to build the Facebook app.

#### Can I use Expo Router in my existing React Native app?

Yes, Expo Router is the framework for universal React Native apps. Due to the deep connection between the router and the bundler, Expo Router is only available in Expo CLI projects with Metro. Luckily, you can [use Expo CLI in any React Native project](https://docs.expo.dev/bare/using-expo-cli.md) too!

#### What are the benefits of file-based routing?

-   The file system is a well-known and well-understood concept. The simpler mental model makes it easier to educate new team members and scale your application.
-   The fastest way to onboard new users is by having them open a universal link that opens the app or website to the correct screen depending on if they have the app installed or not. This technique is so advanced that it's usually only available to large companies that can afford to make and maintain the parity between platforms. But with Expo's file-based routing, you can have this feature out of the box!
-   Refactoring is easier to do because you can move files around without having to update any imports or routing components.
-   Expo Router has the ability to statically type routes automatically. This ensures you can only link to valid routes and that you can't link to a route that doesn't exist. Typed Routes also improve refactoring as you'll get type errors if links are broken.
-   Async Routes (bundle splitting) improve development speed, especially in larger projects. They also make upgrades easier as errors are isolated to a single route, meaning you can incrementally update or refactor your app page-by-page rather than all at once (traditional React Native).
-   Deep links always work, for every page. This makes it possible to share links to any content in the app, which is great for promoting your app, collecting bug reports, E2E testing, automating screenshots, and so on.
-   Expo Head uses automatic links to enable deep-native integration. Features like Quick Notes, Handoff, Siri context, and universal links only require configuration setup, no code changes. This enables perfect vertical integration with the entire ecosystem of smart devices that a user has, leading to the types of user experiences that are only possible with universal apps (web ⇄ native).
-   Expo Router has the ability to statically render each page automatically on the web, enabling real SEO and full discoverability of your app's content. This is only possible because of the file-based convention.
-   **Expo CLI** can infer a lot of information about your application when it follows a known convention. For example, we could implement automatic bundle splitting per route, or automatically generate a sitemap for your website. This is impossible when your app only has a single entry point.
-   Re-engagement features like notifications and home screen widgets are easier to integrate as you can simply intercept the launch and deep link, with query parameters, anywhere in the app.
-   Like on the web, analytics and error reporting can easily be configured to automatically include the route name, which is useful for debugging and understanding user behavior.

#### Why should I use Expo Router over React Navigation?

Expo Router takes a file-based approach, where routes are derived from your file structure from the **app** directory. It also has built-in support for typed routes, automatic deep linking, and static rendering for the web. React Navigation lets you define navigators and routes manually in code. Choose whichever model fits your project.

#### How do I server-render my Expo Router website?

Basic static rendering (SSG) is supported in Expo Router. Server-side rendering currently requires custom infrastructure to set up.

## Next steps

[Manual installation](https://docs.expo.dev/router/installation.md) — Detailed instructions on how to get started and add Expo Router to your existing app.

[Router 101](https://docs.expo.dev/router/basics/core-concepts.md) — For information core concepts, notation patterns, navigation layouts, and common navigation patterns, start with Router 101 section.

[Example app](https://github.com/expo/expo/tree/main/templates/expo-template-tabs) — See the source code for the example app on GitHub.
