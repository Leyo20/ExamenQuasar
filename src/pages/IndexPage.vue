<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md">
      <q-btn color="amber" glossy label="Agregar Materia" @click="openCreateDialog" />

      <q-table
        title="Materias"
        :rows="listmateria"
        :columns="columns"
        row-key="asignatura"
      >
        <template #body-cell-action="props">
          <q-td top-center class="q-gutter-md">
            <q-btn dense color="secondary" label="Actualizar" icon="edit" @click="editmateria(props.row)" />
            <q-btn dense color="negative" label="Eliminar" icon="delete" @click="onDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isCreate">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Registrar Materia</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form class="q-gutter-md">
            <q-input
              class="col-12"
              outlined
              v-model="Formasig.asignatura"
              label="Nombre *"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Ingresar dato']"
            />
            <q-input
              class="col-12"
              outlined
              v-model="Formasig.nota"
              label="Nota *"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Ingresar dato']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Cancelar" @click="onReset" color="negative" v-close-popup />
          <q-btn label="Guardar" @click="onSubmit" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isEdit">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Actualizar Materia</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form class="q-gutter-md">
            <q-input
              class="col-12"
              outlined
              v-model="Formasig.asignatura"
              label="Nombre *"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Ingresar dato']"
            />
            <q-input
              class="col-12"
              outlined
              v-model="Formasig.nota"
              label="Nota *"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Ingresar dato']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Cancelar" @click="onReset" color="negative" v-close-popup />
          <q-btn label="Actualizar" @click="onUpdate" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Createmateria, deletemateria, getlist, Updatemateria } from 'src/servicios/materias.servicio';
import { type QTableProps, useQuasar } from 'quasar';
import type { materiasinterface } from 'src/interfaces/materias.interface';

const isEdit = ref<boolean>(false);
const isCreate = ref<boolean>(false);
const listmateria = ref<materiasinterface[]>([]);
const $q = useQuasar();

const columns: QTableProps['columns'] = [
  {
    name: 'asignatura',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row: materiasinterface) => row.asignatura,
    sortable: true
  },
  {
    name: 'nota',
    required: true,
    label: 'Nota',
    align: 'left',
    field: (row: materiasinterface) => row.nota,
    sortable: true
  },
  {
    name: 'action',
    label: 'Acciones',
    align: 'left',
    field: ''
  }
];

const Formasig = ref({
  id: <number | null>null,
  asignatura: <string | null>null,
  nota: <number | null>null
});

onMounted(() => {
  fetchMateria();
});

function openCreateDialog(): void {
  isCreate.value = true;
}

function fetchMateria(): void {
  $q.loading.show({ message: 'Cargando datos...' });
  getlist()
    .then((response) => {
      listmateria.value = response.data;
    })
    .catch((err) => console.error(err))
    .finally(() => $q.loading.hide());
}

function onSubmit(): void {
  $q.loading.show({ message: 'Guardando información' });
  Createmateria(Formasig.value as materiasinterface)
    .then((response) => {
      $q.notify({ message: response.data.message, icon: 'info', color: 'positive', position: 'top' });
      fetchMateria();
      isCreate.value = false;
      onReset();
    })
    .catch((err) => {
      $q.notify({
         message: err.message,
         icon: 'info',
         color: 'negative',
         position: 'top' });
    })
    .finally(() =>
    $q.loading.hide());
}

function editmateria(data: materiasinterface): void {
  isEdit.value = true;
  Formasig.value = {
    id: data.id as number,
    asignatura: data.asignatura,
    nota: data.nota
  };
}

function onReset(): void {
  Formasig.value = {
    id: null,
    asignatura: null,
    nota: null
  };
}

function onUpdate(): void {
  $q.loading.show({ message: 'Actualizando información' });
  Updatemateria(Formasig.value as materiasinterface)
    .then((response) => {
      $q.notify({ message: response.data.message, icon: 'info', color: 'positive', position: 'top' });
      fetchMateria();
      isEdit.value = false;
      onReset();
    })
    .catch((err) => {
      $q.notify({
        message: err,
        icon: 'info',
        color: 'negative',
        position: 'top' });
    })
    .finally(() =>
    $q.loading.hide());
}

function onDelete(data: materiasinterface): void {
  $q.loading.show({ message: 'Eliminando información' });
  deletemateria(data.id as number)
    .then((response) => {
      $q.notify({
        message: response.data.message,
        icon: 'thumb_up_off_alt',
        color: 'positive',
        position: 'top' });
      fetchMateria();
      onReset();
    })
    .catch((err) => {
      $q.notify({
        message: err,
        icon: 'info',
        color: 'negative',
        position: 'top' });
    })
    .finally(() =>
    $q.loading.hide());
}
</script>
