<template>
  <div class="content">
    <p>
      You can download <a href="/fleet.csv">this template</a> for your
      convenience.
    </p>
    <form @submit.prevent="onSubmit">
      <vue-csv-import
        v-model="csv"
        :class="['block']"
        :headers="[
          'Vehicle Make',
          'Vehicle Model',
          'Year Of Make',
          'Registration Number',
          'Engine Number',
          'Chassis Number',
          'Color',
          'Cubic Capacity',
          'Seating Capacity',
          'Body Type',
          'Certificate Number',
          'Vehicle Class',
        ]"
        :map-fields="{
          vehicleMake: 'Vehicle Make',
          vehicleModel: 'Vehicle Model',
          yearOfManufacture: 'Year Of Make',
          regNumber: 'Registration Number',
          engineNumber: 'Engine Number',
          chassisNumber: 'Chassis Number',
          color: 'Color',
          cubicCapacity: 'Cubic Capacity',
          seatingCapacity: 'Seating Capacity',
          bodyType: 'Body Type',
          certificateNumber: 'Certificate Number',
          productType: 'Vehicle Class',
        }"
        :can-ignore="false"
        :file-mime-types="['text/csv']"
        auto-match-fields
        auto-match-ignore-case
      >
        <template slot="next" slot-scope="{ load }">
          <div class="mt-4">
            <b-button v-if="!csv.length > 0" @click.prevent="load">
              Load File
            </b-button>
          </div>
        </template>
      </vue-csv-import>

      <div class="block mt-4">
        <b-button native-type="submit" type="is-primary" label="Add Fleet" />
      </div>
    </form>
  </div>
</template>

<script>
import { VueCsvImport } from 'vue-csv-import'

export default {
  components: {
    VueCsvImport,
  },
  data() {
    return {
      csv: [],
      isImageModalActive: false,
      isCardModalActive: false,
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addFleet', this.csv)
    },
  },
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
.padding {
  padding: 12px;
}

.padding-right {
  padding-right: 50px;
}

.padding-top {
  padding-top: 5px;
}
</style>
