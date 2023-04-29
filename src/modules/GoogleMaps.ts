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
   * 座標を設定
   * @param lat 経度
   * @param lng 緯度
   */
  setCenter(lat: number, lng: number): void {
    this.map?.setCenter({ lat, lng });
  }

  /**
   * マーカー追加
   * @param lat 経度
   * @param lng 緯度
   */
  addMarker(lat: number, lng: number): google.maps.Marker {
    if (!this.map) {
      throw new Error("Google Map API is nt initialized.");
    }
    return new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
    });
  }

  /**
   *クエリからPlaceを列挙
   * @param keyword 検索キーワード
   * @returns Placeの配列
   */
  async findPlaceFromQuery(
    keyword: string,
    fields: string[] = ["name"]
  ): Promise<google.maps.places.PlaceResult[]> {
    if (!this.google || !this.map) {
      throw new Error("Google Map API is not initialized.");
    }

    const { PlacesService } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    const services = new PlacesService(this.map);

    const result = await new Promise<google.maps.places.PlaceResult[]>(
      (resolve, reject) => {
        services.findPlaceFromQuery(
          {
            fields: [...fields, "geometry"], // geometryはこの後使うので絶対出力
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
    if (result.length) {
      const geometry = result[0].geometry;
      if (geometry && geometry.location) {
        this.map.setCenter({
          lat: geometry.location.lat()!,
          lng: geometry.location.lng()!,
        });
      }
    }
    return result;
  }
}
