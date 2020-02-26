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

    <GridLayout class="page__content">
      <StackLayout>
        <Label class="page__content-icon fas" text.decode="&#xf041;"></Label>
        <Label class="page__content-footer" :text="message"></Label>

        <Button text="Get My Location" @tap="getLocation" class="btn btn-primary" />
        <Label :text="'Time: ' + time" class="page__content-footer" />
        <Label :text="'Latitude: ' + lat" class="page__content-footer" />
        <Label :text="'Longitude: ' + lon" class="page__content-footer" />
        <Label :text="'Speed: ' + speed" class="page__content-footer" />
        <Label :text="'Address: ' + addr" textWrap="true" class="page__content-footer" />
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";

const geolocation = require("nativescript-geolocation");
const { Accuracy } = require("tns-core-modules/ui/enums");

export default {
  data() {
    return {
      lat: "",
      lon: "",
      speed: "",
      addr: "",
      time: "",
      message: "Attendance Record"
    };
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    getLocation() {
      geolocation
        .getCurrentLocation({
          desiredAccuracy: Accuracy.high,
          maximumAge: 5000,
          timeout: 20000
        })
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
        });
    }
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Attendance");

    geolocation.enableLocationRequest();
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
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