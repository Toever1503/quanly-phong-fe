<template>

  <div class="p-10">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="Danh sach phong"
    >
      <template #tags>
        <a-button key="1" type="primary" @click="openModal('add')">Add new</a-button>
      </template>
    </a-page-header>

    <a-modal ok-text="Save"
             v-if="formVisible"
             cancel-text="Cancel"
             v-model:visible="formVisible"
             title="Form"
             @ok="okModal"
             @cancel="cancelModal"
             :confirmLoading="formLoading"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="Room Name"
          name="roomName"
          :rules="[{ required: true, message: 'Please input room name!' }]"
        >
          <a-input v-model:value="formState.roomName" />
        </a-form-item>

        <a-form-item
          label="Description"
          name="roomDescription"
          :rules="[{ required: true, message: 'Please input description!' }]"
        >
          <a-input v-model:value="formState.roomDescription" />
        </a-form-item>

        <a-form-item
          label="Price"
          name="roomPrice"
          :rules="[{ required: true, message: 'Please input room price!' }]"
        >
          <a-input type="number" v-model:value="formState.roomPrice" />
        </a-form-item>

        <a-form-item
          label="Image"
          name="roomImage"
        >
          <img v-show="formState.image || formState.data"
               :src="formState.roomImage ? formState.roomImage :  formState.data" style="height: 90px; width: 63px">
          <a-input @change="onClickFile" ref="inputField" type="file" />
        </a-form-item>

      </a-form>

    </a-modal>


    <a-table @change="onTblChange" :columns="columns" :data-source="data" :pagination="pageConfig">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'roomImage'">
          <img :src="record.roomImage" class="h-[90px] w-[64px]">
        </template>
        <template v-else-if="column.key === 'action'">
        <span>
          <a class="mr-2" @click="showEditRoomForm(record)">Edit</a>
        </span>
        </template>
      </template>
    </a-table>

  </div>


</template>

<script setup>
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { RoomService } from "../../services/RoomService";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = error => reject(error);
  });
}

const formVisible = ref(false);
const formLoading = ref(false);
const formState = ref({
  id: null,
  formType: "add",
  roomName: "",
  roomDescription: "",
  image: null,
  data: "",
  roomImage: null
});
const inputField = ref();
const columns = ref([
  {
    name: "Image",
    dataIndex: "roomImage",
    key: "roomImage"
  },
  {
    name: "Room Namess",
    dataIndex: "roomName",
    key: "roomName11"
  },
  {
    title: "Description",
    dataIndex: "roomDescription",
    key: "description"
  }, {
    title: "Price",
    dataIndex: "roomPrice",
    key: "price"
  }, {
    title: "Status",
    key: "status",
    dataIndex: "roomStatus"
  }, {
    title: "Action",
    key: "action"
  }]);
const pageConfig = ref({
  current: 1,
  pageSize: 15,
  total: 1000,
  showSizeChanger: false,
  size: "small"
});
const data = ref([]);

const formRef = ref();
const okModal = () => {
  formLoading.value = true;
  console.log(formRef);
  formRef.value.validateFields().then(() => {

    if (formState.value.formType === "add" && formState.value.image === null) {
      message.error("Please upload image!");
      formLoading.value = false;
      return;
    }

    const formData = new FormData();
    formData.append("roomName", formState.value.roomName);
    formData.append("roomDescription", formState.value.roomDescription);
    formData.append("roomPrice", formState.value.roomPrice);
    if (formState.value.image)
      formData.append("roomImage", formState.value.image);

    if (formState.value.formType === "add") {
      RoomService.addRoom(formData).then(res => {
        message.success("Add room success!");
        console.log("add room: ", res);
        formLoading.value = false;
        // formVisible.value = false;
        formRef.value.resetFields();
        formState.value.formType = "add";
        cancelModal();
      }).catch(err => {
        message.error("Add room failed!");
        console.log("err", err);
        formLoading.value = false;
      });
    } else { // for update
      console.log("update room: ", formState.value);
      RoomService.updateRoom(formState.value.id, formData).then(res => {
        message.success("Update room success!");
        console.log("Update room: ", res);
        formLoading.value = false;
        // formVisible.value = false;
        formRef.value.resetFields();
        formState.value.formType = "add";
        cancelModal();
        getRooms();
      }).catch(err => {
        message.error("Update room failed!");
        console.log("err", err);
        formLoading.value = false;
      });
    }

  })
    .catch((err) => {
      console.log("error!", err);
      message.error("Please input all required fields.");
      formLoading.value = false;
    });
};
const cancelModal = () => {
  formVisible.value = false;
};

const openModal = (type) => {
  formState.value.formType = type;
  formVisible.value = true;
};

const onClickFile = async (file) => {
  console.log("click file: ", file.target.files);
  formState.value.data = await getBase64(file.target.files[0]);
  formState.value.image = file.target.files[0];
};

const onTblChange = (pagination, filters, sorter) => {
  pageConfig.value = pagination;
  console.log("params", pagination, filters, sorter);
};

const getRooms = () => {
  RoomService.getAllRoom().then(res => {
    console.log("get all room: ", res.data.content);
    data.value = res.data.content;
    pageConfig.value.total = res.data.totalElements;
  }).catch(err => {
    console.log("err", err);
  });
};

const showEditRoomForm = (record) => {
  console.log("show edit room form: ", record);
  formState.value = {
    id: record.id,
    formType: "edit",
    roomName: record.roomName,
    roomDescription: record.roomDescription,
    roomPrice: record.roomPrice,
    roomImage: record.roomImage,
    data: record.roomImage
  };
  formVisible.value = true;
};

onMounted(() => {
  console.log(`the component is now mounted.`);
  getRooms();
});


</script>