import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import {
  closeDrawer,
  iconSize,
  store,
  toggleActiveLabel,
  toggleDrawer,
} from "./store";

class Average {
  count = 0;
  length = 0;
  data: number[] = [];

  constructor(length = 3) {
    this.length = length;
  }

  add(value: number) {
    this.data[this.count % this.length] = value;
    this.count += 1;
  }

  clear() {
    this.data = Array(length);
  }

  get value() {
    const data = this.data.filter((i) => i != undefined);
    if (data.length == 0) return 0;
    return data.reduce((value, i) => value + i, 0) / data.length;
  }
}

const state = proxy({
  active: { 1: true } as Record<number, boolean>,
});

const width = 288; // 18rem
const averageVelocity = new Average();
let initialOffset = [0, 0];
let offset = [0, 0];
let isScroll = false;
let isDrag = false;
let lastTouchTime = 0;
let root: HTMLElement;
let container: HTMLElement;

export function Drawer() {
  const {
    isDrawerOpen,
    mapData,
    activePointLabels: activeLabels,
  } = useSnapshot(store);
  const { active } = useSnapshot(state);

  useEffect(() => {
    document.body.addEventListener("click", (event) => {
      const drawer = (event.target as HTMLElement).closest("#drawer");
      if (!drawer) {
        closeDrawer();
      }
    });
  }, []);

  return (
    <div
      ref={(ref) => {
        if (ref) root = ref;
      }}
      id="drawer"
      className={classNames(
        "flex flex-col w-72 h-full absolute top-0 bg-white duration-300 ease-out"
      )}
      style={{
        transform: `translate3d(${isDrawerOpen ? 0 : -18}rem, 0, 0)`,
      }}
      onTouchStart={({ touches, timeStamp }) => {
        if (touches.length != 1) return;

        initialOffset = [touches[0].clientX, touches[0].clientY];
        offset = [0, 0];
        lastTouchTime = timeStamp;
        averageVelocity.clear();
        root.classList.remove("duration-300");
      }}
      onTouchMove={(event) => {
        const { touches, timeStamp } = event;
        if (touches.length != 1 || isScroll || !store.isDrawerOpen) return;

        const x = touches[0].clientX - initialOffset[0];
        const y = touches[0].clientY - initialOffset[1];

        if (x > 0) {
          root.style.transform = `translate3d(0, 0, 0)`;
          initialOffset = [touches[0].clientX, touches[0].clientY];
          return;
        }
        if (!isDrag) {
          if (Math.abs(x) < Math.abs(y)) {
            isScroll = true;
            return;
          } else {
            isDrag = true;
            container.classList.add("overflow-y-hidden");
          }
        }

        event.preventDefault();
        averageVelocity.add((x - offset[0]) / (timeStamp - lastTouchTime));
        offset = [x, y];
        lastTouchTime = timeStamp;
        root.style.transform = `translate3d(${x}px, 0, 0)`;
      }}
      onTouchEnd={() => {
        root.classList.add("duration-300");
        container.classList.remove("overflow-y-hidden");
        isScroll = false;
        isDrag = false;

        if (offset[0] == 0) return;
        if (averageVelocity.value > -0.5 && -offset[0] < width / 2) {
          root.style.transform = `translate3d(0, 0, 0)`;
        } else {
          root.style.transform = `translate3d(-18rem, 0, 0)`;
          closeDrawer();
        }
      }}
    >
      <div
        className={classNames(
          "absolute top-8 -right-10 h-10 w-10 bg-white rounded-r flex items-center justify-center duration-300",
          isDrawerOpen ? "" : "opacity-60"
        )}
        onClick={toggleDrawer}
      >
        <ChevronRightIcon
          className={classNames(
            "h-6 w-6 transition-all duration-300",
            isDrawerOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </div>
      <div
        ref={(ref) => {
          if (ref) container = ref;
        }}
        className="overflow-y-auto flex-1 py-2"
      >
        {mapData?.mapPointLabels.map((i) => (
          <div className="px-4 py-3">
            <div
              className="flex"
              onClick={() => {
                state.active[i.id] = !state.active[i.id];
              }}
            >
              <div className="flex-1">{i.name}</div>
              <ChevronDownIcon
                className={classNames(
                  "h-4 w-4 transition-all duration-300",
                  active[i.id] ? "rotate-180" : "rotate-0"
                )}
              />
            </div>
            {active[i.id] == true && (
              <div className="grid grid-cols-2 pt-2.5">
                {i.children.map((i) => (
                  <div
                    className="flex items-center py-1.5"
                    onClick={() => {
                      toggleActiveLabel(i.id);
                    }}
                  >
                    <img
                      src={`${i.icon}?x-oss-process=image/format,webp/resize,w_${iconSize}`}
                      crossOrigin="anonymous"
                      className="w-6 h-6 mr-2"
                    />
                    <div
                      className={classNames(
                        "whitespace-nowrap text-xs text-ellipsis flex-1 overflow-hidden",
                        activeLabels.has(i.id)
                          ? "text-blue-500"
                          : "text-gray-500"
                      )}
                    >
                      {i.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
