import pkg from "./package.json" assert { type: "json" };
import routes from "./server/routes/index.js";
import exportOrders from "./server/controllers/exportOrders.js";

export default {
  register({ strapi }) {},

  bootstrap({ strapi }) {
    strapi.log.info(`🚀 Plugin ${pkg.strapi.name} is loaded`);
  },

  routes,

  controllers: {
    exportOrders,
  },
};
