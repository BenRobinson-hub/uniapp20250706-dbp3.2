<!-- pages/flexibleWork/job/detailView.vue -->
<template>
  <view>
    <!-- 顶部导航：左返回，无右侧按钮 -->
    <view class="w-full fixed-lt z-20" :style="{ paddingTop: sysHeight + 'px' }">
      <view class="h-80 px-20 flex-between-center">
        <!-- 左侧返回按钮 -->
        <text
          class="iconfont icon-ic_leftarrow fs-40 text--w111-fff"
          @click="pageBack"
        ></text>
        <!-- 去掉右上角“发布记录”链接 -->
      </view>
    </view>

    <!-- 可选：顶部背景图，参照供应商入驻样式 -->
    <view class="header-top relative" :style="[headerBg]"></view>

    <!-- 主体内容 -->
    <view class="bg-v-gradient pl-20 pr-20 pb-24" :style="{ minHeight: mainHeight + 'px' }">
      <view class="bg--w111-fff rd-24rpx content-box">
        <!-- 标题：编辑职位信息 -->
        <view class="fs-30 fw-500 lh-42rpx">编辑职位信息</view>

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

        <!-- 性别要求：radio组，右对齐 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">性别要求</view>
          <radio-group class="text-right" v-model="form.gender">
            <radio value="0" class="mr-20">不限</radio>
            <radio value="1" class="mr-20">男</radio>
            <radio value="2">女</radio>
          </radio-group>
        </view>

        <!-- 职位描述 -->
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

        <!-- 保存按钮 -->
        <view
          class="w-full h-88 rd-44rpx flex-center text--w111-fff fs-28 mt-48 bg-red"
          @click="saveJob"
        >
          保存修改
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { getJobDetail, updateJob } from "@/api/flexibleEmployment.js";
import { HTTP_REQUEST_URL } from "@/config/app.js";

export default {
  data() {
    return {
      sysHeight: uni.getSystemInfoSync().statusBarHeight,
      jobId: null, // 接收上一个页面传入的职位ID
      form: {
        title: "",
        salary: "",
        location: "",
        gender: "0", // 0=不限,1=男,2=女
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
      this.loadJobDetail();
    }
  },
  methods: {
    pageBack() {
      uni.navigateBack();
    },
    // 去掉右上角“发布记录”链接
    goRecord() {
      // 此处留空或删除
    },
    // 加载已有职位信息
    loadJobDetail() {
      getJobDetail(this.jobId)
        .then(res => {
          if (res.status === 200) {
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
    // 保存修改
    saveJob() {
      // 简易校验
      if (!this.form.title || !this.form.salary || !this.form.description) {
        return this.$util.Tips({ title: "请填写完整的职位信息" });
      }
      // 调用更新接口
      updateJob({
        id: this.jobId,
        ...this.form,
        status: 0 // 修改后状态变为“未审核”
      })
        .then(res => {
          if (res.status === 200) {
            this.$util.Tips({ title: "修改成功，请等待审核" });
            uni.navigateBack();
          } else {
            return this.$util.Tips({
              title: res.msg || "修改失败"
            });
          }
        })
        .catch(err => {
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
</style>
