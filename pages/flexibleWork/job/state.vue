<!-- pages/flexibleWork/job/state.vue -->
<template>
  <view>
    <view class="status-container">
      <view class="header">
        <text class="header-title">职位审核状态</text>
      </view>
      <view class="status-content">
        <image :src="statusIcon" class="status-icon" />
        <text class="status-text">{{ status | statusFilter }}</text>
        <text class="desc-text">{{ status | descFilter }}</text>
      </view>
      <view class="actions">
        <button class="btn" @click="goBack">返回</button>
        <button class="btn" v-if="status !== 1" @click="editDetail">编辑</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getJobDetail } from '@/api/flexibleEmployment.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';
export default {
  name: 'JobState',
  data() {
    return {
      jobId: null,
      status: 0, // 0：未审核，1：审核通过，2：审核未通过
      statusIcon: '',
      add_time: ''
    };
  },
  filters: {
    statusFilter(val) {
      const map = { 0: '未审核', 1: '审核通过', 2: '审核未通过' };
      return map[val] || '未知';
    },
    descFilter(val) {
      const map = { 0: '等待审核中，请耐心等待', 1: '审核通过', 2: '审核未通过，请修改后重新提交' };
      return map[val] || '';
    }
  },
  onLoad(options) {
    this.jobId = options.jobId;
    this.getJobStatus();
  },
  methods: {
    getJobStatus() {
      getJobDetail(this.jobId)
        .then(res => {
          if (res.status === 200) {
            const data = res.data;
            this.status = data.status;
            this.add_time = data.add_time;
            if (this.status === 0) {
              this.statusIcon = HTTP_REQUEST_URL + '/statics/images/supplier/verify_ing_icon.png';
            } else if (this.status === 1) {
              this.statusIcon = HTTP_REQUEST_URL + '/statics/images/supplier/verify_ok_icon.png';
            } else if (this.status === 2) {
              this.statusIcon = HTTP_REQUEST_URL + '/statics/images/supplier/verify_fail_icon.png';
            }
          } else {
            uni.showToast({ title: res.msg || '获取状态失败', icon: 'none' });
          }
        })
        .catch(err => {
          console.error(err);
          uni.showToast({ title: '网络错误', icon: 'none' });
        });
    },
    goBack() {
      uni.navigateBack();
    },
    editDetail() {
      uni.navigateTo({ url: `/pages/flexibleWork/job/detailView?jobId=${this.jobId}&mode=edit` });
    }
  }
};
</script>

<style scoped>
.status-container {
  padding: 20rpx;
  background-color: #fff;
  min-height: 100vh;
  text-align: center;
}
.header {
  padding: 20rpx 0;
}
.header-title {
  font-size: 34rpx;
  font-weight: bold;
}
.status-content {
  margin-top: 50rpx;
}
.status-icon {
  width: 150rpx;
  height: 150rpx;
}
.status-text {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;
}
.desc-text {
  font-size: 28rpx;
  color: #666;
  margin-top: 10rpx;
}
.actions {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
  gap: 20rpx;
}
.btn {
  background-color: #0081ff;
  color: #fff;
  border: none;
  border-radius: 5rpx;
  padding: 10rpx 20rpx;
  font-size: 28rpx;
}
</style>
