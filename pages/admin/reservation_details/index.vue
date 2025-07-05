<template>
  <view :style="colorStyle" class="px-20 mt-24">
	<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
		<view class="acea-row">
			<view class="w-136 h-136 rd-16">
				<easy-loadimage
				mode="widthFix" 
				:image-src="productInfo.image"
				width="136rpx"
				height="136rpx"
				borderRadius="16rpx"></easy-loadimage>
			</view>
			<view class="w-502 ml-24">
				<view class="line1 fs-28 text--w111-333">{{productInfo.store_name }}</view>
				<view class="mt-8 text--w111-999 fs-24 line1">{{attrInfo.suk}}</view>
				<view class="acea-row row-between-wrapper">
					<view class="flex items-end flex-wrap mt-12 w-420">
						<BaseTag
							:text="label.label_name"
							:color="label.color"
							:background="label.bg_color"
							:borderColor="label.border_color"
							:circle="label.border_color ? true : false"
							:imgSrc="label.icon"
							v-for="(label, idx) in productInfo.store_label" :key="idx"></BaseTag>
					</view>
					<view class="fs-24 text--w111-999">共{{cartInfo.cart_num}}件</view>
				</view>
			</view>
		</view>
		<view class="cell acea-row row-between mt-26">
			<text class="fs-28 w-200">预约日期</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.reservation_time}}</text>
		</view>
		<view class="cell acea-row row-between">
			<text class="fs-28 w-200">预约时段</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.reservation_show_time}}</text>
		</view>
		<view class="cell acea-row row-between" v-if="info.reservation_name">
			<text class="fs-28 w-200">预约人姓名</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.reservation_name}}</text>
		</view>
		<view class="cell acea-row row-between" v-if="info.reservation_phone">
			<text class="fs-28 w-200">预约人手机号</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.reservation_phone}}</text>
		</view>
		<view class="cell acea-row row-between" v-if="info.reservation_phone">
			<text class="fs-28 w-200">预约人地址</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.reservation_address}}</text>
		</view>
		<view class="cell acea-row row-between" v-if="info.mark">
			<text class="fs-28 w-200">留言</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.mark}}</text>
		</view>
	</view>
	<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32" v-if="info.reservation_type == 3">
		<view class="cell acea-row row-between">
			<text class="fs-28 w-200">服务人员名称</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.service_staff_name || '暂无'}}</text>
		</view>
		<view class="cell acea-row row-between">
			<text class="fs-28 w-200">服务人员电话</text>
			<text class="fs-28 flex-1 pl-10 flex-1 text-right">{{info.service_staff_phone || '暂无'}}</text>
		</view>
	</view>
	<view v-if="info.reservation_info && info.reservation_info.length" class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
		<view class="cell fw-600">{{info.custom_form_title}}信息</view>
		<view class="cell flex justify-between" v-for="(item,index) in info.reservation_info" :key="index">
			<text class="fs-28">{{item.titleConfig.value}}</text>
			<view v-if="item.name == 'uploadPicture' && item.value.length < 5"  class="w-462 flex justify-end">
				<view class='pictrue mr-8' v-for="(items,indexs) in item.value" :key="indexs">
				  <image class="w-88 h-88 rd-8rpx" :src='items' mode="aspectFill"></image>
				</view>
			</view>
			<scroll-view scroll-x="true" scroll-with-animation
				class="white-nowrap vertical-middle w-462" show-scrollbar="false"
					v-else-if="item.name == 'uploadPicture' && item.value.length >= 5">
				<view class="inline-block mr-12" v-for="(items,indexs) in item.value" :key="index">
					<image class="w-88 h-88 rd-8rpx" :src="items"></image>
				</view>
			</scroll-view>
			<view v-else-if="item.name == 'dateranges'" class="  fs-28">
			   <text v-if="item.value.length">{{item.value[0]+'/'+item.value[1]}}</text>
			</view>
			<text v-else class="fs-28">{{item.value}}</text>
		</view>
	</view>
	<view class="heights"></view>
	<view class="footer bg-w111-2A7EFB acea-row row-center-wrapper" v-if="info.status==0" @click="showModalChange(1)">开始服务</view>
	<view v-else-if="info.status==1">
		<view class="footer bg-w111-2A7EFB acea-row row-center-wrapper" @click="showModalChange(2)">
			<view v-if="stopTime" class="footer bg-w111-FF7E00 acea-row row-center-wrapper" @click="showModalChange(2)">结束服务</view>
			<countDown
			:is-day="false"
			tip-text="结束服务"
			day-text=" "
			hour-text=":"
			minute-text=":"
			second-text=" "
			dotColor="#fff"
			colors="#fff"
			@endTime='endTime'
			v-else
			:datatime="info.service_stop_time"
			></countDown>
		</view>
	</view>
	<tuiModal
		:show="showModal"
		:title="modalTitle"
		:content="modalContent"
		:maskClosable="false"
		:confirmText="confirmText"
		@click="handleTap"></tuiModal>
  </view>
</template>

<script>
import colors from "@/mixins/color";
import { storeReservationDetail,reservationServiceSet } from '@/api/store.js';
import tuiModal from "@/components/tui-modal/index.vue";
import countDown from "@/components/countDown";
export default{
	components: {
		tuiModal,
		countDown
	},
	mixins: [colors],
	data() {
		return {
			id:0,
			info:{},
			cartInfo:{},
			productInfo:{},
			attrInfo:{},
			showModal:false,
			modalContent:'',
			confirmText:'',
			modalTitle:'',
			stopTime:0
		}
	},
	computed: {},
	onLoad(options){
		this.id = options.id
		this.reservationOrderDetail();
	},
	methods:{
		endTime(e){
			this.stopTime = e
		},
		showModalChange(num){
			if(num==1){
				this.modalTitle = '开始服务';
				this.modalContent = '你与指定服务人员不一致，是否确认？';
				this.confirmText = '确认';
				if(this.info.service_staff_id == 0 || this.info.now_staff_id == this.info.service_staff_id){
					this.serviceSet(1)
				}else{
					this.showModal = true;
				}
			}else{
				this.serviceSet(2)
			}
		},
		serviceSet(status){
			reservationServiceSet(this.id,{status:status}).then(res=>{
				if(status==1){
					this.showModal = false;
					this.reservationOrderDetail();
				}else{
					this.$util.Tips({
						title: res.msg
					},'/pages/admin/reservation_list/index');
				}
			}).catch(err=>{
				this.$util.Tips({
					title: err
				})
			})
		},
		handleTap(e){
			if(e.index){
				this.serviceSet(1)
			}else{
				this.showModal = false;
			}
		},
		// 预约详情
		reservationOrderDetail(){
			storeReservationDetail(this.id).then(res=>{
				let data = res.data;
				this.info = data;
				this.cartInfo = data.cart_info;
				this.productInfo = data.cart_info.productInfo;
				this.attrInfo = data.cart_info.productInfo.attrInfo;
			}).catch(err=>{
				this.$util.Tips({
					title: err
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.cell ~ .cell{
		margin-top: 26rpx;
	}
	.footer{
		width: 710rpx;
		height: 80rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50rpx;
		position: fixed;
		left: 50%;
		margin-left: -355rpx;
		bottom: 20rpx;
		bottom: calc(20rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(20rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		z-index: 20;
	}
	.heights{
		height: calc(140rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(140rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	/deep/.tui-modal-btn-cancel{
		border:1px solid #2A7EFB;
		color: #2A7EFB;
	}
	/deep/.tui-modal-btn-confirm{
		background-color: #2A7EFB;
	}
</style>