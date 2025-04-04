import { lazy } from "react";
import { RouteObject, useSearchParams } from "react-router-dom";
import { Box, Flex, Portal, Typography } from "@strapi/design-system";

const devices = [
  {
    name: "iPhone 5",
    width: 320,
    height: 568,
  },
  {
    name: "iPad",
    width: 768,
    height: 1024,
  },
  {
    name: "MacBook Pro",
    width: 1440,
    height: 900,
  },
];

const PreviewProxy = () => {
  const [searchParams] = useSearchParams();
  const { clientUrl, ...params } = Object.fromEntries(searchParams);
  const previewURL = `${clientUrl}/api/preview?${new URLSearchParams(params).toString()}`;

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="neutral100"
        zIndex={1000}
        padding={2}
      >
        <Flex gap={4} overflow="scroll" alignItems="flex-start">
          {devices.map((device) => (
            <Box
              key={device.name}
              background="neutral200"
              hasRadius
              textAlign="center"
            >
              <Typography variant="beta">{device.name}</Typography>
              <Box
                tag="iframe"
                src={previewURL}
                width={device.width + "px"}
                height={device.height + "px"}
                display="block"
                borderWidth={0}
              />
            </Box>
          ))}
        </Flex>
      </Box>
    </Portal>
  );
};

export default PreviewProxy;
