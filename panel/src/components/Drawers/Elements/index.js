import Body from "./Body.vue";
import Fields from "./Fields.vue";
import Header from "./Header.vue";
import Notification from "./Notification.vue";
import Tabs from "./Tabs.vue";

export default {
	install(app) {
		app.component("k-drawer-body", Body);
		app.component("k-drawer-fields", Fields);
		app.component("k-drawer-header", Header);
		app.component("k-drawer-notification", Notification);
		app.component("k-drawer-tabs", Tabs);
	}
};