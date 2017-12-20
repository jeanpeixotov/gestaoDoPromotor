VERSION=$(node -p "require('./package.json').version") 
echo "version $VERSION"

rm gestaoDoPromotor.apk
(cd android && ./gradlew assembleRelease)
mv android/app/build/outputs/apk/app-release.apk gestaoDoPromotor.apk

echo "Bundle source map ANDROID"
yarn react-native bundle -- \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/gestaodopromotor.android.bundle \
  --sourcemap-output /tmp/gestaodopromotor.android.sourcemap

yarn bugsnag-sourcemaps upload -- \
     --api-key 00055e70250ad10fdc398c29dfc02fb0 \
     --app-version $VERSION \
     --minified-file /tmp/gestaodopromotor.android.bundle \
     --source-map /tmp/gestaodopromotor.android.sourcemap \
     --minified-url index.android.bundle \
     --upload-sources \
     --overwrite

echo "Bundle source map IOS"
yarn react-native bundle -- \
  --platform ios \
  --dev false \
  --entry-file index.ios.js \
  --bundle-output /tmp/gestaodopromotor.ios.bundle \
  --sourcemap-output /tmp/gestaodopromotor.ios.sourcemap

yarn bugsnag-sourcemaps upload -- \
     --api-key 00055e70250ad10fdc398c29dfc02fb0 \
     --app-version $VERSION \
     --minified-file /tmp/gestaodopromotor.ios.bundle \
     --source-map /tmp/gestaodopromotor.ios.sourcemap \
     --minified-url index.ios.bundle \
     --upload-sources \
     --overwrite