import { TileLayer, Tilemap } from "@7c00/canvas-tilemap";
import { MapData } from "./map-data-types";
import mapDataJson from "../../data/map-data.json";

const defaultMapOptions = { tileSize: 512, minZoom: 0, maxZoom: 3 };
export let tilemap: Tilemap;
let mapDataList: MapData[];
let mapData: MapData;
let defaultTileLayer: TileLayer;

export async function initTilemap(element: HTMLElement | null) {
  if (!element) return;

  mapDataList = await (await fetch(mapDataJson)).json();
  mapData = mapDataList[0];
  const size = mapData.size as [number, number];
  const origin = mapData.origin as [number, number];
  tilemap = new Tilemap({ element, size, origin, maxZoom: 0.5 });
  defaultTileLayer = new TileLayer(tilemap, {
    ...defaultMapOptions,
    getTileUrl(x, y, z) {
      return `tiles/${z}_${x}_${y}.webp`;
    },
  });
  tilemap.tileLayers.add(defaultTileLayer);
}
