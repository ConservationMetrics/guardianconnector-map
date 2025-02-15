<script setup>
import AlertsChart from "~/components/alerts/AlertsChart.vue";
import AlertsSlider from "~/components/alerts/AlertsSlider.vue";
import DownloadMapData from "~/components/shared/DownloadMapData.vue";

const props = defineProps({
  alertsStatistics: Object,
  calculateHectares: Boolean,
  dateOptions: Array,
  geojsonSelection: Object,
  logoUrl: String,
  showSlider: Boolean,
});
</script>

<template>
  <div>
    <!-- Header and stats -->
    <div class="feature p-4 rounded-lg shadow-lg">
      <div>
        <img
          v-if="props.logoUrl"
          :src="props.logoUrl"
          class="w-auto mx-auto mb-4 max-h-25"
          alt="Logo"
        />
        <h2 class="text-2xl font-semibold mb-2">
          {{ $t("changeDetectionAlerts") }}:
          {{ props.alertsStatistics.territory }}
        </h2>
        <p class="text-l mb-2">
          {{ $t("mostRecentAlertsShownIn") }}
          <span style="color: #ff0000"
            ><strong>{{ $t("red") }}</strong></span
          >.
        </p>
        <div
          class="mb-2"
          v-if="
            props.alertsStatistics.typeOfAlerts &&
            props.alertsStatistics.typeOfAlerts.length
          "
        >
          <span class="font-bold">{{ $t("typeOfAlerts") }}:</span>
          {{ props.alertsStatistics.typeOfAlerts.join(", ") }}
        </div>
        <div
          class="mb-2"
          v-if="
            props.alertsStatistics.dataProviders &&
            props.alertsStatistics.dataProviders.length
          "
        >
          <span class="font-bold">{{ $t("dataProviders") }}:</span>
          {{ props.alertsStatistics.dataProviders.join(", ") }}
        </div>
        <div class="mb-2">
          <span class="font-bold">{{ $t("alertDetectionRange") }}:</span>
          {{ props.alertsStatistics.alertDetectionRange }}
        </div>
        <div class="mb-2">
          <span class="font-bold">{{ $t("recentAlertsDate") }}:</span>
          {{ props.alertsStatistics.recentAlertsDate }}
        </div>
        <div class="mb-2">
          <span class="font-bold">{{ $t("recentAlertsNumber") }}:</span>
          {{ props.alertsStatistics.recentAlertsNumber }}
        </div>
        <div class="mb-2">
          <span class="font-bold">{{ $t("alertsTotal") }}:</span>
          {{ props.alertsStatistics.alertsTotal }}
        </div>
        <div v-if="props.calculateHectares" class="mb-2">
          <span class="font-bold">{{ $t("hectaresTotal") }}:</span>
          {{ props.alertsStatistics.hectaresTotal }}
        </div>
      </div>
    </div>
    <!-- Slider -->
    <div v-if="props.showSlider" class="feature p-4 rounded-lg shadow-lg">
      <AlertsSlider
        :date-options="props.dateOptions"
        @date-range-changed="$emit('date-range-changed', $event)"
      />
      <div v-if="props.geojsonSelection">
        <!-- Download -->
        <DownloadMapData
          :geojson="props.geojsonSelection"
          :type-of-data="'multiple-alerts'"
        />
      </div>
    </div>
    <!-- Chart -->
    <div v-if="props.alertsStatistics" class="feature p-4 rounded-lg shadow-lg">
      <AlertsChart
        :alerts-statistics="props.alertsStatistics"
        :calculate-hectares="props.calculateHectares"
      />
    </div>
  </div>
</template>
