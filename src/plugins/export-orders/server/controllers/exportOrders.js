export default {
  async index(ctx) {
    try {
      const { startDate, endDate } = ctx.query || {};

      const where = {};
      if (startDate && endDate) {
        where.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Fetch orders with minimal populate to avoid duplicates
      const orders = await strapi.entityService.findMany("api::order.order", {
        fields: [
          "id",
          "orderId",
          "price",
          "total",
          "paymentStatus",
          "paymentId",
          "responseId",
          "currencyCode",
          "locales",
          "createdAt",
          "updatedAt",
        ],
        populate: {
          package: { fields: ["title"] },
        },
        filters: {
          ...where,
        },
        sort: { createdAt: "desc" },
      });

      // De-duplicate by unique id
      const idToOrder = new Map();
      for (const o of orders || []) {
        if (o && !idToOrder.has(o.id)) idToOrder.set(o.id, o);
      }
      const uniqueOrders = Array.from(idToOrder.values());

      const rows = uniqueOrders.map((o) => ({
        orderId: o.orderId || "",
        package: o.package?.title || "",
        price: o.price ?? "",
        total: o.total ?? "",
        paymentStatus: o.paymentStatus || "",
        paymentId: o.paymentId || "",
        responseId: o.responseId || "",
        currencyCode: o.currencyCode || "",
        locales: o.locales || "",
        customer_fullName: o.customer?.fullName || "",
        customer_email: o.customer?.email || "",
        customer_countryCode: o.customer?.countryCode || "",
        customer_phone: o.customer?.phone || "",
        location_address: o.location?.address || "",
        location_city: o.location?.city || "",
        location_area: o.location?.area || "",
        location_country: o.location?.country || "",
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      }));

      const headers =
        rows.length > 0
          ? Object.keys(rows[0])
          : [
              "orderId",
              "package",
              "price",
              "total",
              "paymentStatus",
              "paymentId",
              "responseId",
              "currencyCode",
              "locales",
              "customer_fullName",
              "customer_email",
              "customer_countryCode",
              "customer_phone",
              "location_address",
              "location_city",
              "location_area",
              "location_country",
              "createdAt",
              "updatedAt",
            ];
      const escapeCell = (v) => {
        const s = String(v ?? "");
        if (s.includes(",") || s.includes("\n") || s.includes('"')) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      };

      const csv = [headers.join(",")]
        .concat(rows.map((r) => headers.map((h) => escapeCell(r[h])).join(",")))
        .join("\n");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `orders_${startDate || "all"}_${endDate || "all"}_${timestamp}.csv`;

      ctx.set("Content-Disposition", `attachment; filename=${fileName}`);
      ctx.set("Content-Type", "text/csv; charset=utf-8");
      ctx.status = 200;
      ctx.body = csv;
    } catch (err) {
      strapi.log.error("CSV Export failed:", err);
      ctx.status = 500;
      ctx.body = { error: "Failed to export orders." };
    }
  },
};
