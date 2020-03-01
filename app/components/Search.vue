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
      <Label class="action-bar-title" text="Search"></Label>
    </ActionBar>

    <StackLayout class="nt-form">
      <StackLayout class="nt-input">
        <MLKitFaceDetection
          width="150"
          height="150"
          opacity="0.8"
          localModelResourceFolder="leftright"
          processEveryNthFrame="60"
          confidenceThreshold="0.4"
          (scanResult)="ondetectFacesOnDevice($event)"
          class="font-weight-bold m-b-5"
        ></MLKitFaceDetection>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import {
  MLKitFaceDetection,
  MLKitDetectFacesOnDeviceResult,
  ondetectFacesOnDevice
} from "nativescript-plugin-firebase/mlkit/facedetection";
import * as Camera from "nativescript-camera";
import { ImageAsset } from "tns-core-modules/image-asset";
import { fromFile, ImageSource } from "tns-core-modules/image-source";

export default {
  data() {
    return {
      pickedImage: ImageSource
    };
  },
  components: {
    MLKitFaceDetection
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Search");
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
    ondetectFacesOnDevice(imageSource) {
      detectFacesOnDevice({
          image: imageSource,
          detectionMode: "accurate",
          enableFaceTracking: false,
          minimumFaceSize: 0.25
        })
        .then(function(result) {
          alert({
            title: `Result`,
            message: JSON.stringify(result.faces),
            okButtonText: "OK"
          });
        })
        .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
</style>
