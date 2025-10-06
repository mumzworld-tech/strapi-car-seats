import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@strapi/design-system";
import { Download } from "@strapi/icons";

const ExportOrdersButton = (props) => {
  const { pathname } = useLocation();
  const injectedUid =
    props?.uid || props?.layout?.uid || props?.collectionType?.uid;
  const isOrders =
    injectedUid === "api::order.order" ||
    pathname.includes("/content-manager/collection-types/api::order.order");
  if (!isOrders) return null;

  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const baseUrl =
        typeof window !== "undefined" &&
        window.strapi &&
        window.strapi.backendURL
          ? window.strapi.backendURL
          : "";
      const res = await fetch(`${baseUrl}/export-orders/export`, {
        method: "GET",
        headers: {
          Accept: "text/csv",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Export failed: ${res.status} ${text}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export error", err);
      if (typeof window !== "undefined") {
        alert("Failed to export CSV");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      startIcon={<Download />}
      onClick={onClick}
      disabled={loading}
    >
      Export orders CSV
    </Button>
  );
};

export default ExportOrdersButton;
