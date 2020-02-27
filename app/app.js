import Vue from "nativescript-vue";
import App from "./components/App";
import Home from "./components/Home";
import DrawerContent from "./components/DrawerContent";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
Vue.use(RadSideDrawer);

const firebase = require("nativescript-plugin-firebase");

Vue.config.silent = (TNS_ENV === 'production');

firebase.init({
  // can be used to catch in-app-messaging dynamic links, but it's not mandatory
  onDynamicLinkCallback: result => {
    console.log("Dynamic Link received: " + result);
    console.log("Dynamic Link received, url: " + result.url);
    if (result.url.indexOf("/shit") > -1) {
      // note that you could deeplink/route the user now, but let's just show an alert
    }
  }
})
    .then(() => console.log("Firebase initialized"))
    .catch(error => console.log("Error initializing Firebase: " + error));

new Vue({
    render (h) {
        return h(
          App,
          [
            h(DrawerContent, { slot: 'drawerContent' }),
            h(Home, { slot: 'mainContent' })
          ]
        )
      }
  }).$start();
