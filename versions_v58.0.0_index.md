---
modificationDate: September 17, 2026
title: Expo SDK reference
description: Access device and system functionality in your Expo and React Native apps using Expo SDK packages.
---

This documentation is available as Markdown for AI agents and LLMs. See the [full Markdown index](https://docs.expo.dev/llms.txt) or append .md to any documentation URL.

# Expo SDK reference

Access device and system functionality in your Expo and React Native apps using Expo SDK packages.

<AgentInstructions>

## Submitting Feedback

If you encounter errors, misleading or outdated information, report it so Expo can be improved:

Preferred command:
npx --yes submit-expo-feedback@latest --category docs --subject "/versions/v58.0.0/" "<actionable feedback>"

Direct HTTP fallback:
curl -X POST https://api.expo.dev/v2/feedback/docs-send -H 'Content-Type: application/json' -d '{"url":"/versions/v58.0.0/","feedback":"🤖 Agent feedback for docs: <specific, actionable description> (<model>, <harness>)"}'

Only submit when you have something specific and actionable to report. Try to give the most context.

## Navigation

When answering a related or follow-up question, fetch the relevant page below as Markdown (.md) instead of guessing; use llms.txt for the full map.

You are here: Reference (v58.0.0)
### Configuration files
- [app.json / app.config.js](https://docs.expo.dev/versions/v58.0.0/config/app.md)
- [babel.config.js](https://docs.expo.dev/versions/v58.0.0/config/babel.md)
- [metro.config.js](https://docs.expo.dev/versions/v58.0.0/config/metro.md)
- [package.json](https://docs.expo.dev/versions/v58.0.0/config/package-json.md)
### Expo Router
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/router.md)
- [Color](https://docs.expo.dev/versions/v58.0.0/sdk/router/color.md)
- [Experimental Stack](https://docs.expo.dev/versions/v58.0.0/sdk/router/experimental-stack.md)
- [Link](https://docs.expo.dev/versions/v58.0.0/sdk/router/link.md)
- [Native tabs](https://docs.expo.dev/versions/v58.0.0/sdk/router/native-tabs.md)
- [Split View](https://docs.expo.dev/versions/v58.0.0/sdk/router/split-view.md)
- [Stack](https://docs.expo.dev/versions/v58.0.0/sdk/router/stack.md)
- [UI](https://docs.expo.dev/versions/v58.0.0/sdk/router/ui.md)
### Expo UI
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/ui.md)
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose.md)
- [AlertDialog](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/alertdialog.md)
- [Badge](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/badge.md)
- [BadgedBox](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/badgedbox.md)
- [BasicAlertDialog](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/basicalertdialog.md)
- [Box](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/box.md)
- [Button](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/button.md)
- [Card](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/card.md)
- [Carousel](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/carousel.md)
- [Checkbox](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/checkbox.md)
- [Chip](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/chip.md)
- [Column](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/column.md)
- [DateTimePicker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/datetimepicker.md)
- [Divider](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/divider.md)
- [DockedSearchBar](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/dockedsearchbar.md)
- [DropdownMenu](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/dropdownmenu.md)
- [ExposedDropdownMenuBox](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/exposeddropdownmenubox.md)
- [FloatingActionButton](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/floatingactionbutton.md)
- [FlowRow](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/flowrow.md)
- [HorizontalFloatingToolbar](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/horizontalfloatingtoolbar.md)
- [HorizontalPager](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/horizontalpager.md)
- [Host](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/host.md)
- [Icon](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/icon.md)
- [IconButton](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/iconbutton.md)
- [Image](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/image.md)
- [LazyColumn](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/lazycolumn.md)
- [LazyRow](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/lazyrow.md)
- [ListItem](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/listitem.md)
- [LoadingIndicator](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/loadingindicator.md)
- [Material Colors](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/colors.md)
- [ModalBottomSheet](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/bottomsheet.md)
- [Modifiers](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/modifiers.md)
- [NavigationBar](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/navigationbar.md)
- [Progress indicators](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/progress.md)
- [PullToRefreshBox](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/pulltorefreshbox.md)
- [RadioButton](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/radiobutton.md)
- [RNHostView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/rnhostview.md)
- [Row](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/row.md)
- [SearchBar](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/searchbar.md)
- [SegmentedButton](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/segmentedbutton.md)
- [Shape](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/shape.md)
- [Slider](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/slider.md)
- [Snackbar](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/snackbar.md)
- [Spacer](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/spacer.md)
- [Surface](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/surface.md)
- [Switch](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/switch.md)
- [Text](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/text.md)
- [TextField](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/textfield.md)
- [ToggleButton](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/togglebutton.md)
- [Tooltip](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/tooltip.md)
- [useNativeState](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/usenativestate.md)
- [Custom Jetpack Compose components](https://docs.expo.dev/versions/v58.0.0/sdk/ui/jetpack-compose/extending.md)
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui.md)
- [AccessoryWidgetBackground](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/accessorywidgetbackground.md)
- [Alert](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/alert.md)
- [ArrangementView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/arrangementview.md)
- [Background](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/background.md)
- [BottomSheet](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/bottomsheet.md)
- [Button](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/button.md)
- [ColorPicker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/colorpicker.md)
- [ConfirmationDialog](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/confirmationdialog.md)
- [ContextMenu](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/contextmenu.md)
- [ControlGroup](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/controlgroup.md)
- [DatePicker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/datepicker.md)
- [DisclosureGroup](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/disclosuregroup.md)
- [Divider](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/divider.md)
- [Form](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/form.md)
- [Gauge](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/gauge.md)
- [Group](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/group.md)
- [Host](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/host.md)
- [HStack](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/hstack.md)
- [Image](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/image.md)
- [Label](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/label.md)
- [LazyHStack](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/lazyhstack.md)
- [LazyVStack](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/lazyvstack.md)
- [Link](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/link.md)
- [List](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/list.md)
- [Menu](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/menu.md)
- [Modifiers](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/modifiers.md)
- [Namespace](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/namespace.md)
- [NavigationSplitView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/navigationsplitview.md)
- [NavigationStack](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/navigationstack.md)
- [Overlay](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/overlay.md)
- [Picker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/picker.md)
- [Popover](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/popover.md)
- [ProgressView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/progressview.md)
- [RNHostView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/rnhostview.md)
- [ScrollView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/scrollview.md)
- [Section](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/section.md)
- [SecureField](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/securefield.md)
- [Slider](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/slider.md)
- [Spacer](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/spacer.md)
- [SwipeActions](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/swipeactions.md)
- [TabView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/tabview.md)
- [Text](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/text.md)
- [TextField](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/textfield.md)
- [Toggle](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/toggle.md)
- [Toolbar](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/toolbar.md)
- [useNativeState](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/usenativestate.md)
- [VStack](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/vstack.md)
- [ZStack](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/zstack.md)
- [Custom SwiftUI components](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/extending.md)
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements.md)
- [BottomSheet](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/bottomsheet.md)
- [DateTimePicker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/datetimepicker.md)
- [MaskedView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/maskedview.md)
- [Menu](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/menu.md)
- [PagerView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/pagerview.md)
- [Picker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/picker.md)
- [SegmentedControl](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/segmentedcontrol.md)
- [Slider](https://docs.expo.dev/versions/v58.0.0/sdk/ui/drop-in-replacements/slider.md)
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal.md)
- [BottomSheet](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/bottomsheet.md)
- [Button](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/button.md)
- [Checkbox](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/checkbox.md)
- [Collapsible](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/collapsible.md)
- [Column](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/column.md)
- [FieldGroup](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/fieldgroup.md)
- [Host](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/host.md)
- [Icon](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/icon.md)
- [List](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/list.md)
- [Picker](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/picker.md)
- [RNHostView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/rnhostview.md)
- [Row](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/row.md)
- [ScrollView](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/scrollview.md)
- [Slider](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/slider.md)
- [Spacer](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/spacer.md)
- [Switch](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/switch.md)
- [Text](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/text.md)
- [TextInput](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/textinput.md)
### Expo SDK
- [Expo](https://docs.expo.dev/versions/v58.0.0/sdk/expo.md)
- [Accelerometer](https://docs.expo.dev/versions/v58.0.0/sdk/accelerometer.md)
- [AgeRange](https://docs.expo.dev/versions/v58.0.0/sdk/age-range.md)
- [AppIntegrity](https://docs.expo.dev/versions/v58.0.0/sdk/app-integrity.md)
- [AppIntents](https://docs.expo.dev/versions/v58.0.0/sdk/app-intents.md)
- [AppleAuthentication](https://docs.expo.dev/versions/v58.0.0/sdk/apple-authentication.md)
- [Application](https://docs.expo.dev/versions/v58.0.0/sdk/application.md)
- [Asset](https://docs.expo.dev/versions/v58.0.0/sdk/asset.md)
- [Audio (expo-audio)](https://docs.expo.dev/versions/v58.0.0/sdk/audio.md)
- [AuthSession](https://docs.expo.dev/versions/v58.0.0/sdk/auth-session.md)
- [BackgroundFetch](https://docs.expo.dev/versions/v58.0.0/sdk/background-fetch.md)
- [BackgroundTask](https://docs.expo.dev/versions/v58.0.0/sdk/background-task.md)
- [Barometer](https://docs.expo.dev/versions/v58.0.0/sdk/barometer.md)
- [Battery](https://docs.expo.dev/versions/v58.0.0/sdk/battery.md)
- [Blob](https://docs.expo.dev/versions/v58.0.0/sdk/blob.md)
- [BlurView](https://docs.expo.dev/versions/v58.0.0/sdk/blur-view.md)
- [Brightness](https://docs.expo.dev/versions/v58.0.0/sdk/brightness.md)
- [Brownfield](https://docs.expo.dev/versions/v58.0.0/sdk/brownfield.md)
- [BuildProperties](https://docs.expo.dev/versions/v58.0.0/sdk/build-properties.md)
- [Calendar](https://docs.expo.dev/versions/v58.0.0/sdk/calendar.md)
- [Calendar (legacy)](https://docs.expo.dev/versions/v58.0.0/sdk/calendar-legacy.md)
- [Camera](https://docs.expo.dev/versions/v58.0.0/sdk/camera.md)
- [Cellular](https://docs.expo.dev/versions/v58.0.0/sdk/cellular.md)
- [Checkbox](https://docs.expo.dev/versions/v58.0.0/sdk/checkbox.md)
- [Clipboard](https://docs.expo.dev/versions/v58.0.0/sdk/clipboard.md)
- [Constants](https://docs.expo.dev/versions/v58.0.0/sdk/constants.md)
- [Contacts](https://docs.expo.dev/versions/v58.0.0/sdk/contacts.md)
- [Contacts (legacy)](https://docs.expo.dev/versions/v58.0.0/sdk/contacts-legacy.md)
- [Crypto](https://docs.expo.dev/versions/v58.0.0/sdk/crypto.md)
- [DevClient](https://docs.expo.dev/versions/v58.0.0/sdk/dev-client.md)
- [Device](https://docs.expo.dev/versions/v58.0.0/sdk/device.md)
- [DeviceMotion](https://docs.expo.dev/versions/v58.0.0/sdk/devicemotion.md)
- [DevMenu](https://docs.expo.dev/versions/v58.0.0/sdk/dev-menu.md)
- [DocumentPicker](https://docs.expo.dev/versions/v58.0.0/sdk/document-picker.md)
- [FileSystem](https://docs.expo.dev/versions/v58.0.0/sdk/filesystem.md)
- [FileSystem (legacy)](https://docs.expo.dev/versions/v58.0.0/sdk/filesystem-legacy.md)
- [Fingerprint](https://docs.expo.dev/versions/v58.0.0/sdk/fingerprint.md)
- [Font](https://docs.expo.dev/versions/v58.0.0/sdk/font.md)
- [GlassEffect](https://docs.expo.dev/versions/v58.0.0/sdk/glass-effect.md)
- [GLView](https://docs.expo.dev/versions/v58.0.0/sdk/gl-view.md)
- [Gyroscope](https://docs.expo.dev/versions/v58.0.0/sdk/gyroscope.md)
- [Haptics](https://docs.expo.dev/versions/v58.0.0/sdk/haptics.md)
- [Hinge](https://docs.expo.dev/versions/v58.0.0/sdk/hinge.md)
- [Image](https://docs.expo.dev/versions/v58.0.0/sdk/image.md)
- [ImageManipulator](https://docs.expo.dev/versions/v58.0.0/sdk/imagemanipulator.md)
- [ImagePicker](https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker.md)
- [IntentLauncher](https://docs.expo.dev/versions/v58.0.0/sdk/intent-launcher.md)
- [KeepAwake](https://docs.expo.dev/versions/v58.0.0/sdk/keep-awake.md)
- [LightSensor](https://docs.expo.dev/versions/v58.0.0/sdk/light-sensor.md)
- [LinearGradient](https://docs.expo.dev/versions/v58.0.0/sdk/linear-gradient.md)
- [Linking](https://docs.expo.dev/versions/v58.0.0/sdk/linking.md)
- [LivePhoto](https://docs.expo.dev/versions/v58.0.0/sdk/live-photo.md)
- [LocalAuthentication](https://docs.expo.dev/versions/v58.0.0/sdk/local-authentication.md)
- [Localization](https://docs.expo.dev/versions/v58.0.0/sdk/localization.md)
- [Location](https://docs.expo.dev/versions/v58.0.0/sdk/location.md)
- [Location (next)](https://docs.expo.dev/versions/v58.0.0/sdk/location-next.md)
- [Magnetometer](https://docs.expo.dev/versions/v58.0.0/sdk/magnetometer.md)
- [MailComposer](https://docs.expo.dev/versions/v58.0.0/sdk/mail-composer.md)
- [Manifests](https://docs.expo.dev/versions/v58.0.0/sdk/manifests.md)
- [Maps](https://docs.expo.dev/versions/v58.0.0/sdk/maps.md)
- [MediaLibrary](https://docs.expo.dev/versions/v58.0.0/sdk/media-library.md)
- [MediaLibrary (legacy)](https://docs.expo.dev/versions/v58.0.0/sdk/media-library-legacy.md)
- [MeshGradient](https://docs.expo.dev/versions/v58.0.0/sdk/mesh-gradient.md)
- [NavigationBar](https://docs.expo.dev/versions/v58.0.0/sdk/navigation-bar.md)
- [Network](https://docs.expo.dev/versions/v58.0.0/sdk/network.md)
- [Notifications](https://docs.expo.dev/versions/v58.0.0/sdk/notifications.md)
- [Observe](https://docs.expo.dev/versions/v58.0.0/sdk/observe.md)
- [Pedometer](https://docs.expo.dev/versions/v58.0.0/sdk/pedometer.md)
- [Print](https://docs.expo.dev/versions/v58.0.0/sdk/print.md)
- [ScreenCapture](https://docs.expo.dev/versions/v58.0.0/sdk/screen-capture.md)
- [ScreenOrientation](https://docs.expo.dev/versions/v58.0.0/sdk/screen-orientation.md)
- [SecureStore](https://docs.expo.dev/versions/v58.0.0/sdk/securestore.md)
- [Sensors](https://docs.expo.dev/versions/v58.0.0/sdk/sensors.md)
- [Server](https://docs.expo.dev/versions/v58.0.0/sdk/server.md)
- [Sharing](https://docs.expo.dev/versions/v58.0.0/sdk/sharing.md)
- [SMS](https://docs.expo.dev/versions/v58.0.0/sdk/sms.md)
- [Speech](https://docs.expo.dev/versions/v58.0.0/sdk/speech.md)
- [SplashScreen](https://docs.expo.dev/versions/v58.0.0/sdk/splash-screen.md)
- [SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite.md)
- [StatusBar](https://docs.expo.dev/versions/v58.0.0/sdk/status-bar.md)
- [StoreReview](https://docs.expo.dev/versions/v58.0.0/sdk/storereview.md)
- [Symbols](https://docs.expo.dev/versions/v58.0.0/sdk/symbols.md)
- [SystemUI](https://docs.expo.dev/versions/v58.0.0/sdk/system-ui.md)
- [TaskManager](https://docs.expo.dev/versions/v58.0.0/sdk/task-manager.md)
- [TrackingTransparency](https://docs.expo.dev/versions/v58.0.0/sdk/tracking-transparency.md)
- [Updates](https://docs.expo.dev/versions/v58.0.0/sdk/updates.md)
- [Video (expo-video)](https://docs.expo.dev/versions/v58.0.0/sdk/video.md)
- [VideoThumbnails](https://docs.expo.dev/versions/v58.0.0/sdk/video-thumbnails.md)
- [WebBrowser](https://docs.expo.dev/versions/v58.0.0/sdk/webbrowser.md)
- [Widgets](https://docs.expo.dev/versions/v58.0.0/sdk/widgets.md)
### Third-party libraries
- [Overview](https://docs.expo.dev/versions/v58.0.0/sdk/third-party-overview.md)
- [@react-native-async-storage/async-storage](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage.md)
- [@react-native-community/datetimepicker](https://docs.expo.dev/versions/v58.0.0/sdk/date-time-picker.md)
- [@react-native-community/netinfo](https://docs.expo.dev/versions/v58.0.0/sdk/netinfo.md)
- [@react-native-community/slider](https://docs.expo.dev/versions/v58.0.0/sdk/slider.md)
- [@react-native-masked-view/masked-view](https://docs.expo.dev/versions/v58.0.0/sdk/masked-view.md)
- [@react-native-picker/picker](https://docs.expo.dev/versions/v58.0.0/sdk/picker.md)
- [@react-native-segmented-control/segmented-control](https://docs.expo.dev/versions/v58.0.0/sdk/segmented-control.md)
- [@shopify/flash-list](https://docs.expo.dev/versions/v58.0.0/sdk/flash-list.md)
- [@shopify/react-native-skia](https://docs.expo.dev/versions/v58.0.0/sdk/skia.md)
- [@stripe/stripe-react-native](https://docs.expo.dev/versions/v58.0.0/sdk/stripe.md)
- [react-native-gesture-handler](https://docs.expo.dev/versions/v58.0.0/sdk/gesture-handler.md)
- [react-native-keyboard-controller](https://docs.expo.dev/versions/v58.0.0/sdk/keyboard-controller.md)
- [react-native-maps](https://docs.expo.dev/versions/v58.0.0/sdk/map-view.md)
- [react-native-pager-view](https://docs.expo.dev/versions/v58.0.0/sdk/view-pager.md)
- [react-native-reanimated](https://docs.expo.dev/versions/v58.0.0/sdk/reanimated.md)
- [react-native-safe-area-context](https://docs.expo.dev/versions/v58.0.0/sdk/safe-area-context.md)
- [react-native-screens](https://docs.expo.dev/versions/v58.0.0/sdk/screens.md)
- [react-native-svg](https://docs.expo.dev/versions/v58.0.0/sdk/svg.md)
- [react-native-view-shot](https://docs.expo.dev/versions/v58.0.0/sdk/captureRef.md)
- [react-native-webview](https://docs.expo.dev/versions/v58.0.0/sdk/webview.md)
### Technical specs
- [Expo Updates v1](https://docs.expo.dev/technical-specs/expo-updates-1.md)
- [Expo Structured Field Values](https://docs.expo.dev/technical-specs/expo-sfv-0.md)
### More
- [Expo CLI](https://docs.expo.dev/more/expo-cli.md)
- [create-expo-app](https://docs.expo.dev/more/create-expo.md)
- [create-expo-module](https://docs.expo.dev/more/create-expo-module.md)
- [qr.expo.dev](https://docs.expo.dev/more/qr-codes.md)
- [Release statuses](https://docs.expo.dev/more/release-statuses.md)
- [Glossary of terms](https://docs.expo.dev/more/glossary-of-terms.md)
Full documentation tree: [llms.txt](https://docs.expo.dev/llms.txt)

</AgentInstructions>

The Expo SDK is a collection of packages that provide access to device and system functionality such as camera, contacts, location, sensors, haptics, and more. Each package targets a specific feature and can be used independently. All packages work in any React Native app with the `expo` package installed.

You can install any Expo SDK package using the [`npx expo install`](https://docs.expo.dev/more/expo-cli.md#install) command. For example, three different packages are installed using the following command:

```sh
# npm
npx expo install expo-camera expo-contacts expo-sensors

# yarn
yarn expo install expo-camera expo-contacts expo-sensors

# pnpm
pnpm expo install expo-camera expo-contacts expo-sensors

# bun
bun expo install expo-camera expo-contacts expo-sensors
```

After installing one or more packages, you can import them into your JavaScript code:

```ts
import { CameraView } from 'expo-camera';
import { Contact } from 'expo-contacts';
import { Gyroscope } from 'expo-sensors';
```

This allows you to write [`Contact.getAll()`](https://docs.expo.dev/versions/v58.0.0/sdk/contacts.md#getalloptions) and read the contacts from the device, read the gyroscope sensor to detect device movement, or start the phone's camera and take photos.

## All Expo SDK packages work in any React Native app

Expo apps are React Native apps, so all Expo SDK packages work in any React Native app with the `expo` package installed and configured. The easiest way to create a React Native app with support for Expo SDK packages is to use `create-expo-app`. However, you can also add Expo SDK support to an existing React Native app with the `npx install-expo-modules` command.

```sh
# npm
# Create a project named my-app
npx create-expo-app my-app --template bare-minimum

# yarn
# Create a project named my-app
yarn create expo-app my-app --template bare-minimum

# pnpm
# Create a project named my-app
pnpm create expo-app my-app --template bare-minimum

# bun
# Create a project named my-app
bun create expo my-app --template bare-minimum
```

[Install Expo SDK packages in existing React Native apps](https://docs.expo.dev/bare/installing-expo-modules.md) — Learn more about configuring projects created with npx @react-native-community/cli@latest init to Expo SDK packages. — npx @react-native-community/cli@latest init

[Use libraries](https://docs.expo.dev/workflow/using-libraries.md) — Learn how to install Expo SDK packages in your project.

## Using pre-release versions

New Expo SDK versions are released three times each year. Between these releases, we publish pre-release versions of the `expo` package and all of the Expo SDK packages. Pre-releases are not considered stable and should only be used if you are comfortable with the risk of encountering bugs or other issues.

### Canary releases

Canary releases represent a snapshot of the state of the `main` branch at the time they are published. Canary package versions include `-canary` in the name, along with the date and commit hash, such as `58.0.0-canary-20260909-ea7a89a`. To install the latest canary release:

```sh
# npm
# Install the alpha version of expo and its related packages
npm install expo@canary && npx expo install --fix

# yarn
# Install the alpha version of expo and its related packages
yarn add expo@canary && yarn expo install --fix

# pnpm
# Install the alpha version of expo and its related packages
pnpm add expo@canary && pnpm expo install --fix

# bun
# Install the alpha version of expo and its related packages
bun add expo@canary && bun expo install --fix
```

You can often use pre-release versions of individual packages with stable releases of the Expo SDK. There may occasionally be incompatibilities or other issues that arise in canary-quality releases. You may want to [silence dependency validation warnings](https://docs.expo.dev/more/expo-cli.md#configuring-dependency-validation) if you opt in to the canary package and once you have verified that it works well for your use cases.

### Beta releases

Before each Expo SDK release, we publish beta versions of the `expo` package and all of the Expo SDK packages. Beta releases are considered much more stable than canary releases, and we encourage developers to try them out on their apps and share their feedback. Beta releases use the `beta` tag on npm and follow the instructions in the related [changelog](https://expo.dev/changelog) post.

## Each Expo SDK version depends on a React Native version

| Expo SDK version | React Native version | React version | React Native Web version | React Native TV version | Minimum Node.js version |
| --- | --- | --- | --- | --- | --- |
| 58.0.0 | 0.88 | 19.3.0 | 0.21.0 | 0.87-stable | 22.13.x |
| 57.0.0 | 0.86 | 19.2.3 | 0.21.0 | 0.86-stable | 22.13.x |
| 56.0.0 | 0.85 | 19.2.3 | 0.21.0 | 0.85-stable | 20.19.x |

### Additional information

#### Expo SDK policy for tracking React Native releases

-   Each Expo SDK release targets a single React Native version. This is typically the latest stable version at the time of the release.
-   React Native currently has six releases per year and aims for every release to include no breaking changes.
-   Expo SDK releases aim to follow this cadence.
-   Pre-release versions of the upcoming Expo SDK will include support for the latest version of React Native quickly, usually the same day it is released. A member of the Expo SDK team works on the React Native releases team for each release, and is responsible for continuously updating the React Native version in the Expo repository, verifying compatibility, and reporting regressions back to the React Native team.

#### What if I need a change from the latest React Native version and it's not yet in an Expo SDK release?

Expo engineers on the React Native releases team ensure that any urgent fixes are included in the React Native version used by the latest Expo SDK. If your specific fix won't be cherrypicked into an existing release, perhaps because it is not considered critical or because it involves a breaking change, then you have two options:

1.  Use [`patch-package`](https://github.com/ds300/patch-package) to pull in the fix.
2.  Use a [pre-release version of the Expo SDK](https://docs.expo.dev/versions/v58.0.0.md#using-pre-release-versions).

#### Can I use an older version of React Native with the latest Expo SDK?

Packages in the Expo SDK are intended to support the target React Native version for that SDK. Typically, they will not support older versions of React Native, but they may. When a new version of React Native is released, the latest versions of the Expo SDK packages are typically updated to support it. However, this may take weeks or more, depending on the extent of the changes in the release.

## Support for Android and iOS versions

Each version of Expo SDK supports a minimum OS version of Android and iOS. For Android, the `compileSdkVersion` is defined which tells the [Gradle](https://developer.android.com/studio/build) which Android SDK version to use to compile the app. This also means that you can use the Android API features included in that SDK version and from the previous versions. For iOS, the [Xcode](https://developer.apple.com/news/upcoming-requirements/) tells the minimum Xcode SDK version to use to compile the app.

| Expo SDK version | Android version | `compileSdkVersion` | `targetSdkVersion` | iOS version | Xcode version |
| --- | --- | --- | --- | --- | --- |
| 58.0.0 | 7+ | 37 | 36 | 16.4+ | 26.4+ |
| 57.0.0 | 7+ | 36 | 36 | 16.4+ | 26.4+ |
| 56.0.0 | 7+ | 36 | 36 | 16.4+ | 26.4+ |

When deciding whether to upgrade your Expo SDK version, consider both Expo's SDK version and app store submission requirements, as described in the above table. Google Play Store and Apple App Store periodically increase their minimum required OS versions and API levels, which are required for new app submissions. Expo has no control over the app store requirements, and you should check [Google](https://developer.android.com/studio/build) and [Apple](https://developer.apple.com/news/upcoming-requirements/) for the current store submission requirements.
