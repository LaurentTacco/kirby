import AuthError from "@/errors/AuthError.js";
import JsonRequestError from "@/errors/JsonRequestError.js";
import RequestError from "@/errors/RequestError.js";
import Module from "./module.js";
import Timer from "./timer.js";

export const defaults = () => {
	return {
		context: null,
		details: null,
		isOpen: false,
		message: null,
		timeout: null,
		type: null
	};
};

export default (panel = {}) => {
	const parent = Module("notification", defaults());

	return {
		...parent,

		/**
		 * Closes the notification by
		 * setting the inactive state (defaults)
		 *
		 * @returns {Object} The inactive state
		 */
		close() {
			// stop any previous timers
			this.timer.stop();

			// reset the defaults
			this.reset();

			// return the closed state
			return this.state();
		},

		/**
		 * Sends a deprecation warning to the console
		 *
		 * @param {String} message
		 */
		deprecated(message) {
			console.warn("Deprecated: " + message);
		},

		/**
		 * Converts an error object or string
		 * into an error notification
		 *
		 * @param {Error|Object|String} error
		 * @returns {Object} The notification state
		 */
		error(error) {
			if (error instanceof AuthError) {
				return panel.redirect("logout");
			}

			if (error instanceof JsonRequestError) {
				return this.fatal(error);
			}

			if (error instanceof RequestError) {
				// get the broken element in the response json that
				// has an error message. This can be deprecated later
				// when the server always sends back a simple error
				// response without nesting it in $dropdown, $dialog, etc.
				const broken = Object.values(error.response.json).find(
					(element) => typeof element?.error === "string"
				);

				if (broken) {
					error.message = broken.error;
				}
			}

			// convert strings to full error objects
			if (typeof error === "string") {
				error = {
					message: error,
					type: "error"
				};
			}

			// fill in some defaults
			error.message = error.message ?? "Something went wrong";
			error.details = error.details ?? {};

			// open the error dialog in views
			if (panel.context === "view") {
				return panel.dialog.open({
					component: "k-error-dialog",
					props: error
				});
			}

			// show the error notification bar
			return this.open({
				message: error.message,
				type: "error"
			});
		},

		/**
		 * Getter that converts the notification type
		 * into the matching icon
		 *
		 * @returns {String}
		 */
		get icon() {
			return this.type === "success" ? "check" : "alert";
		},

		/**
		 * Checks if the notification is a fatal
		 * error. Those are displayed in the <k-fatal>
		 * component which sends them to an isolated
		 * iframe. This will happen when API responses
		 * cannot be parsed at all.
		 */
		get isFatal() {
			return this.type === "fatal";
		},

		/**
		 * Creates a fatal error based on an
		 * Error object or string
		 *
		 * @param {Error|Object|String} error
		 * @returns {Object} The notification state
		 */
		fatal(error) {
			if (typeof error === "string") {
				return this.open({
					message: error,
					type: "fatal"
				});
			}

			if (error instanceof JsonRequestError) {
				return this.open({
					message: error.response.text,
					type: "fatal"
				});
			}

			return this.open({
				message: error.message ?? "Something went wrong",
				type: "fatal"
			});
		},

		/**
		 * Opens the notification
		 * The context will determine where it will
		 * be shown.
		 *
		 * @param {Error|Object|String} notification
		 * @returns {Object} The notification state
		 */
		open(notification) {
			// stop any previous timers
			this.timer.stop();

			// simple success notifications
			if (typeof notification === "string") {
				return this.success(notification);
			}

			// add the current editing context
			notification.context = panel.context;

			// set the new state
			this.set(notification);

			// open the notification
			this.isOpen = true;

			// start a timer to auto-close the notification
			this.timer.start(this.timeout, () => this.close());

			// returns the new open state
			return this.state();
		},

		/**
		 * Shortcut to create a success
		 * notification. You can pass a simple
		 * string or a state object.
		 *
		 * @param {Object|String} success
		 * @returns {Object} The notification state
		 */
		success(success) {
			if (!success) {
				success = {};
			}

			if (typeof success === "string") {
				success = { message: success };
			}

			return this.open({
				timeout: 4000,
				type: "success",
				...success
			});
		},

		/**
		 * Getter that converts the notification type
		 * into the matching notification component theme
		 *
		 * @returns {String}
		 */
		get theme() {
			return this.type === "error" ? "negative" : "positive";
		},

		/**
		 * Holds the timer object
		 */
		timer: Timer
	};
};