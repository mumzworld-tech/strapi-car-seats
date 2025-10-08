import React, { useState } from "react";
import { Button } from "@strapi/design-system";
import { Download } from "@strapi/icons";

const DownloadInvoiceButton = (props) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Get the document ID from URL - try multiple methods
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/');
  let id = pathParts[pathParts.length - 1];

  // Try to extract ID from different URL patterns
  if (id === 'edit' || id === 'create') {
    // Maybe the ID is earlier in the path
    const editIndex = pathParts.indexOf('edit');
    if (editIndex !== -1 && editIndex < pathParts.length - 1) {
      id = pathParts[editIndex + 1];
    }
  }

  // For debugging, log
  console.log("DownloadInvoiceButton props:", props);
  console.log("Full pathname:", pathname);
  console.log("Path parts:", pathParts);
  console.log("Extracted ID:", id);

  // Only show for Order collection - try multiple ways to get the UID
  const uid = props?.layout?.contentType?.uid || props?.layout?.uid || props?.slug || props?.contentType?.uid;
  console.log("uid:", uid);

  // For debugging, show button regardless of conditions
  console.log("Download Invoice Button component rendered");

  // Uncomment these conditions when debugging is done
  /*
  // Show only for order collection
  if (uid !== "api::order.order") {
    console.log("Not showing button - uid doesn't match:", uid);
    return null;
  }

  // Show only if we have an ID
  if (!id || id === 'create') {
    console.log("Not showing button - invalid id:", id);
    return null;
  }
  */

  console.log("Showing Download Invoice Button");

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true);

      // Get the backend URL
      const baseUrl =
        typeof window !== "undefined" &&
        window.strapi &&
        window.strapi.backendURL
          ? window.strapi.backendURL
          : "";

      // Call the plugin endpoint to download the invoice
      const response = await fetch(
        `${baseUrl}/download-invoice/download/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // For text files, open in new tab to download
      const url = `${baseUrl}/download-invoice/download/${id}`;
      window.open(url, '_blank');

      // Show success notification (optional)
      if (typeof window !== "undefined" && window.strapi?.notification) {
        window.strapi.notification.toggle({
          type: "success",
          message: `Invoice downloaded successfully`,
        });
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Show error notification (optional)
      if (typeof window !== "undefined" && window.strapi?.notification) {
        window.strapi.notification.toggle({
          type: "warning",
          message: "Failed to download invoice. Please try again.",
        });
      } else {
        alert("Failed to download invoice. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadInvoice}
      loading={isDownloading}
      disabled={isDownloading}
      startIcon={<Download />}
      size="S"
      variant="secondary"
    >
      Download Invoice
    </Button>
  );
};

export default DownloadInvoiceButton;