import { Events } from "./events";

const IS_SCENE_DIRTY = "supersplat:is-scene-dirty";
const LOAD_FILE = "supersplat:load-file";
const SAVE_SCAN = "supersplat:save-scan";

interface IsSceneDirtyQuery {
  type: typeof IS_SCENE_DIRTY;
}

interface IsSceneDirtyResponse {
  type: typeof IS_SCENE_DIRTY;
  result: boolean;
}

interface LoadFileMessage {
  type: typeof LOAD_FILE;
  filename: string;
  fileData: Blob;
}

const isSceneDirtyQuery = (data: any): data is IsSceneDirtyQuery => {
  return data && typeof data === "object" && data.type === IS_SCENE_DIRTY;
};

const isLoadFileMessage = (data: any): data is LoadFileMessage => {
  return (
    data &&
    typeof data === "object" &&
    data.type === LOAD_FILE &&
    typeof data.filename === "string" &&
    data.fileData instanceof Blob
  );
};

// TODO: implement saveScan to parent (blob to parent)
const saveScan = () => {
  if (window.parent && window.parent !== window) {
    console.log("[IframeAPI] Sending save-scan message to parent");
    window.parent.postMessage({ type: SAVE_SCAN }, "*");
  } else {
    console.log("[IframeAPI] Not in an iframe, log instead: save-scan");
  }
};

const registerIframeApi = (events: Events) => {
  events.function("scene.saveScan", saveScan);
  console.log("[IframeAPI] Initializing and adding message listener...");
  window.addEventListener("message", async (event: MessageEvent) => {
    // Log EVERYTHING received
    // console.log("[IframeAPI] Raw message received:", {
    //   data: event.data,
    //   origin: event.origin,
    //   source: event.source ? "present" : "null",
    //   type: event.data?.type,
    // });

    const source = event.source as Window | null;
    if (!source) {
      console.warn("[IframeAPI] Dropping message: no source");
      return;
    }

    if (isSceneDirtyQuery(event.data)) {
      console.log("[IframeAPI] Handling dirty query");
      const response: IsSceneDirtyResponse = {
        type: IS_SCENE_DIRTY,
        result: events.invoke("scene.dirty") as boolean,
      };
      source.postMessage(response, event.origin);
    } else if (event.data?.type === LOAD_FILE) {
      // Check specifically why validation might fail
      console.log(
        "[IframeAPI] processing LOAD_FILE. Blob check:",
        event.data.fileData instanceof Blob,
      );

      if (isLoadFileMessage(event.data)) {
        console.log(
          "[IframeAPI] Received valid load-file message:",
          event.data.filename,
          event.data.fileData.size,
          "bytes",
        );
        try {
          const file = new File([event.data.fileData], event.data.filename);
          console.log("[IframeAPI] Created File object, calling import...");

          const result = await events.invoke("import", [
            {
              filename: event.data.filename,
              contents: file,
            },
          ]);

          console.log("[IframeAPI] Import completed:", result);
          source.postMessage(
            {
              type: LOAD_FILE,
              success: true,
            },
            event.origin,
          );
        } catch (error) {
          console.error("[IframeAPI] Error loading file:", error);
          source.postMessage(
            {
              type: LOAD_FILE,
              success: false,
              error: error.message,
            },
            event.origin,
          );
        }
      } else {
        console.error(
          "[IframeAPI] Invalid LOAD_FILE message structure:",
          event.data,
        );
      }
    }
  });

  // Notify parent that iframe is ready
  if (window.parent && window.parent !== window) {
    console.log("[IframeAPI] Sending ready message to parent");
    window.parent.postMessage({ type: "supersplat:ready" }, "*");
  }
};

export { saveScan, registerIframeApi };
