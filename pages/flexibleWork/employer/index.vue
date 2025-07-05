<!-- pages/flexibleWork/employer/index.vue -->
<template>
  <view>
    <view class="w-full fixed-lt z-20" :style="{ 'padding-top': sysHeight + 'px' }">
      <view class="h-80 px-20 flex-between-center">
        <text class="iconfont icon-ic_leftarrow fs-40 text--w111-fff" @click="pageBack"></text>
      </view>
    </view>
    <view class="header-top relative" :style="[headerBg]">
      <view class="rule-btn w-124 flex-center fs-24 text--w111-fff" :style="{ top: (100 + sysHeight) + 'px' }" @click="goRecord">
        申请记录
      </view>
    </view>
    <view class="bg-v-gradient pl-20 pr-20 pb-24" :style="{ minHeight: mainHeight + 'px' }">
      <view class="bg--w111-fff rd-24rpx content-box">
        <view class="fs-30 fw-500 lh-42rpx">请填写以下信息</view>
        <!-- 表单项 -->
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">公司名称</view>
          <input type="text" v-model="form.companyName" placeholder="请输入公司名称" class="fs-28 text-right" />
        </view>
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">联系人</view>
          <input type="text" v-model="form.contactName" placeholder="请输入联系人姓名" class="fs-28 text-right" />
        </view>
        <view class="cell flex-between-center mt-64">
          <view class="fs-28 lh-40rpx">联系电话</view>
          <input type="number" v-model="form.contactPhone" placeholder="请输入手机号" class="fs-28 text-right" />
        </view>
        <!-- 图片上传 -->
        <view class="fs-28 lh-40rpx mt-64">请上传营业执照及相关资质证明图片</view>
        <view class="fs-24 lh-34rpx text--w111-ccc mt-12">(最多可上传8张)</view>
        <view class="grid-column-4 grid-gap-24rpx mt-24">
          <view class="relative w-148 h-148" v-for="(item, index) in form.images" :key="index">
            <image :src="item" mode="aspectFill" class="w-148 h-148 rd-16rpx"></image>
            <view class="abs-rt w-32 h-32 del-pic flex-center" @click="delPic(index)">
              <text class="iconfont icon-ic_close text--w111-fff fs-24"></text>
            </view>
          </view>
          <view class="h-148 flex-col flex-center upload bg--w111-f5f5f5 text--w111-999 rd-16rpx" @click="uploadPic" v-if="form.images.length < 8">
            <text class="iconfont icon-ic_camera fs-42"></text>
            <text class="fs-24 lh-34rpx pt-8">上传图片</text>
          </view>
        </view>
        <!-- 协议 -->
        <view class="flex-y-center mt-32">
          <text class="iconfont fs-30" :class="isSelect ? 'icon-a-ic_CompleteSelect' : 'icon-ic_unselect'" @click="toggleAgree"></text>
          <text class="fs-24 text--w111-999 pl-12">已阅读并同意</text>
          <text class="font-red fs-24" @click="getAgreement">《雇主入驻协议》</text>
        </view>
        <!-- 提交按钮 -->
        <view class="w-full h-88 rd-44rpx flex-center text--w111-fff fs-28 mt-48" :class="canSubmit ? 'bg-red' : 'bg-disabled'" @click="submitEmployer">
          提交申请
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getEmployerApplyDetail, updateEmployer } from "@/api/flexibleEmployment.js";
import { mapGetters } from "vuex";
import { applyEmployer } from "@/api/flexibleEmployment.js";
import { HTTP_REQUEST_URL } from "@/config/app.js";
export default {
  data() {
    return {
	id:0,
      sysHeight: uni.getSystemInfoSync().statusBarHeight,
      form: {
        companyName: '',
        contactName: '',
        contactPhone: '',
        images: []
      },
      isSelect: false,
      canvasStatus: false,
      canvasWidth: 0,
      canvasHeight: 0
    };
  },
  computed: {
    ...mapGetters(['isLogin']),
    canSubmit() {
      return this.form.companyName &&
             this.form.contactName &&
             this.form.contactPhone &&
             this.form.images.length &&
             this.isSelect;
    },
    headerBg() {
      return {
        backgroundImage: `url(${HTTP_REQUEST_URL}/statics/images/supplier/apply_header.png)`
      };
    },
    mainHeight() {
      let { windowHeight } = uni.getSystemInfoSync();
      return windowHeight - 90 - this.sysHeight;
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
	loadEmployerDetail() {
	  getEmployerApplyDetail(this.id)
	    .then((res) => {
	      // 与供应商入驻原生逻辑保持一致：判断 res.status == 200
	      if (res.status == 200) {
		 const data = res.data;
			// let data = res.data;
			this.form.companyName = data.companyName;
			//this.$set(this.form, 'companyName', data.companyName);
			 this.form.contactName = data.contactName;
			 this.form.contactPhone = data.contactPhone;
			if(data.images) this.form.images = data.images;
	       
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
	
    pageBack() {
      uni.navigateBack();
    },
    goRecord() {
      uni.navigateTo({ url: '/pages/flexibleWork/employer/record' });
    },
    delPic(index) {
      this.form.images.splice(index, 1);
    },
    /*** 上传文件 ***/
    uploadPic() {
      let that = this;
      this.canvasStatus = true;
      that.$util.uploadImageChange({ count: 8, url: 'upload/image' },
        function(res) {
          that.form.images.push(res.data.url);
        },
        (res) => {
          that.canvasStatus = false;
        },
        (res) => {
          that.canvasWidth = res.w;
          that.canvasHeight = res.h;
        }
      );
    },
    toggleAgree() {
      this.isSelect = !this.isSelect;
    },
    getAgreement() {
      uni.showModal({
        title: '协议',
        content: '《雇主入驻协议》',
        showCancel: false
      });
    },
    submitEmployer() {
      if (!this.canSubmit) {
        uni.showToast({ title: '请完整填写表单并同意协议', icon: 'none' });
        return;
      }
      applyEmployer({
        companyName: this.form.companyName,
        contactName: this.form.contactName,
        contactPhone: this.form.contactPhone,
        images: this.form.images,
		id:this.id
      }).then(res => {
        if (res.status == 200) {
          uni.showToast({ title: '提交成功', icon: 'none' });
          // 提交后自动跳转到审核状态页面
          uni.navigateTo({
            url: '/pages/flexibleWork/employer/state?id=' + res.data.id
          });
        } else {
          uni.showToast({ title: res.msg || '提交失败', icon: 'none' });
        }
      }).catch(err => {
        uni.showToast({ title: '网络错误', icon: 'none' });
        console.error(err);
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
.rule-btn {
  height: 48rpx;
  background: rgba(0,0,0,0.15);
  border-radius: 24rpx 0 0 24rpx;
  position: absolute;
  right: 0;
}
.bg-v-gradient {
  background: linear-gradient(180deg, #FE7015 0%, #EB3B26 100%);
}
.content-box {
  padding: 48rpx 32rpx 40rpx;
}
.del-pic {
  background-color: #999;
  border-radius: 0 16rpx 0 16rpx;
}
.icon-a-ic_CompleteSelect,
.font-red {
  color: #e93323;
}
.icon-ic_unselect {
  color: #ccc;
}
.bg-red {
  background-color: #e93323;
}
.bg-disabled {
  background-color: rgba(233, 51, 35, 0.5);
}
</style>
