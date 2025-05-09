import * as React from "react";
import { unstable_useDocument as useDocument } from "@strapi/strapi/admin";
import { useSearchParams } from "react-router-dom";

export function useDeviceSelector() {
  const devices = [
    {
      id: "web-fluid" as const,
      name: "Web",
      width: "100%",
      height: "100%",
    },
    // {
    //   id: "web-phone" as const,
    //   name: "Web (iPhone 5)",
    //   width: "320px",
    //   height: "568px",
    // },
    // {
    //   id: "web-tablet" as const,
    //   name: "Web (iPad)",
    //   width: "768px",
    //   height: "1024px",
    // },
    {
      id: "native" as const,
      name: "Native mobile app",
    },
  ];

  const [selectedDeviceId, setSelectedDeviceId] =
    React.useState<(typeof devices)[number]["id"]>("web-fluid");
  const selectedDevice =
    devices.find((device) => device.id === selectedDeviceId) ?? devices[0];
  const handleDeviceChange = (e: any) => setSelectedDeviceId(e);
  const isMobileApp = selectedDevice.id === "native";

  return { devices, selectedDevice, handleDeviceChange, isMobileApp };
}

export function useUpdateHighlighter() {
  const [searchParams] = useSearchParams();
  const { kind, model, documentId, locale } = Object.fromEntries(searchParams);

  const previousDocument = React.useRef<any>(undefined);
  const iframe = React.useRef<HTMLIFrameElement>(null);

  const { refetch } = useDocument({
    collectionType:
      kind === "collectionType" ? "collection-types" : "single-types",
    model,
    documentId,
    params: { locale },
  });

  React.useEffect(() => {
    const handleMessage = async (message) => {
      if (message.data.type === "strapiUpdate") {
        const response: any = await refetch();
        const document = response.data.data;

        let changedFields: Array<string> = [];
        if (document != null && previousDocument.current !== document) {
          // Get the diff of the previous and current document, find the path of changed fields
          changedFields = Object.keys(document).filter(
            (key) => document[key] !== previousDocument.current?.[key],
          );
        }

        iframe.current?.contentWindow?.postMessage(
          { ...message.data, changedFields },
          new URL(iframe.current.src).origin,
        );

        previousDocument.current = document;
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [refetch]);

  return { iframe };
}
