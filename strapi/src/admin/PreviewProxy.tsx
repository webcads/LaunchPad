import { lazy } from "react";
import { RouteObject, useSearchParams } from "react-router-dom";
import { Box, Portal, Typography } from "@strapi/design-system";

const PreviewProxy = () => {
  const [searchParams] = useSearchParams();

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
        <Typography variant="alpha">Preview Proxy</Typography>
        <pre style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>
          <code>
            {JSON.stringify(Object.fromEntries(searchParams), null, 2)}
          </code>
        </pre>
      </Box>
    </Portal>
  );
};

export default PreviewProxy;
