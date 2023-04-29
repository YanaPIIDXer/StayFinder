import { Loader } from "@googlemaps/js-api-loader";

/**
 * GoogleMapsを扱うためのクラス
 */
export class GoogleMaps {
  private google: typeof google | null = null;
  private map: google.maps.Map | null = null;

  /**
   * コンストラクタ
   * @param mapElement マップのHTML要素
   */
  constructor(private mapElement: HTMLDivElement) {}

  /**
   * 初期化
   */
  async init(): Promise<void> {
    try {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
        version: "beta",
        libraries: ["places"],
        language: "ja",
      });
      this.google = await loader.load();
      this.map = new this.google.maps.Map(this.mapElement, {
        center: new google.maps.LatLng(35.68944, 139.69167), // とりあえず都庁
        zoom: 15,
      });
    } catch (error) {
      console.error("GoogleMaps Init Error.", error);
    }
  }

  /**
   *クエリからPlaceを列挙
   * @param keyword 検索キーワード
   * @returns Placeの配列
   */
  async findPlaceFromQuery(
    keyword: string
  ): Promise<google.maps.places.PlaceResult[]> {
    if (!this.google) {
      throw new Error("Google Map API is not initialized.");
    }

    const { PlacesService } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    const services = new PlacesService(this.mapElement);

    const result = await new Promise<google.maps.places.PlaceResult[]>(
      (resolve, reject) => {
        services.findPlaceFromQuery(
          {
            fields: ["name", "geometry"],
            query: keyword,
            language: "ja",
          },
          (results, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              reject("Stats Error");
              return;
            }

            if (!results) {
              reject("Result Error");
              return;
            }
            resolve(results);
          }
        );
      }
    );
    return result;
  }
}
