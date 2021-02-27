<template>
  <div id="app">
    <vue-csv-import
      v-model="csv"
      :headers="['Name', 'Age']"
      :map-fields="{
        vehicle_make: 'Vehicle Make',
        vehicle_model: 'Vehicle Model',
        registration_number: 'Reg No.',
        color: 'Color',
        chassis_number: 'Chassis No.',
        start_date: 'Start Date',
        quarter_number: 'Qtr No.',
      }"
      :can-ignore="false"
      :file-mime-types="['text/csv']"
      auto-match-fields
      auto-match-ignore-case
      table-class="u-full-width"
    >
      <FormulateInput
        v-model="csv"
        type="file"
        name="csv"
        upload-behavior="delayed"
      />
      <br />
      <br />
      <template slot="next" slot-scope="{ load }">
        <div class="d-flex justify-content-end">
          <b-button
            v-if="!csv.length > 0"
            style="border-radius: 0 5px 0 5px"
            @click.prevent="load"
          >
            Load File
          </b-button>
        </div>
      </template>
    </vue-csv-import>
    <!--
    <b-button
      v-if="!csv.length > 0"
      type="is-success"
      @click.prevent="uploadFile"
    >
      Upload
    </b-button> -->

    <h5>Fleet details displayed below</h5>
    <b-table
      class="u-full-width padding responsive"
      style="
        background-color: beige;
        border-radius: 5px;
        outline: none;
        color: black;
        border: 1px solid black;
      "
    >
      <thead>
        <tr>
          <th class="padding-right">Vehicle Make</th>
          <th class="padding-right">Vehicle Model</th>
          <!-- <th class="padding-right">Year Of Make</th>-->
          <th class="padding-right">Reg No.</th>
          <th class="padding-right">Color</th>
          <th class="padding-right">Chassis No.</th>
          <th class="padding-right">Start Date.</th>
          <th class="padding-right">Qtr No.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(person, index) in csv" :key="index">
          <td class="padding-right padding-top">{{ person.vehicle_make }}</td>
          <td class="padding-right padding-top">{{ person.vehicle_model }}</td>
          <!-- <td class="padding-right">{{ person.year_of_make }}</td>-->
          <td class="padding-right padding-top">
            {{ person.registration_number }}
          </td>
          <td class="padding-right padding-top">{{ person.color }}</td>
          <td class="padding-right padding-top">{{ person.chassis_number }}</td>
          <td class="padding-right padding-top">{{ person.start_date }}</td>
          <td class="padding-right padding-top">{{ person.quarter_number }}</td>
        </tr>
      </tbody>
    </b-table>
    <br />
    <b-button type="submit is-primary">Submit CSV</b-button>

    <!-- <pre><code>{{ csv }}</code></pre> -->
  </div>
</template>

<script>
import { VueCsvImport } from 'vue-csv-import'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
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
    async uploadFile() {
      if (this.document) {
        try {
          // eslint-disable-next-line no-unused-vars
          const path = await this.document.upload()
        } catch (err) {
          alert('Error uploading')
          // eslint-disable-next-line no-console
          console.error(err)
        }
      }
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
