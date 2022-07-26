<script setup>
import { onMounted, ref } from "vue";
import { RoomService } from "../../services/RoomService";
import { message } from "ant-design-vue";
const hasMouted = ref(false);
const isAdmin = ref(false);
const data = ref([]);
const pageConfig = ref({
  current: 1,
  pageSize: 15,
  total: 1000
});

const getRooms = () => {
  RoomService.getAllRoom().then(res => {
    console.log("get all room: ", res.data.content);
    data.value = res.data.content;
    pageConfig.value.total = res.data.totalElements;
  }).catch(err => {
    console.log("err", err);
  });
};

onMounted(() => {
  hasMouted.value = true;
  isAdmin.value = localStorage.getItem("roles").indexOf("ROLE_ADMIN") !== -1;
  getRooms();

});

const rentRoom = (item) => {
  if(item.roomStatus === "RENTED") {
    message.error("This room is already rented!");
    return;
  }
  else if(item.roomStatus === "AVAILABLE") {
    RoomService.rentRoom(item.id).then(res => {
      message.success("Rent room success!");
      console.log("rent room: ", res);
      getRooms();
    }).catch(err => {
      message.error("Rent room failed!");
      console.log("err", err);
    });
  }
}

</script>

<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="List room"
    >
      <template #tags>
        <a-button v-if="hasMouted && isAdmin" key="1" type="link" href="/admin">
          Manage room
        </a-button>
      </template>
    </a-page-header>

    <div class=" p-10">
      <a-card hoverable style="width: 250px" :key="item.id" v-for="item in data">
        <template #cover>
          <img
            alt="example"
            :src="item.roomImage"
          />
        </template>
        <template #actions>
          <a-button type="primary" ghost v-if="item.hasRented" :disabled="true">Rented</a-button>
          <a-button type="primary" ghost v-else  @click="rentRoom(item)">Rent</a-button>

        </template>
        <a-card-meta :title="item.roomName">
          <template #description>
            Description: {{item.roomDescription}} <br>
            Price: {{item.roomPrice}} <br>
            Status: {{item.roomStatus}}
          </template>
        </a-card-meta>
      </a-card>
    </div>

    <div class="grid justify-center">
      <a-pagination class="max-w-[300px] m-auto" v-model="pageConfig" size="small" show-less-items />
    </div>
  </div>
</template>
