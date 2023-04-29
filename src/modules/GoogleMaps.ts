import { Loader } from "@googlemaps/js-api-loader";

type AdditionalLibrary =
  | "drawing"
  | "geometry"
  | "localContext"
  | "marker"
  | "places"
  | "visualization";

/**
 * GoogleMapsオブジェクトを読み込み
 * @param additionalLibraries 追加ライブラリ
 * @returns 
 */
export const loadGoogleMaps = (
  additionalLibraries: AdditionalLibrary[] = []
): Promise<typeof google.maps> => {
  return new Promise((resolve, reject) => {
    try {
      new Loader({
        apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
        version: "release",
        libraries: additionalLibraries,
        language: "ja",
      })
        .load()
        .then(google => {
          resolve(google.maps);
        })
        .catch(error => {
          reject(error);
        };
    } catch (error) {
      reject(error);
    }
  });
};
