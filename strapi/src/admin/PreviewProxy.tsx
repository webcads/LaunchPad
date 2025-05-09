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
import { ExpoPreview } from "./utils/ExpoPreview";
import { useDeviceSelector, useUpdateHighlighter } from "./utils/hooks";

const PreviewProxy = () => {
  const [searchParams] = useSearchParams();
  const { clientUrl, documentId, kind, ...params } =
    Object.fromEntries(searchParams);
  const previewURL = `${clientUrl}/api/preview?${new URLSearchParams(params).toString()}`;

  const { devices, selectedDevice, handleDeviceChange, isMobileApp } =
    useDeviceSelector();

  const { iframe } = useUpdateHighlighter();

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
      >
        <Flex gap={4} justifyContent="center" padding={2}>
          <Typography>Preview on:</Typography>
          <SingleSelect value={selectedDevice.id} onChange={handleDeviceChange}>
            {devices.map((device) => (
              <SingleSelectOption key={device.name} value={device.id}>
                {device.name}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </Flex>
        {isMobileApp ? (
          <ExpoPreview />
        ) : (
          <Box
            tag="iframe"
            src={previewURL}
            width={selectedDevice.width}
            height={selectedDevice.height}
            marginLeft="auto"
            marginRight="auto"
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
