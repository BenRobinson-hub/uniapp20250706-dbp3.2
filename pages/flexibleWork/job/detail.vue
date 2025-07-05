<template>
  <view class="container">	
    <!-- 顶部：左侧职位名称+日薪，右侧头像+昵称 -->
    <view class="top-row">
      <view class="left-col">
        <text class="job-title">{{ jobDetail.title  }}</text>
        <text class="job-salary">{{ jobDetail.salary }} 元/天</text>
      </view>
      <view class="right-col">
        <image class="avatar" :src="jobDetail.avatar || '/static/images/f.png'" mode="aspectFill"></image>		
        <text class="nickname">{{ jobDetail.nickname }}</text>
      </view>
    </view>

    <!-- 中间三列：需人数、已选人数、每人收益 -->
    <view class="middle-row">
      <view class="column">
        <text class="value">{{ jobDetail.peopleNum  }}</text>
        <text class="label">需人数</text>
      </view>
      <view class="column">
        <text class="value">{{ jobDetail.selectedNum }}</text>
        <text class="label">已选人数</text>
      </view>
      <view class="column">
        <text class="value">{{ jobDetail.income  }}</text>
        <text class="label">每人收益</text>
      </view>
    </view>

    <!-- 详情信息卡片 -->
    <view class="detail-card">
      <view class="detail-title">职位详情</view>
      <view class="detail-item">
        <text class="label">开始时间：</text>
        <text class="text">{{ jobDetail.startTime  }}</text>
      </view>
      <view class="detail-item">
        <text class="label">结束时间：</text>
        <text class="text">{{ jobDetail.endTime  }}</text>
      </view>
      <view class="detail-item">
        <text class="label">工作地点：</text>
        <text class="text">{{ jobDetail.location }}</text>
      </view>
      <view class="detail-item">
        <text class="label">工作天数：</text>
        <text class="text">{{ jobDetail.days }}</text>
      </view>
      <view class="detail-item">
        <text class="label">其他要求：</text>
        <text class="text">{{ jobDetail.otherReq  }}</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-bar">
	<button class="bar-btn share-btn" hover-class="none" open-type="share">分享职位</button>
    <!--  <button class="bar-btn share-btn" @click="shareJob">分享职位</button> -->
      <button v-if="!jobDetail.registered" class="bar-btn apply-btn" @click="applyForJob">立即报名</button>	  
	  <button v-else class="gray bar-btn  ">已报名</button>
    </view>
  </view>
</template>

<script>
import { getJobDetail, applyJob } from '@/api/flexibleEmployment.js';
import { HTTP_REQUEST_URL } from '@/config/app';
export default {
  name: 'JobDetail',
  data() {
    return {	
      jobId: null,
      jobDetail: {},
      defaultAvatar:`url(${HTTP_REQUEST_URL}/statics/images/users/template4_bg.png)`
    };
  },
  onLoad(options) {
    if (options.jobId) {
      this.jobId = options.jobId;
      this.loadJobDetail();
    }
  },
  methods: {
    loadJobDetail() {
      getJobDetail(this.jobId)
        .then(res => {
          // 与原生风格保持一致，判断 status === 200
          if (res.status === 200) {
            this.jobDetail = res.data || {};
			console.log(this.jobDetail)
          } else {
            uni.showToast({ title: res.msg || '获取详情失败', icon: 'none' });
          }
        })
        .catch(err => {
          console.error('获取职位详情失败：', err);
          uni.showToast({ title: '网络错误', icon: 'none' });
        });
    },
    applyForJob() {		
      applyJob({ jobId: this.jobId })
        .then(res => {			
          if (res.status == 200) {			
			this.$set(this.jobDetail, 'registered', 1);
            uni.showToast({ title: '报名成功1', icon: 'none' });
          } else {
            uni.showToast({ title: res.msg || '报名失败', icon: 'none' });
          }
        })
        .catch(err => {
          console.error('报名失败：', err);
          uni.showToast({ title: '网络错误', icon: 'none' });
        });
    },
    shareJob() {
      uni.showToast({ title: '分享职位', icon: 'none' });
      // 可在此添加更多分享逻辑
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  min-height: 100vh;
  padding: 20rpx;
}

/* 顶部布局 */
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
 padding:10rpx;
}
.left-col {
  display: flex;
  flex-direction: column;
}
.job-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  line-height:2;
  margin-bottom: 6rpx;
}
.job-salary {
  font-size: 30rpx;
  color: #ff4d4f;
}
.right-col {
 /* display: flex; */
  align-items: center;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 10rpx;  
  display:block
}
.nickname {
  font-size: 26rpx;
  line-height:1.5;
  color: #666;
  text-align:center;
   display:block
}
.gray {background-color:#777777;}
/* 中间三列 */
.middle-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  padding: 12rpx 0;
  margin-bottom: 20rpx;
}
.column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.value {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.label {
  font-size: 24rpx;
  color: #999;
}

/* 详情卡片 */
.detail-card {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 5rpx rgba(0,0,0,0.05);
  margin-bottom: 30rpx;
}
.detail-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}
.detail-item {
  display: flex;
  margin-bottom: 10rpx;
}
.detail-item .label {
  width: 160rpx;
  color: #666;
  font-size: 30rpx;
  line-height:3;
}
.detail-item .text {
  flex: 1;
  font-size: 30rpx;
  color: #333; 
  line-height:3;
}

/* 底部操作栏 */
.bottom-bar {
  display: flex;
  justify-content: space-between;
 bottom:0rpx;
 position:absolute;
 left:0;right:0;
 padding-bottom:34px;
}
.bar-btn {
  flex: 1;
  height: 70rpx;
  font-size: 30rpx;
  border-radius: 6rpx;
  margin: 0 10rpx;
  border: none;
  color: #fff;
  text-align: center;
  line-height: 70rpx;
}
.share-btn {
  background-color: #ffa940; /* 可与原生风格保持一致 */
}
.apply-btn {
  background-color: #e93323; /* CRMEB常用红色 */
}
</style>
