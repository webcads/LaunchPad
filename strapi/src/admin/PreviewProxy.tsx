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

const ExpoPreview = () => {
  const qrCodeSrc = React.useMemo(() => {
    const qrCodeUrl = new URL("https://qr.expo.dev/eas-update");
    qrCodeUrl.searchParams.append(
      "projectId",
      "4327bdd6-9794-49d7-9b95-6a5198afd339",
    );
    qrCodeUrl.searchParams.append("runtimeVersion", "1.0.0");
    qrCodeUrl.searchParams.append("channel", "default");
    return qrCodeUrl.toString();
  }, []);

  return (
    <Flex
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <img src={qrCodeSrc} alt="Expo QR Code" />
    </Flex>
  );
};

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
  {
    name: "Native mobile app",
  },
];

const PreviewProxy = () => {
  const [searchParams] = useSearchParams();
  const { clientUrl, documentId, kind, ...params } =
    Object.fromEntries(searchParams);
  const previewURL = `${clientUrl}/api/preview?${new URLSearchParams(params).toString()}`;

  const previousDocument = React.useRef<any>(undefined);
  const iframe = React.useRef<HTMLIFrameElement>(null);

  const { refetch } = useDocument({
    collectionType:
      kind === "collectionType" ? "collection-types" : "single-types",
    model: params.uid,
    documentId,
    params: { locale: params.locale },
  });

  React.useEffect(() => {
    const handleMessage = async (message) => {
      if (message.data.type === "strapiUpdate") {
        const response = await refetch();
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

  const [selectedDevice, setSelectedDevice] = React.useState(2);
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
        <Box display="inline-block" marginBottom={2} paddingLeft={8}>
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
        {selectedDevice === devices.length - 1 ? (
          <ExpoPreview />
        ) : (
          <Box
            tag="iframe"
            src={previewURL}
            width={device.width}
            height={device.height}
            display="block"
            borderWidth={0}
            ref={iframe}
          />
        )}
      </Box>
    </Portal>
  );
};

export default PreviewProxy;
