<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <!--
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton ios:visibility="collapsed" icon="res://menu" @tap="onDrawerButtonTap"></NavigationButton>
      <!--
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
      -->
      <ActionItem
        icon="res://menu"
        android:visibility="collapsed"
        @tap="onDrawerButtonTap"
        ios.position="left"
      ></ActionItem>
      <Label class="action-bar-title" text="Featured"></Label>
    </ActionBar>

    <StackLayout class="nt-form">
      <StackLayout class="nt-input">
        <Button text="bt 1" @tap="doCheckAvailable" />
        <Button text="bt 2" @tap="doCheckFingerprintsChanged" />
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";

var fingerprintAuthPlugin = require("nativescript-fingerprint-auth");
var fingerprintAuth = new fingerprintAuthPlugin.FingerprintAuth();

export default {
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Featured");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },

    doCheckAvailable() {
      fingerprintAuth.available().then(function(avail) {
        console.log("Available? " + avail);
      });
    },

    doCheckFingerprintsChanged() {
      fingerprintAuth
        .verifyFingerprintWithCustomFallback({
          message: "Scan yer finger", // optional, shown in the fingerprint dialog (default: 'Scan your finger').
          fallbackMessage: "Enter PIN", // optional, the button label when scanning fails (default: 'Enter password').
          authenticationValidityDuration: 10 // optional (used on Android, default 5)
        })
        .then(
          () => {
            console.log("Fingerprint was OK");
          },
          error => {
            // when error.code === -3, the user pressed the button labeled with your fallbackMessage
            console.log(
              "Fingerprint NOT OK. Error code: " +
                error.code +
                ". Error message: " +
                error.message
            );
          }
        );
    },

    doVerifyFingerprintWithCustomFallback() {
      fingerprintAuth
        .verifyFingerprintWithCustomFallback({
          message: "Scan yer finger", // optional
          fallbackMessage: "Enter PIN", // optional
          authenticationValidityDuration: 10 // Android
        })
        .then(() => this.set("status", "Biometric ID OK"))
        .catch(error => {
          this.set("status", "Biometric ID NOT OK: " + JSON.stringify(error));
          alert({
            title: "Biometric ID NOT OK",
            message: error.code === -3 ? "Show custom fallback" : error.message,
            okButtonText: "Mmkay"
          });
        });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
</style>
