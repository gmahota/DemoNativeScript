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
      <Label class="action-bar-title" text="DemoFireBase"></Label>
    </ActionBar>

    <GridLayout class="page__content">
      <Label class="page__content-icon fas" text.decode="&#xf005;"></Label>
      <Label class="page__content-placeholder" :text="message"></Label>
      <Label class="message" :text="message" textWrap="true" horizontalAlignment="center"></Label>
    </GridLayout>
  </Page>
</template>

<script>
import { inappmessaging } from "nativescript-plugin-firebase/inappmessaging";

import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";

export default {
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("DemoFireBase");
  },
  data() {
    return {
      message: "Fear not, young Skywalker"
    };
  },

  created() {
    // wire up an 'onMessageClicked' callback
    inappmessaging.onMessageClicked(message => {
      this.message = `Campaign ${message.campaignName} clicked`;
    });

    // 👉 .. and for fun, wire an 'onMessageImpression' callback so when know when the message is shown
    inappmessaging.onMessageImpression(message => {
      this.message = `Campaign ${message.campaignName} seen`;
    });
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
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