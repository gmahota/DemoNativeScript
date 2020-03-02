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
      <Label class="action-bar-title" text="Attendance"></Label>
    </ActionBar>

    <StackLayout class="nt-form">
      <StackLayout class="nt-input">
        <Label row="0" text="Pick the image processing source:" textWrap="true"></Label>

        <FlexboxLayout row="1" flexDirection="row" justifyContent="space-around">
          <Button text="Cam roll" textWrap="true" @tap="fromCameraRoll()" class="button"></Button>
        </FlexboxLayout>

        <Image
          row="2"
          :src="pickedImage"
          width="240"
          horizontalAlignment="center"
          @tap="reusePickedImage()"
        ></Image>

        <Label
          row="3"
          :text="pickedImage ? '⬆️ Tap the image to use it again' : ''"
          textWrap="true"
          horizontalAlignment="center"
          class="m-b-20"
          width="100%"
        ></Label>
      </StackLayout>
      <StackLayout class="nt-input">
        <Button text="Take Picture" @tap="takePicture" />
        <Image id="image" :src="img" width="150" height="150" />
      </StackLayout>

      <StackLayout class="nt-input">
        <Label class="font-weight-bold m-b-5 fas" text.decode="&#xf041;"></Label>
        <Label class="font-weight-bold m-b-5" :text="message"></Label>
        <Button text="Get My Location" @tap="getLocation" class="btn btn-primary" />
        <Label :text="'Time: ' + time" class="font-weight-bold m-b-5" />
        <Label :text="'Latitude: ' + lat" class="font-weight-bold m-b-5" />
        <Label :text="'Longitude: ' + lon" class="font-weight-bold m-b-5" />
        <Label :text="'Speed: ' + speed" class="font-weight-bold m-b-5" />
        <Label :text="'Address: ' + addr" textWrap="true" class="font-weight-bold m-b-5" />
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import {
  MLKitFaceDetection,
  detectFacesOnDevice
} from "nativescript-plugin-firebase/mlkit/facedetection";
import {
  MLKitObjectDetection,
  detectObjects
} from "nativescript-plugin-firebase/mlkit/objectdetection";

import * as camera from "nativescript-camera";
import { ImageAsset } from "tns-core-modules/image-asset";
import { fromFile, ImageSource } from "tns-core-modules/image-source";
import * as ImagePicker from "nativescript-imagepicker";
import * as Geolocation from "nativescript-geolocation";
//import { MLKitAutoML  } from "nativescript-plugin-firebase/mlkit/automl";

const firebase = require("nativescript-plugin-firebase");
const imageSource = require("tns-core-modules/image-source");

const { Accuracy } = require("tns-core-modules/ui/enums");

export default {
  components: {
    MLKitFaceDetection
  },
  data() {
    return {
      needLocation: false,
      locationFailure: true,
      lat: "",
      lon: "",
      speed: "",
      addr: "",
      time: "",
      message: "Attendance Record",
      img: "",
      pickedImage: null
    };
  },
  methods: {
    //ML KIT Face Recognation
    ondetectFacesOnDevice(imageSource) {
      detectFacesOnDevice({
        image: imageSource,
        detectionMode: "accurate",
        enableFaceTracking: true,
        minimumFaceSize: 0.25
      })
        .then(function(result) {
          alert({
            title: `Result`,
            message: JSON.stringify(result.faces),
            okButtonText: "OK"
          });
        })
        .catch(errorMessage => {
          alert({
            title: `Result`,
            message: "ML Kit error: " + errorMessage,
            okButtonText: "OK"
          });

          console.log("ML Kit error: " + errorMessage);
        });
    },
    ondetectObjects(imageSource) {
      detectObjects({
        image: imageSource,
        classify: true,
        multiple: true
      })
        .then(function(result) {
          alert({
            title: `Result`,
            message: JSON.stringify(result.objects),
            okButtonText: "OK"
          });
        })
        .catch(errorMessage => {
          alert({
            title: `Result`,
            message: "ML Kit error: " + errorMessage,
            okButtonText: "OK"
          });

          console.log("ML Kit error: " + errorMessage);
        });
    },

    //Face Recognation
    reusePickedImage() {
      if (this.pickedImage) {
        this.ondetectObjects(this.pickedImage);
        this.ondetectFacesOnDevice(this.pickedImage);
      }
    },
    takePicture() {
      camera
        .requestPermissions()
        .then(() => {
          camera
            .takePicture({
              width: 600,
              height: 600,
              keepAspectRatio: true,
              saveToGallery: true,
              cameraFacing: "rear"
            })
            .then(imageAsset => {
              this.img = imageAsset;
              new ImageSource().fromAsset(imageAsset).then(imageSource => {
                this.pickedImage = imageSource;
                // give the user some time to to see the picture
                this.ondetectFacesOnDevice(this.pickedImage);
                this.ondetectObjects(this.pickedImage);
              });

              //this.img = imageAsset;
            })
            .catch(e => {
              console.log("error:", e);
            });
        })
        .catch(e => {
          console.log("Error requesting permission");
        });
    },
    fromCameraRoll() {
      const imagePicker = ImagePicker.create({
        mode: "single"
      });

      imagePicker
        .authorize()
        .then(() => imagePicker.present())
        .then(selection => {
          if (selection.length === 0) return;

          const selected = selection[0];
          selected.options.height = 600;
          selected.options.width = 600;
          selected.options.keepAspectRatio = true;

          selected.getImageAsync((image, error) => {
            if (error) {
              console.log(`Error getting image source from picker: ${error}`);
              return;
            }
            if (!image) {
              alert({
                title: `Invalid image`,
                message: `Perhaps this is an image from cloud storage?`,
                okButtonText: "Hmm.."
              });
              return;
            }
            const imageSource = new ImageSource();
            imageSource.setNativeSource(image);
            this.pickedImage = imageSource;

            this.ondetectObjects(this.pickedImage);
            this.ondetectFacesOnDevice(this.pickedImage);

            // give the user some time to to see the picture
            //setTimeout(() => this.ondetectFacesOnDevice(imageSource), 500);
          });
        })
        .catch(e => {
          console.log(`Image Picker error: ${e}`);
        });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    //Object Recognation

    //Object Recognation
    getLocation() {
      try {
        Geolocation.enableLocationRequest(true).then(() => {
          Geolocation.isEnabled().then(isLocationEnabled => {
            console.log("result is " + isLocationEnabled);
            if (!isLocationEnabled) {
              this.needLocation = false;
              this.locationFailure = true;
              // potentially do more then just end here...
              return;
            }

            // MUST pass empty object!!
            Geolocation.getCurrentLocation({})
              .then(res => {
                var d = new Date();
                this.lat = res.latitude;
                this.lon = res.longitude;
                this.speed = res.speed;
                this.time =
                  d.getDate() +
                  "/" +
                  (d.getMonth() + 1) +
                  "/0" +
                  d.getFullYear() +
                  " " +
                  d.getHours() +
                  ":" +
                  d.getMinutes();
                // get the address (REQUIRES YOUR OWN GOOGLE MAP API KEY!)
                fetch(
                  "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                    res.latitude +
                    "," +
                    res.longitude +
                    "&key=AIzaSyAHdHRPlDZfwVNhWBUYqFSzUvLSnddepsQ"
                )
                  .then(response => response.json())
                  .then(r => {
                    this.addr = r.results[0].formatted_address;
                  });
              })
              .catch(e => {
                console.log("loc error", e);
              });
          });
        });
      } catch (err) {
        alert({
          title: `Result`,
          message: JSON.stringify(err),
          okButtonText: "OK"
        });
      }
    }
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Attendance");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  created() {}
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
</style>
