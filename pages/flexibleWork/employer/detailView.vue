<!-- pages/flexibleWork/employer/detailView.vue -->
<template>
  <view>
    <!-- 顶部导航：左返回，无右上角链接 -->
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
    <view class="header-top relative" :style="[headerBg]"></view>

    <!-- 主体内容 -->
    <view class="bg-v-gradient pl-20 pr-20 pb-24" :style="{ minHeight: mainHeight + 'px' }">
      <view class="bg--w111-fff rd-24rpx content-box">
        <!-- 标题：编辑雇主信息 -->
        <view class="fs-30 fw-500 lh-42rpx">编辑雇主信息</view>

        <!-- 公司名称 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">公司名称</view>
          <input
            type="text"
            v-model="form.companyName"
            placeholder="请输入公司名称"
            placeholder-class="text--w111-ccc"
            class="fs-28 text-right"
          />
        </view>

        <!-- 联系人 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">联系人</view>
          <input
            type="text"
            v-model="form.contactName"
            placeholder="请输入联系人姓名"
            placeholder-class="text--w111-ccc"
            class="fs-28 text-right"
          />
        </view>

        <!-- 联系电话 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">联系电话</view>
          <input
            type="number"
            v-model="form.contactPhone"
            placeholder="请输入手机号"
            placeholder-class="text--w111-ccc"
            class="fs-28 text-right"
          />
        </view>

        <!-- 如需上传图片，可参考供应商入驻逻辑：images、uploadPic() 等
             此处示例仅演示文本字段的编辑，如需上传执照，可自行添加 -->

        <!-- 保存按钮 -->
        <view
          class="w-full h-88 rd-44rpx flex-center text--w111-fff fs-28 mt-48 bg-red"
          @click="saveEmployer"
        >
          保存修改
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { getEmployerApplyDetail, updateEmployer } from "@/api/flexibleEmployment.js";
import { HTTP_REQUEST_URL } from "@/config/app.js";

export default {
  data() {
    return {
      sysHeight: uni.getSystemInfoSync().statusBarHeight,
      id: null, // 路由参数：雇主ID
      form: {
        companyName: "",
        contactName: "",
        contactPhone: ""
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
      // 若需与供应商入驻相同顶部背景，可使用以下：
      return {
        backgroundImage: `url(${HTTP_REQUEST_URL}/statics/images/supplier/apply_header.png)`
      };
    }
  },
  onLoad(options) {
    // 获取路由参数并加载已有雇主信息
    if (options.id) {
      this.id = options.id;
      this.loadEmployerDetail();
    }
  },
  methods: {
    pageBack() {
      uni.navigateBack();
    },
    // 加载已有雇主信息
    loadEmployerDetail() {
      getEmployerApplyDetail(this.id)
        .then((res) => {
          // 与供应商入驻原生逻辑保持一致：判断 res.status == 200
          if (res.status === 200) {
            const data = res.data;
            this.form.companyName = data.companyName || "";
            this.form.contactName = data.contactName || "";
            this.form.contactPhone = data.contactPhone || "";
            // 如有 images 等字段，也可在此赋值
          } else {
            uni.showToast({ title: res.msg || "获取详情失败", icon: "none" });
          }
        })
        .catch((err) => {
          uni.showToast({ title: "网络错误", icon: "none" });
          console.error("加载雇主信息失败：", err);
        });
    },
    // 保存修改
    saveEmployer() {
      // 简易校验
      if (!this.form.companyName || !this.form.contactName || !this.form.contactPhone) {
        return this.$util.Tips({ title: "请填写完整信息" });
      }
      // 调用更新接口，修改后将 status=0 重新审核
      updateEmployer({
        id: this.id,
        ...this.form,
        status: 0
      })
        .then((res) => {
          if (res.status === 200) {
            this.$util.Tips({ title: "修改成功，请等待审核" });
            uni.navigateBack();
          } else {
            return this.$util.Tips({
              title: res.msg || "修改失败"
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
.header-top {
  width: 100%;
  height: 358rpx;
  background-size: cover;
}
.bg-v-gradient {
  background: linear-gradient(180deg, #FE7015 0%, #EB3B26 100%);
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
</style>
