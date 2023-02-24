import { TileLayer, Tilemap } from "@7c00/canvas-tilemap";
import { store, updateMapData } from ".";
import mapDataJson from "../../data/maps-data.json";
import { MapData } from "../../data/maps-data-types";

const defaultMapOptions = { tileSize: 512, minZoom: 0, maxZoom: 3 };
export let tilemap: Tilemap;
let mapDataList: MapData[];
let defaultTileLayer: TileLayer;

export async function initTilemap(element: HTMLElement | null) {
  if (!element) return;

  mapDataList = await (await fetch(mapDataJson)).json();
  store.mapData = mapDataList[0];
  updateMapData();
  const { size, origin, id } = store.mapData;
  tilemap = new Tilemap({ element, size, origin, maxZoom: 0.5 });
  defaultTileLayer = new TileLayer(tilemap, {
    ...defaultMapOptions,
    getTileUrl: (x, y, z) => `tiles/${id}/${z}_${x}_${y}.webp`,
  });
  tilemap.tileLayers.add(defaultTileLayer);
}
