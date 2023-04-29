import { Loader } from "@googlemaps/js-api-loader";

/**
 * APIオブジェクト
 */
interface ApiObject {
  google: typeof google;
  map: google.maps.Map;
}

/**
 * GoogleMapsを扱うためのクラス
 */
export class GoogleMaps {
  private api: ApiObject | null = null;

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
      const google = await loader.load();
      const map = new google.maps.Map(this.mapElement, {
        center: new google.maps.LatLng(35.68944, 139.69167), // とりあえず都庁
        zoom: 15,
      });
      this.api = {
        google,
        map,
      };
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
    this.api?.map.setCenter({ lat, lng });
  }

  /**
   * マーカー追加
   * @param lat 経度
   * @param lng 緯度
   */
  addMarker(lat: number, lng: number): google.maps.Marker {
    if (!this.api) {
      throw new Error("Google Map API is nt initialized.");
    }
    return new google.maps.Marker({
      position: { lat, lng },
      map: this.api.map,
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
    if (!this.api) {
      throw new Error("Google Map API is not initialized.");
    }

    const { PlacesService } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    const services = new PlacesService(this.api.map);

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
        this.api.map.setCenter({
          lat: geometry.location.lat()!,
          lng: geometry.location.lng()!,
        });
      }
    }
    return result;
  }
}
