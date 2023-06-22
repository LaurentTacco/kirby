import Elements from "./Elements/index.js";

import Drawer from "./Drawer.vue";

import BlockDrawer from "./BlockDrawer.vue";
import FiberDrawer from "./FiberDrawer.vue";
import FormDrawer from "./FormDrawer.vue";

export default {
	install(app) {
		app.use(Elements);

		app.component("k-drawer", Drawer);

		app.component("k-block-drawer", BlockDrawer);
		app.component("k-fiber-drawer", FiberDrawer);
		app.component("k-form-drawer", FormDrawer);
	}
};
