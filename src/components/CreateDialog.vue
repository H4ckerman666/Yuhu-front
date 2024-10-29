<script setup>
import { ref } from "vue";
import API from "../api";
import useNotify from "../composables";

const fields = ["title", "email", "description"];
// notify
const { sendNotify } = useNotify();

// emits
const emits = defineEmits(["itemCreated"]);

const dialog = defineModel("dialog");

const formData = ref({});
const submitForm = () => {
  API.post("", formData.value)
    .then((response) => {
      if (response.status !== 201) sendNotify(response, "negative");
      emits("itemCreated");
      dialog.value = false;
      sendNotify("Task created successfully", "positive");
      formData.value = {};
    })
    .catch((error) => {
      console.log("🚀 ~ submitForm ~ error:", error);
      sendNotify(error.request.responseText, "negative");
    });
};


</script>

<template>
  <q-dialog v-model="dialog" persistent sty>
    <q-card style="width: 30rem">
      <q-form @submit="submitForm" class="q-gutter-md">
        <q-card-section>
          <div class="text-h6">Create Task</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div v-for="field in fields" :key="field">
            <q-input
              v-if="field.type !== 'checkbox'"
              v-model="formData[field]"
              class="q-ma-md"
              type="text"
              :label="field"
              :name="field"
            />
          </div>
          <q-field
            filled
            :hint="`${formData.deadline}`"
            label="Task deadline"
            stack-label
          >
            <template v-slot:control>
              <q-date
                class="q-mt-sm full-width"
                minimal
                v-model="formData.deadline"
                mask="YYYY-MM-DD"
              />
            </template>
          </q-field>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<style scoped></style>
