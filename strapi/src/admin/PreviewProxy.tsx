import * as React from "react";
import { RouteObject, useSearchParams } from "react-router-dom";
import {
  Box,
  Flex,
  Portal,
  Typography,
  SingleSelect,
  SingleSelectOption,
} from "@strapi/design-system";
import { unstable_useDocument as useDocument } from "@strapi/strapi/admin";

const devices = [
  {
    name: "iPhone 5",
    width: "320px",
    height: "568px",
  },
  {
    name: "iPad",
    width: "768px",
    height: "1024px",
  },
  {
    name: "Fluid",
    width: "100%",
    height: "100%",
  },
];

const PreviewProxy = () => {
  const [searchParams] = useSearchParams();
  const { clientUrl, documentId, kind, ...params } =
    Object.fromEntries(searchParams);
  const previewURL = `${clientUrl}/api/preview?${new URLSearchParams(params).toString()}`;

  const previousDocument = React.useRef<any>(undefined);

  const { document, refetch } = useDocument({
    collectionType:
      kind === "collectionType" ? "collection-types" : "single-types",
    model: params.uid,
    documentId,
    params: { locale: params.locale },
  });

  React.useEffect(() => {
    const handleMessage = async (message) => {
      if (message.data.type === "strapiUpdate") {
        refetch();
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [refetch]);

  React.useEffect(() => {
    if (document != null && previousDocument.current !== document) {
      // Get the diff of the previous and current document, find the path of changed fields
      const [updatedAt, ...changedFields] = Object.keys(document).filter(
        (key) => document[key] !== previousDocument.current?.[key],
      );
    }
  }, [document]);

  const [selectedDevice, setSelectedDevice] = React.useState(0);
  const device = devices[selectedDevice];

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="neutral100"
        zIndex={4}
        padding={2}
      >
        <Box display="inline-block" marginBottom={2}>
          <SingleSelect
            aria-label="Select device"
            placeholder="Select device"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(Number(e))}
          >
            {devices.map((device, index) => (
              <SingleSelectOption key={device.name} value={index}>
                {device.name}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </Box>
        <Box
          tag="iframe"
          src={previewURL}
          width={device.width}
          height={device.height}
          display="block"
          borderWidth={0}
        />
      </Box>
    </Portal>
  );
};

export default PreviewProxy;
