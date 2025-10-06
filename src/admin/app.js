import ExportOrdersButton from "./components/ExportOrdersButton";

const config = {};

const bootstrap = (app) => {
  app.getPlugin("content-manager").injectComponent("listView", "actions", {
    name: "ExportOrdersButton",
    Component: ExportOrdersButton,
  });
};

export default {
  config,
  bootstrap,
};
