# @vivid-web/pusher-react

## 0.1.2

### Patch Changes

- 342066c: Add support for React ^17.0.0
- dcb0112: Add `dependsOn` rule for build jobs

  This will make sure that the build for the basic example does not start before `@vivid-web/pusher-react` has been built.

- 1112a4c: Use `tsc` for building the library.

  This will improve the build step and removes `tsup` as a dependency of the project. Also improves the file structure for
  the TypeScript configuration.

## 0.1.1

### Patch Changes

- 36240be: Set JSX to react-jsx instead of preserve

## 0.1.0

### Minor Changes

- 4665170: Add a new usePrivateChannel helper
- 3d8dd61: Initial version
- 15e4400: Renamed usePusherEvent to useEvent
- ff49f24: Renamed usePusherChannel to useChannel
