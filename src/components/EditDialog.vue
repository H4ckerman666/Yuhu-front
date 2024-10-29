<script setup>
import { onBeforeMount } from "vue";
import API from "../api";
import useNotify from "../composables";

const props = defineProps({
  config: Object,
});

// notify
const { sendNotify } = useNotify();

// emits
const emits = defineEmits(["itemModified"]);

const dialog = defineModel("dialog");
const editItem = defineModel("editingItem");

const submitForm = () => {
  API.put(`${editItem.value.id}/`, editItem.value)
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
      if (response.status !== 200)
        sendNotify(response.data.message, "negative");
      sendNotify("Task edited successfully", "positive");
      emits("itemModified");
      dialog.value = false;
    })
    .catch((error) => {
      console.log("🚀 ~ submitForm ~ error:", error);
      sendNotify(error.response.data.message, "negative");
    });
};

const formatISOStringToDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Mes es 0-indexado
  const day = String(date.getUTCDate()).padStart(2, "0");
  console.log("retuning")
  return `${year}/${month}/${day}`;
};

onBeforeMount(() => {
  editItem.value.deadline = formatISOStringToDate(editItem.value.deadline);
})
</script>

<template>
  <q-dialog v-model="dialog" persistent sty>
    <q-card style="width: 30rem">
      <q-form @submit="submitForm" class="q-gutter-md">
        <q-card-section>
          <div class="text-h6">Edit task</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div v-for="(_, field) in editItem" :key="field.name">
            <q-input
              v-if="!['id', 'created_at', 'email', 'deadline'].includes(field)"
              v-model="editItem[field]"
              class="q-ma-md"
              type="text"
              :label="field"
              :name="field"
            />
          </div>
          <q-field
            filled
            :hint="`${editItem.deadline}`"
            label="Task deadline"
            stack-label
          >
            <template v-slot:control>
              <q-date
                class="q-mt-sm full-width"
                minimal
                v-model="editItem.deadline"
                mask="YYYY-MM-DD"
              />
            </template>
          </q-field>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save changes" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<style scoped></style>
