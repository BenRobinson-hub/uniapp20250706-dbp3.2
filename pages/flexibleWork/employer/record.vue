<!-- pages/flexibleWork/employer/record.vue -->
<template>
  <view>
    <view class="px-20">
      <view class="w-full bg--w111-fff rd-24rpx flex-between-center mt-24 p-32" v-for="(item, index) in list" :key="index">
        <view>
          <view class="flex-y-center">
            <text class="fs-30 lh-42rpx max-300 line1">{{ item.companyName }}</text>
            <text class="tag tag0 fs-22 ml-16" :class="'tag' + item.status">
              {{ item.status | typeFilter }}
            </text>
          </view>
          <view class="fs-24 text--w111-999 mt-20">提交时间：{{ item.add_time }}</view>
          <view class="fs-24 text--w111-999 mt-20" v-if="item.status === 2">
            原因：{{ item.fail_msg }}
          </view>
        </view>
        <text class="btn info-btn fs-24" @click="lookUp(item)" v-if="item.status === 1">查看</text>
        <text class="btn danger-btn fs-24" @click="resubmit(item)" v-else-if="item.status === 2">重新提交</text>
        <text class="btn info-btn fs-24" @click="edit(item)" v-else>编辑</text>
      </view>
      <view class="mt-20" v-if="list.length === 0">
        <emptyPage title="暂无申请记录~" src="/statics/images/noOrder.gif"></emptyPage>
      </view>
    </view>
  </view>
</template>

<script>
import emptyPage from '@/components/emptyPage.vue';
import { getEmployerRecordList } from '@/api/flexibleEmployment.js';
export default {
  components: {
    emptyPage
  },
  data() {
    return {
      list: []
    };
  },
  filters: {
    typeFilter(val) {
      const statusMap = { 0: '待审核', 1: '审核通过', 2: '审核未通过' };
      return statusMap[val] || '未知';
    }
  },
  onLoad() {
    this.getList();
  },
  methods: {
    getList() {
      getEmployerRecordList()
        .then(res => {
          if (res.status === 200) {
            this.list = res.data || [];
            console.log('雇主入驻申请记录：', this.list);
          } else {
            uni.showToast({ title: res.msg || '获取记录失败', icon: 'none' });
          }
        })
        .catch(err => {
          uni.showToast({ title: '网络错误', icon: 'none' });
          console.error(err);
        });
    },
    edit(item) {
      uni.navigateTo({ url: `/pages/flexibleWork/employer/index?id=${item.id}`});
    },
    resubmit(item) {
      uni.navigateTo({ url: '/pages/flexibleWork/employer/state?id=' + item.id + '&type=2' });
    },
    lookUp(item) {
      uni.navigateTo({ url: '/pages/flexibleWork/employer/state?id=' + item.id + '&type=1' });
    }
  }
};
</script>

<style>
.max-300 {
  max-width: 300rpx;
}
.tag {
  height: 38rpx;
  padding: 0 8rpx;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
}
.tag0 {
  color: rgba(0, 122, 255, 1);
  background-color: rgba(0, 122, 255, 0.1);
}
.tag1 {
  color: rgba(0, 180, 42, 1);
  background-color: rgba(0, 180, 42, 0.1);
}
.tag2 {
  color: rgba(245, 63, 63, 1);
  background-color: rgba(245, 63, 63, 0.1);
}
.btn {
  height: 56rpx;
  padding: 0 24rpx;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 30rpx;
}
.info-btn {
  border: 1px solid #ccc;
  color: #333;
}
.danger-btn {
  border: 1px solid #e93323;
  color: #e93323;
}
</style>
