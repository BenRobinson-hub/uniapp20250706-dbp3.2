<!-- pages/flexibleWork/job/list.vue -->
<template>
  <view class="container">
    <view class="search-box">
      <input class="search-input" type="text" placeholder="搜索职位" v-model="keyword" />
      <button class="search-btn" @click="getJobs">搜索</button>
    </view>
    <view v-if="jobList.length">
      <view class="job-item" v-for="job in jobList" :key="job.id" @click="goDetail(job.id)">
        <text class="job-title">{{ job.title }}</text>
        <text class="job-location">{{ job.location }}</text>
      </view>
    </view>
    <view v-else class="empty">暂无职位信息</view>
  </view>
</template>

<script>
import { getJobList } from '@/api/flexibleEmployment.js';
export default {
  name: 'JobList',
  data() {
    return {
      keyword: '',
      jobList: []
    };
  },
  onLoad() {
    this.getJobs();
  },
  methods: {
    getJobs() {
      const params = this.keyword ? { keyword: this.keyword } : {};
      getJobList(params)
        .then(res => {
          if (res.code === 200) {
            this.jobList = res.data || [];
          } else {
            uni.showToast({ title: res.msg || '获取列表失败', icon: 'none' });
          }
        })
        .catch(err => {
          console.error('获取职位列表失败：', err);
          uni.showToast({ title: '网络错误', icon: 'none' });
        });
    },
    goDetail(jobId) {
      uni.navigateTo({ url: `/pages/flexibleWork/job/detail.vue?jobId=${jobId}` });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
}
.search-box {
  display: flex;
  margin-bottom: 20rpx;
}
.search-input {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid #ccc;
  padding: 0 10rpx;
  font-size: 28rpx;
}
.search-btn {
  width: 120rpx;
  background-color: #0081ff;
  color: #fff;
  border: none;
  border-radius: 5rpx;
  margin-left: 10rpx;
  font-size: 28rpx;
}
.job-item {
  padding: 16rpx;
  border-bottom: 1rpx solid #eee;
}
.job-title {
  font-size: 32rpx;
  font-weight: bold;
}
.job-location {
  font-size: 28rpx;
  color: #666;
  margin-top: 6rpx;
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 50rpx;
}
</style>
