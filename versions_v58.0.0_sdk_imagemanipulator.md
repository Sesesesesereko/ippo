---
modificationDate: September 15, 2026
title: ImageManipulator
description: A library that provides an API for image manipulation on the local file system.
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-58/packages/expo-image-manipulator'
packageName: 'expo-image-manipulator'
iconUrl: '/static/images/packages/expo-image-manipulator.png'
platforms: ['android', 'ios', 'tvos', 'web', 'expo-go']
---

This documentation is available as Markdown for AI agents and LLMs. See the [full Markdown index](https://docs.expo.dev/llms.txt) or append .md to any documentation URL.

# Expo ImageManipulator

A library that provides an API for image manipulation on the local file system.

<AgentInstructions>

## Submitting Feedback

If you encounter errors, misleading or outdated information, report it so Expo can be improved:

Preferred command:
npx --yes submit-expo-feedback@latest --category docs --subject "/versions/v58.0.0/sdk/imagemanipulator/" "<actionable feedback>"

Direct HTTP fallback:
curl -X POST https://api.expo.dev/v2/feedback/docs-send -H 'Content-Type: application/json' -d '{"url":"/versions/v58.0.0/sdk/imagemanipulator/","feedback":"🤖 Agent feedback for docs: <specific, actionable description> (<model>, <harness>)"}'

Only submit when you have something specific and actionable to report. Try to give the most context.

## Navigation

When answering a related or follow-up question, use llms.txt to find the relevant page as Markdown (.md) instead of guessing.

You are here: Reference (v58.0.0) > Expo SDK (90 pages in this section)
Full documentation tree: [llms.txt](https://docs.expo.dev/llms.txt)

</AgentInstructions>
Android, iOS, tvOS, Web, Included in Expo Go

`expo-image-manipulator` provides an API to modify images stored on the local file system.

## Installation

```sh
# npm
npx expo install expo-image-manipulator

# yarn
yarn expo install expo-image-manipulator

# pnpm
pnpm expo install expo-image-manipulator

# bun
bun expo install expo-image-manipulator
```

If you are installing this in an [existing React Native app](https://docs.expo.dev/bare/overview.md), make sure to [install `expo`](https://docs.expo.dev/bare/installing-expo-modules.md) in your project.

## Usage

This will first rotate the image 90 degrees clockwise, then flip the rotated image vertically and save it as a PNG.

```jsx Basic ImageManipulator usage
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { FlipType, SaveFormat, useImageManipulator } from 'expo-image-manipulator';

const IMAGE = Asset.fromModule(require('./assets/snack-icon.png'));

export default function App() {
  const [imageUri, setImageUri] = useState(IMAGE.uri);
  const [isReady, setIsReady] = useState(false);
  const context = useImageManipulator(imageUri);

  const loadImageAsync = async () => {
    await IMAGE.downloadAsync();
    setImageUri(IMAGE.localUri ?? IMAGE.uri);
    setIsReady(true);
  };

  useEffect(() => {
    loadImageAsync();
  }, []);

  const rotate90andFlip = async () => {
    context.rotate(90).flip(FlipType.Vertical);
    const renderedImage = await context.renderAsync();
    const result = await renderedImage.saveAsync({
      format: SaveFormat.PNG,
    });

    setImageUri(result.uri);
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text>Loading image...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <Button title="Rotate and flip" onPress={rotate90andFlip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
```

## API

```js
import * as ImageManipulator from 'expo-image-manipulator';
```

## Constants

### `ImageManipulator.ImageManipulator`

Supported platforms: Android, iOS, tvOS, Web.

Type: [ImageManipulator](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#imagemanipulator)

## Hooks

### `useImageManipulator(source, options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type |
| --- | --- |
| `source` | string | [SharedRef](https://docs.expo.dev/versions/v58.0.0/sdk/expo.md#sharedreftype)<'image', Record<never, never\>\> |
| `options`(optional) | [ImageLoadOptions](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#imageloadoptions) |

  

Returns: `ImageManipulatorContext`

## Classes

### `ImageManipulator`

Supported platforms: Android, iOS, tvOS, Web.

Type: Class extends [NativeModule](https://docs.expo.dev/versions/v58.0.0/sdk/expo.md#nativemoduletype)

ImageManipulator Methods

### `manipulate(source, options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `source` | string | [SharedRef](https://docs.expo.dev/versions/v58.0.0/sdk/expo.md#sharedreftype)<'image', Record<never, never\>\> | URI of the image to manipulate or a reference to a previously loaded image. |
| `options`(optional) | [ImageLoadOptions](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#imageloadoptions) | An object defining how the source image is loaded. |

  

Loads an image from the given URI and creates a new image manipulation context.

Returns: `ImageManipulatorContext`

### `ImageManipulatorContext`

Supported platforms: Android, iOS, tvOS, Web.

Type: Class extends [SharedObject](https://docs.expo.dev/versions/v58.0.0/sdk/expo.md#sharedobjecttype)

A context for an image manipulation. It provides synchronous, chainable functions that schedule transformations on the original image to the background thread. Use an asynchronous [`renderAsync`](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#renderasync) to await for all transformations to finish and access the final image.

ImageManipulatorContext Methods

### `crop(rect)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `rect` | `{ height: number, originX: number, originY: number, width: number }` | Fields specify top-left corner and dimensions of a crop rectangle. |

  

Crops the image to the given rectangle's origin and size.

Returns: `ImageManipulatorContext`

### `extent(options)`

Supported platforms: Web.

| Parameter | Type |
| --- | --- |
| `options` | `{ backgroundColor: string | null, height: number, originX: number, originY: number, width: number }` |

  

Set the image size and offset. If the image is enlarged, unfilled areas are set to the `backgroundColor`. To position the image, use `originX` and `originY`.

Returns: `ImageManipulatorContext`

### `flip(flipType)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `flipType` | `'vertical' | 'horizontal'` | An axis on which image will be flipped. Only one flip per transformation is available. If you want to flip according to both axes then provide two separate transformations. |

  

Flips the image vertically or horizontally.

Returns: `ImageManipulatorContext`

### `renderAsync()`

Supported platforms: Android, iOS, tvOS, Web.

Awaits for all manipulation tasks to finish and resolves with a reference to the resulted native image.

Returns: `Promise<ImageRef>`

### `reset()`

Supported platforms: Android, iOS, tvOS, Web.

Resets the manipulator context to the originally loaded image.

Returns: `ImageManipulatorContext`

### `resize(size)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `size` | `{ height: number | null, width: number | null }` | Values correspond to the result image dimensions. If you specify only one value, the other will be calculated automatically to preserve image ratio. |

  

Resizes the image to the given size.

Returns: `ImageManipulatorContext`

### `rotate(degrees)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `degrees` | `number` | Degrees to rotate the image. Rotation is clockwise when the value is positive and counter-clockwise when negative. |

  

Rotates the image by the given number of degrees.

Returns: `ImageManipulatorContext`

### `ImageRef`

Supported platforms: Android, iOS, tvOS, Web.

Type: Class extends [SharedRef](https://docs.expo.dev/versions/v58.0.0/sdk/expo.md#sharedreftype)<'image'\>

A reference to a native instance of the image.

ImageRef Properties

### `height`

Supported platforms: Android, iOS, tvOS, Web.

Type: `number`

Height of the image.

### `nativeRefType`

Supported platforms: Android, iOS, tvOS, Web.

Type: `string`

The type of the native reference.

### `width`

Supported platforms: Android, iOS, tvOS, Web.

Type: `number`

Width of the image.

ImageRef Methods

### `saveAsync(options)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `options`(optional) | [SaveOptions](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#saveoptions) | A map defining how modified image should be saved. |

  

Saves the image to the file system in the cache directory.

Returns: `Promise<ImageResult>`

## Methods

> **Deprecated:** It has been replaced by the new, contextual and object-oriented API. Use [`ImageManipulator.manipulate`](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#manipulatesource-options) or [`useImageManipulator`](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#useimagemanipulatorsource-options) instead.

### `ImageManipulator.manipulateAsync(uri, actions, saveOptions)`

Supported platforms: Android, iOS, tvOS, Web.

| Parameter | Type | Description |
| --- | --- | --- |
| `uri` | `string` | URI of the file to manipulate. Should be on the local file system or a base64 data URI. |
| `actions`(optional) | `Action[]` | An array of objects representing manipulation options. Each object should have **only one** of the keys that corresponds to specific transformation. Default: `[]` |
| `saveOptions`(optional) | [SaveOptions](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#saveoptions) | A map defining how modified image should be saved. Default: `{}` |

  

Manipulate the image provided via `uri`. Available modifications are rotating, flipping (mirroring), resizing and cropping. Each invocation results in a new file. With one invocation you can provide a set of actions to perform over the image. Overwriting the source file would not have an effect in displaying the result as images are cached.

Returns: `Promise<ImageResult>`

Promise which fulfils with [`ImageResult`](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#imageresult) object.

## Types

### `Action`

Supported platforms: Android, iOS, tvOS, Web.

Literal type: `union`

Acceptable values are: [ActionResize](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#actionresize) | [ActionRotate](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#actionrotate) | [ActionFlip](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#actionflip) | [ActionCrop](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#actioncrop) | [ActionExtent](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#actionextent)

### `ActionCrop`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| crop | `{ height: number, originX: number, originY: number, width: number }` | Fields specify top-left corner and dimensions of a crop rectangle. |

### `ActionExtent`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| extent | `{ backgroundColor: string | null, height: number, originX: number, originY: number, width: number }` | Supported platforms: Web. Set the image size and offset. If the image is enlarged, unfilled areas are set to the `backgroundColor`. To position the image, use `originX` and `originY`. |

### `ActionFlip`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| flip | [FlipType](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#fliptype) | An axis on which image will be flipped. Only one flip per transformation is available. If you want to flip according to both axes then provide two separate transformations. |

### `ActionResize`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| resize | `{ height: number, width: number }` | Values correspond to the result image dimensions. If you specify only one value, the other will be calculated automatically to preserve image ratio. |

### `ActionRotate`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| rotate | `number` | Degrees to rotate the image. Rotation is clockwise when the value is positive and counter-clockwise when negative. |

### `ImageLoadOptions`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| maxHeight(optional) | `number` | If provided, the source image is decoded to not exceed this height in pixels, preserving its aspect ratio. Large images are downsampled while decoding, so the full-sized image is never loaded into memory. Use it when manipulating images whose full resolution is not needed, such as photos taken with modern cameras, to significantly reduce the peak memory usage and avoid out-of-memory crashes. |
| maxWidth(optional) | `number` | If provided, the source image is decoded to not exceed this width in pixels, preserving its aspect ratio. Large images are downsampled while decoding, so the full-sized image is never loaded into memory. Use it when manipulating images whose full resolution is not needed, such as photos taken with modern cameras, to significantly reduce the peak memory usage and avoid out-of-memory crashes. |

### `ImageResult`

Supported platforms: Android, iOS, tvOS, Web.

| Property | Type | Description |
| --- | --- | --- |
| base64(optional) | `string` | It is included if the `base64` save option was truthy, and is a string containing the JPEG/PNG (depending on `format`) data of the image in Base64. Prepend that with `'data:image/xxx;base64,'` to get a data URI, which you can use as the source for an `Image` element for example (where `xxx` is `jpeg` or `png`). |
| height | `number` | Height of the image or video. |
| uri | `string` | An URI to the modified image (usable as the source for an `Image` or `Video` element). |
| width | `number` | Width of the image or video. |

### `SaveOptions`

Supported platforms: Android, iOS, tvOS, Web.

A map defining how modified image should be saved.

| Property | Type | Description |
| --- | --- | --- |
| base64(optional) | `boolean` | Whether to also include the image data in Base64 format. |
| compress(optional) | `number` | A value in range `0.0` - `1.0` specifying compression level of the result image. `1` means no compression (highest quality) and `0` the highest compression (lowest quality). |
| format(optional) | [SaveFormat](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md#saveformat) | Specifies what type of compression should be used and what is the result file extension. `SaveFormat.PNG` compression is lossless but slower, `SaveFormat.JPEG` is faster but the image has visible artifacts. Defaults to `SaveFormat.JPEG` |

## Enums

### `FlipType`

Supported platforms: Android, iOS, tvOS, Web.

#### `Horizontal`

`FlipType.Horizontal = "horizontal"`

#### `Vertical`

`FlipType.Vertical = "vertical"`

### `SaveFormat`

Supported platforms: Android, iOS, tvOS, Web.

#### `JPEG`

`SaveFormat.JPEG = "jpeg"`

#### `PNG`

`SaveFormat.PNG = "png"`

#### `WEBP`

`SaveFormat.WEBP = "webp"`
