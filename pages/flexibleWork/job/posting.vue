<template>
  <view>
    <!-- 顶部导航：左返回 + 右“发布记录” -->
    <view class="w-full fixed-lt z-20" :style="{ paddingTop: sysHeight + 'px' }">
      <view class="h-80 px-20 flex-between-center">
        <!-- 左侧返回按钮 -->
        <text
          class="iconfont icon-ic_leftarrow fs-40 text--w111-fff"
          @click="pageBack"
        ></text>
       
      </view>
    </view>

    <!-- 可选：顶部背景图，与供应商入驻类似 -->
    <view class="header-top relative" :style="[headerBg]">
		
	
	  <view class="rule-btn w-124 flex-center fs-24 text--w111-fff" :style="{ top: (100 + sysHeight) + 'px' }" @click="goRecord">
	    发布记录
	  </view>

		
	</view>

    <!-- 主体内容 -->
    <view class="bg-v-gradient pl-20 pr-20 pb-24" :style="{ minHeight: mainHeight + 'px' }">
      <view class="bg--w111-fff rd-24rpx content-box">
        <!-- 标题 -->
        <view class="fs-30 fw-500 lh-42rpx">发布职位</view>

        <!-- 职位名称 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">职位名称</view>
          <input
            type="text"
            v-model="form.title"
            placeholder="请输入职位名称"
            placeholder-class="text--w111-ccc"
            class="fs-28 text-right"
          />
        </view>
		<view class="cell flex-between-center mt-64" >
			<view class="fs-28 lh-40rpx">开始时间</view>
			<view class="acea-row row-right dater">
			<picker mode="date" :value="item.value" @change="bindstartDateChange($event)">
				<view class="acea-row row-right dater">	
				<view v-if="form.startdate == ''">请选择 </view>
					<view  class="fs-28 text-right">{{form.startdate}}</view>
				</view>
			</picker>
			<text class='iconfont icon-xiangyou'></text>
			</view>
		</view>
		<view class="cell flex-between-center mt-64" >
			<view class="fs-28 lh-40rpx">结束时间</view>
			<view class="acea-row row-right dater">
			<picker mode="date" :value="item.value" @change="bindendDateChange($event)">
				<view class="acea-row row-right dater">	
					<view v-if="form.enddate == ''">请选择 </view>
					<view  class="fs-28 text-right">{{form.enddate}}</view>
				</view>
			</picker>
			<text class='iconfont icon-xiangyou'></text>
			</view>
		</view>

        <!-- 日薪 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">日薪（元/天）</view>
          <input
            type="number"
            v-model="form.salary"
            placeholder="请输入日薪"
            placeholder-class="text--w111-ccc"
            class="fs-28 text-right"
          />
        </view>

        <!-- 工作地点 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">工作地点</view>
          <input
            type="text"
            v-model="form.location"
            placeholder="请输入工作地点"
            placeholder-class="text--w111-ccc"
            class="fs-28 text-right"
          />
        </view>

       <!-- 修改性别要求部分的代码 -->
       <view class="cell flex-between-center mt-64">
         <view class="fs-28 lh-40rpx">性别要求</view>
         <radio-group class="text-right flex align-center" v-model="form.gender">
           <!-- 添加 color 和 style 属性 -->
           <radio 
             value="0" 
             color="#FDC383" 
             class="mr-20" 
             style="transform: scale(1.2); display: inline-block !important;"
           >不限</radio>
           <radio 
             value="1" 
             color="#FDC383" 
             class="mr-20" 
             style="transform: scale(1.2); display: inline-block !important;"
           >男</radio>
           <radio 
             value="2" 
             color="#FDC383" 
             style="transform: scale(1.2); display: inline-block !important;"
           >女</radio>
         </radio-group>
       </view>


        <!-- 职位描述（去除额外底色，仅白色背景） -->
        <view class="fs-28 lh-40rpx mt-64">职位描述</view>
        <view class="fs-24 lh-34rpx text--w111-999 mt-12">
          (请简要说明职位要求、工作内容等)
        </view>
        <textarea
          class="desc-textarea mt-12"
          placeholder="请输入职位描述"
          placeholder-class="text--w111-ccc"
          v-model="form.description"
        ></textarea>

        <!-- 提交按钮 -->
        <view
          class="w-full h-88 rd-44rpx flex-center text--w111-fff fs-28 mt-48 bg-red"
          @click="submitJob"
        >
          发布职位
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { createJob } from "@/api/flexibleEmployment.js";
import { HTTP_REQUEST_URL } from "@/config/app.js";
import { getJobDetail, updateJob } from "@/api/flexibleEmployment.js";

export default {
  data() {
    return {
		jobId:0,
      sysHeight: uni.getSystemInfoSync().statusBarHeight,
      form: {
        title: "",
		startdate:"",
		enddate:"",
        salary: "",
        location: "",
        gender: "0", // 0=不限,1=男,2=女
		id: 0,
        description: ""
      }
    };
  },
  computed: {
    ...mapGetters(["isLogin"]),
    mainHeight() {
      const { windowHeight } = uni.getSystemInfoSync();
      return windowHeight - 90 - this.sysHeight;
    },
    headerBg() {
      // 如需与供应商入驻相同顶部背景图，可使用：
      return {
        backgroundImage: `url(${HTTP_REQUEST_URL}/statics/images/supplier/apply_header.png)`
      };
    }
  },
  onLoad(options) {
    // 获取 jobId 并加载职位信息
	
    if (options.jobId) {
      this.jobId = options.jobId;
	  this.form.id = options.jobId;
      this.loadJobDetail();
    }
  },
  methods: {
	  loadJobDetail() {
	    getJobDetail(this.jobId)
	      .then(res => {
	        if (res.status == 200) {
	          // 将后端返回的职位信息赋值给表单
	          this.form.title = res.data.title || "";
	          this.form.salary = res.data.salary || "";
	          this.form.location = res.data.location || "";
	          this.form.gender = res.data.gender || "0";
	          this.form.description = res.data.description || "";
	        } else {
	          uni.showToast({ title: res.msg || "获取详情失败", icon: "none" });
	        }
	      })
	      .catch(err => {
	        uni.showToast({ title: "网络错误", icon: "none" });
	        console.error("加载职位信息失败：", err);
	      });
	  },
	  
	  radioChange(e){
	  	this.form.gender = e.detail.value
	  },
	  bindstartDateChange: function(e) {
	  	this.form.startdate = e.target.value
	  },
	  bindendDateChange: function(e) {
	  	this.form.enddate = e.target.value
	  },
    pageBack() {
      uni.navigateBack();
    },
    goRecord() {
      // 跳转到职位发布申请记录页面
      uni.navigateTo({
        url: "/pages/flexibleWork/job/record"
      });
    },
    submitJob() {
      // 简易校验
      if (!this.form.title || !this.form.salary || !this.form.description) {
        return this.$util.Tips({ title: "请填写完整的职位信息" });
      }
      createJob(this.form)
        .then((res) => {
          // 与供应商入驻逻辑一致：判断 res.status === 200 表示成功
          if (res.status == 200) {
            this.$util.Tips({ title: "职位发布成功" });
            // 不自动跳转，用户可点击右上角“发布记录”查看
			uni.navigateTo({
			  url: "/pages/flexibleWork/job/record"
			});
          } else {
            return this.$util.Tips({
              title: res.msg || "发布失败"
            });
          }
        })
        .catch((err) => {
          return this.$util.Tips({ title: err });
        });
    }
  }
};
</script>

<style scoped>
/* 顶部背景与供应商入驻一致 */
.header-top {
  width: 100%;
  height: 358rpx;
  background-size: cover;
}
.bg-v-gradient {
  background: linear-gradient(180deg, #fe7015 0%, #eb3b26 100%);
}
.content-box {
  padding: 48rpx 32rpx 40rpx;
  margin-top: 20rpx;
  border-radius: 24rpx;
  background-color: #fff;
}
.bg-red {
  background-color: #e93323;
}
.desc-textarea {
  width: 100%;
  min-height: 160rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff; /* 与外层同色 */
  border: 1px solid #ccc;
  border-radius: 8rpx;
  padding: 10rpx;
  box-sizing: border-box;
}
.rule-btn {
  height: 48rpx;
  background: rgba(0,0,0,0.15);
  border-radius: 24rpx 0 0 24rpx;
  position: absolute;
  right: 0;
}
/* 在全局或页面样式中添加穿透规则 */
/* 微信小程序专用 */
/deep/ .wx-radio-input.wx-radio-input-checked {
  border-color: #FDC383 !important;
  background-color: #FDC383 !important;
}
/* 其他平台备用 */
/deep/ [class*="-radio-input-checked"] {
  border-color: #FDC383 !important;
  background-color: #FDC383 !important;
}
</style>
