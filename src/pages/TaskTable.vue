<script setup>
import { onBeforeMount, ref } from "vue";
import CreateDialog from "../components/CreateDialog.vue";
import EditDialog from "../components/EditDialog.vue";
import API from "../api";
import useNotify from "../composables";

// notify
const { sendNotify } = useNotify();

const rows = ref([]);
const dialogCreate = ref(false);

const dialogEdit = ref(false);
const editingItem = ref({});

onBeforeMount(async () => {
  await getItems();
});

const getItems = async () => {
  rows.value = await API.get().then(({ data }) => data);
};

const editItem = (item) => {
  console.log(item);
  editingItem.value = item;
  dialogEdit.value = true;
};

const removeItem = (item) => {
  API.delete(`${item.id}/`)
    .then((response) => {
      if (response.status !== 204) sendNotify(response.message, "negative");
      else {
        rows.value = rows.value.filter((i) => item.id !== i.id);
        sendNotify("Task deleted successfully", "positive");
      }
    })
    .catch((error) => {
      console.log("🚀 ~ removeItem ~ error:", error);
      sendNotify(error.message, "negative");
    });
};

const pagination = {
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
};
</script>

<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <q-btn label="Create" color="primary" @click="dialogCreate = true" />
    </div>
    <CreateDialog v-model:dialog="dialogCreate" @itemCreated="getItems" />
    <EditDialog
      v-model:dialog="dialogEdit"
      v-model:editingItem="editingItem"
      @itemModified="getItems"
    />
    <q-table title="Tasks" :rows="rows" :pagination="pagination" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="blue"
              round
              dense
              @click="editItem(props.row)"
              icon="edit"
            />
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="red"
              round
              dense
              @click="removeItem(props.row)"
              icon="delete"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<style scoped></style>
