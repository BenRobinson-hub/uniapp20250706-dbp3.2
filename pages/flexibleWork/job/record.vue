<!-- pages/flexibleWork/job/record.vue -->
<template>
  <view>
    <view class="px-20">
      <!-- 列表循环 -->
      <view
        class="w-full bg--w111-fff rd-24rpx flex-between-center mt-24 p-32"
        v-for="(item,index) in list"
        :key="index"
      >
        <view>
          <!-- 标题 + 状态标签 -->
          <view class="flex-y-center">
            <text class="fs-30 lh-42rpx max-300 line1">{{ item.title }}</text>
            <text class="tag tag0 fs-22 ml-16" :class="'tag' + item.status">
              {{ item.status | typeFilter }}
            </text>
          </view>
          <!-- 提交时间 -->
          <view class="fs-24 text--w111-999 mt-20">
            提交时间：{{ item.add_time }}
          </view>
          <!-- 审核未通过时显示原因 -->
          <view class="fs-24 text--w111-999 mt-20" v-if="item.status == 2">
            原因：{{ item.fail_msg }}
          </view>
        </view>
        <!-- 操作按钮：查看 / 重新提交 / 编辑 -->
        <text
          class="btn info-btn fs-24"
          @tap="lookUp(item)"
          v-if="item.status == 1"
        >
          查看
        </text>
        <text
          class="btn danger-btn fs-24"
          @tap="resubmit(item)"
          v-else-if="item.status == 2"
        >
          重新提交
        </text>
        <text
          class="btn info-btn fs-24"
          @tap="edit(item)"
          v-else
        >
          编辑
        </text>
      </view>

      <!-- 空列表时的提示 -->
      <view class="mt-20" v-if="list.length === 0">
        <emptyPage title="暂无职位记录~" src="/statics/images/noOrder.gif" />
      </view>
    </view>
  </view>
</template>

<script>
import emptyPage from '@/components/emptyPage.vue';
import { getJobRecordList } from '@/api/flexibleEmployment.js';

export default {
  name: 'JobRecord',
  components: { emptyPage },
  data() {
    return {
      list: []
    };
  },
  filters: {
    typeFilter(val) {
      // 0=待审核, 1=审核通过, 2=审核未通过
      const map = { 0: '待审核', 1: '审核通过', 2: '审核未通过' };
      return map[val] || '未知';
    }
  },
  onLoad() {
    this.getList();
  },
  methods: {
    /** 获取发布记录列表 */
    getList() {
      getJobRecordList()
        .then((res) => {
          if (res.status === 200) {
            this.list = res.data || [];
          } else {
            uni.showToast({ title: res.msg || '获取记录失败', icon: 'none' });
          }
        })
        .catch((err) => {
          uni.showToast({ title: '网络错误', icon: 'none' });
          console.error('获取职位发布记录失败：', err);
        });
    },
    /** 查看 (审核通过时) */
    lookUp(item) {
      // 跳转到审核状态页面 (job/state.vue) 或查看详情
      uni.navigateTo({
        url: '/pages/flexibleWork/job/state?jobId=' + item.id + '&type=1'
      });
    },
    /** 重新提交 (审核未通过时) */
    resubmit(item) {
      // 可直接跳转到审核状态页面，或先跳转编辑页面
      uni.navigateTo({
        url: '/pages/flexibleWork/job/state?jobId=' + item.id + '&type=2'
      });
    },
    /** 编辑 (待审核/可再次编辑时) */
    edit(item) {
      // 跳转到编辑页面 detailView.vue
      // 需在 detailView 中根据 jobId 加载已有内容
      uni.navigateTo({
        url: '/pages/flexibleWork/job/posting?jobId=' + item.id
      });
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
