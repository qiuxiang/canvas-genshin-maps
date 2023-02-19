import { MarkerLayer } from "@7c00/canvas-tilemap";
import { proxy } from "valtio";
import { proxySet } from "valtio/utils";
import { MapData, MapPointLabel } from "./map-data-types";
import { tilemap } from "./tilemap";

const pointLabelMap = {} as Record<number, MapPointLabel>;
const markerLayerMap = {} as Record<number, MarkerLayer>;
export const iconSize = 32 * devicePixelRatio;

export const store = proxy({
  isDrawerOpen: false,
  mapData: null as MapData | null,
  activePointLabels: proxySet<number>(),
});

export function toggleDrawer() {
  store.isDrawerOpen = !store.isDrawerOpen;
}

export function closeDrawer() {
  store.isDrawerOpen = false;
}

export function updateMapData() {
  for (const { children } of store.mapData!.mapPointLabels) {
    for (const pointLabel of children) {
      pointLabelMap[pointLabel.id] = pointLabel;
    }
  }
}

export async function toggleActiveLabel(id: number) {
  if (store.activePointLabels.has(id)) {
    store.activePointLabels.delete(id);
    tilemap.markerLayers.delete(markerLayerMap[id]);
    tilemap.draw();
  } else {
    store.activePointLabels.add(id);
    const pointLabel = pointLabelMap[id];
    let markerLayer = markerLayerMap[id];
    if (!markerLayer) {
      markerLayer = new MarkerLayer(tilemap, {
        image: createMarkerImage(pointLabel.icon),
        items: pointLabel.mapPoints.map((i) => ({ ...i })),
      });
      markerLayerMap[id] = markerLayer;
    }
    tilemap.markerLayers.add(markerLayer);
  }
}

function createMarkerImage(url: string) {
  const canvas = document.createElement("canvas");
  const canvas2d = canvas.getContext("2d")!;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = url + `?x-oss-process=image/format,webp/resize,w_${iconSize}`;
  image.addEventListener("load", () => {
    const padding = 4 * devicePixelRatio;
    canvas.width = iconSize;
    canvas.height = iconSize;
    const radius = iconSize / 2;
    canvas2d.arc(radius, radius, radius, 0, 2 * Math.PI);
    canvas2d.fillStyle = "rgba(255, 255, 255, 0.8)";
    canvas2d.fill();
    canvas2d.drawImage(
      image,
      padding,
      padding,
      iconSize - padding * 2,
      iconSize - padding * 2
    );
    tilemap.draw();
  });
  return canvas;
}

export function initStore() {}
