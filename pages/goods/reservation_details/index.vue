<template>
	<view :style="colorStyle">
		<view class="w-full relative z-99" :style="{'padding-top': sysHeight + 'px'}">
			<view class="w-full px-20 pl-20 h-80 flex-between-center relative z-80">
				<text class="iconfont icon-ic_leftarrow fs-40 text--w111-fff" @tap="goPage"></text>
				<text class="fs-34 fw-500 text--w111-fff">预约详情</text>
				<text></text>
			</view>
			<view class="px-20 relative z-80">
				<view class="flex-between-center h-160 mt-12">
					<view class="flex-1 text--w111-fff pl-12">
						<view class="fs-36 fw-500 lh-50rpx">{{info.status_name}}</view>
						<view class="fs-26 lh-36rpx mt-8">{{info.status_msg}}</view>
					</view>
					<image :src="info.status_pic" class="w-140 h-140"></image>
				</view>
			</view>
			<view class="w-full bg-gradient abs-lt" :style="{height: 213 + sysHeight + 'px'}">
				<view class="w-full abs-lb white_jianbian z-20"></view>
			</view>
		</view>
		<view class="px-20 relative z-99">
			<view class="bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32 acea-row">
				<view class="w-136 h-136 rd-16">
					<easy-loadimage mode="widthFix" :image-src="productInfo.image" width="136rpx" height="136rpx"
						borderRadius="16rpx"></easy-loadimage>
				</view>
				<view class="w-502 ml-24">
					<view class="line1 fs-28 text--w111-333">{{productInfo.store_name }}</view>
					<view class="mt-8 text--w111-999 fs-24 line1">{{attrInfo.suk}}</view>
					<view class="acea-row row-between-wrapper">
						<view class="flex items-end flex-wrap mt-12 w-420">
							<BaseTag :text="label.label_name" :color="label.color" :background="label.bg_color"
								:borderColor="label.border_color" :circle="label.border_color ? true : false"
								:imgSrc="label.icon" v-for="(label, idx) in productInfo.store_label" :key="idx">
							</BaseTag>
						</view>
						<view class="fs-24 text--w111-999">共{{cartInfo.cart_num}}件</view>
					</view>
				</view>
			</view>
			<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32 text-center"
				v-if="[-1,2].indexOf(info.status) ==-1">
				<view class="fs-28 text--w111-333">请提醒商家核销预约单</view>
				<view class="w-320 h-320 m-auto mt-40">
					<image :src="codeSrc" class="w-full h-full"></image>
				</view>
				<view class="mt-32 fs-28 font-num">{{info.verify_code}}</view>
			</view>
			<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32" v-if="info.reservation_type == 3">
				<view class="cell flex-between-center">
					<text class="fs-28">服务人员名称</text>
					<text class="fs-28">{{info.service_staff_name || '待分配'}}</text>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">服务人员电话</text>
					<text class="fs-28">{{info.service_staff_phone || '待分配'}}</text>
				</view>
			</view>
			<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
				<navigator class="cell flex-between-center" :url="'/pages/store/info/index?store_id='+storeInfo.id"
					hover-class="none">
					<text class="fs-28">预约门店</text>
					<text class="fs-28">{{storeInfo.name}}<text
							class="iconfont icon-ic_rightarrow fs-24 text--w111-999 ml-4"></text></text>
				</navigator>
				<view class="cell flex-between-center">
					<text class="fs-28">预约日期</text>
					<text class="fs-28">{{info.reservation_time}}</text>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">预约时段</text>
					<text class="fs-28">{{info.reservation_show_time}}</text>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">预约人姓名</text>
					<text class="fs-28">{{info.reservation_name}}</text>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">预约人手机号</text>
					<text class="fs-28">{{info.reservation_phone}}</text>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">预约人地址</text>
					<text class="fs-28 w-400 text-right">{{info.reservation_address}}</text>
				</view>
				<view class="cell flex-between-center" v-if="info.mark">
					<text class="fs-28">留言</text>
					<text class="fs-28 line1 w-542 text-right">{{info.mark}}</text>
				</view>
			</view>
			<view v-if="info.reservation_info && info.reservation_info.length"
				class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
				<view class="cell fw-600">{{info.custom_form_title}}信息</view>
				<view class="cell flex justify-between" v-for="(item,index) in info.reservation_info" :key="index">
					<text class="fs-28">{{item.titleConfig.value}}</text>
					<view v-if="item.name == 'uploadPicture' && item.value.length < 5" class="w-462 flex justify-end">
						<view class='pictrue mr-8' v-for="(items,indexs) in item.value" :key="indexs">
							<image class="w-88 h-88 rd-8rpx" :src='items' mode="aspectFill"></image>
						</view>
					</view>
					<scroll-view scroll-x="true" scroll-with-animation class="white-nowrap vertical-middle w-462"
						show-scrollbar="false" v-else-if="item.name == 'uploadPicture' && item.value.length >= 5">
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
			<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
				<view class="cell flex-between-center">
					<text class="fs-28">预约单号</text>
					<view class="fs-28">
						<text class="fs-28 pr-12">{{info.order_id}}</text>
						<text class="inline-block copy_btn fs-22" @tap="copy(info.order_id)">复制</text>
					</view>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">订单编号</text>
					<view class="fs-28">
						<text class="fs-28 pr-12">{{info.store_order_id}}</text>
						<text class="inline-block copy_btn fs-22" @tap="copy(info.store_order_id)">复制</text>
					</view>
				</view>
				<view class="cell flex-between-center">
					<text class="fs-28">预约时间</text>
					<text class="fs-28">{{info.reservation_create_time}}</text>
				</view>
				<view class="cell flex-between-center" v-if="info.service_time">
					<text class="fs-28">服务开始时间</text>
					<text class="fs-28">{{info.service_time}}</text>
				</view>
				<view class="cell flex-between-center" v-if="info.service_end_time">
					<text class="fs-28">服务结束时间</text>
					<text class="fs-28">{{info.service_end_time}}</text>
				</view>
			</view>
			<view class="heights"></view>
			<view class="footer acea-row row-middle row-right" v-if="[0,-1].indexOf(info.status) != -1">
				<view v-if="info.is_cancel_reservation==1" class="border-CCCCCC w-144 h-56 rd-30rpx flex-center fs-24"
					@click="showModalChange(0)">取消预约</view>
				<view v-else-if="info.status == -1" class="acea-row row-middle">
					<view class="border-CCCCCC w-168 h-56 rd-30rpx flex-center fs-24" @click="showModalChange(1)">删除预约单
					</view>
					<navigator v-if="info.is_reservation" hover-class='none'
						:url="'/pages/activity/reservation/index?orderId='+info.oid"
						class="border-CCCCCC w-144 h-56 rd-30rpx flex-center fs-24 ml-16">再次预约</navigator>
				</view>
			</view>
			<zb-code ref="qrcode" :show="codeShow" :cid="cid" :val="info.verify_code" :size="size" :unit="unit"
				:background="background" :foreground="foreground" :pdground="pdground" :icon="icon" :iconSize="iconsize"
				:onval="onval" :loadMake="loadMake" @result="qrR" />
			<tuiModal :show="showModal" :title="modalTitle" :content="modalContent" :maskClosable="false"
				:confirmText="confirmText" @click="handleTap"></tuiModal>
		</view>
	</view>
</template>

<script>
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import colors from "@/mixins/color";
	import {
		getReservationOrderDetail,
		postReservationOrderCancel,
		delReservationOrder
	} from '@/api/order.js';
	import zbCode from '@/components/zb-code/zb-code.vue';
	import tuiModal from "@/components/tui-modal/index.vue"
	export default {
		components: {
			zbCode,
			tuiModal
		},
		mixins: [colors],
		data() {
			return {
				sysHeight: sysHeight,
				//二维码参数开始
				codeShow: false,
				cid: '1',
				size: 200, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFF', // 背景色
				foreground: '#000', // 前景色
				pdground: '#000', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				//二维码参数结束
				id: 0,
				info: {},
				cartInfo: {},
				productInfo: {},
				attrInfo: {},
				storeInfo: {},
				codeSrc: '',
				showModal: false,
				modalContent: '',
				confirmText: '',
				modalTitle: '',
				modalType: 0,
			}
		},
		computed: {},
		onLoad(options) {
			this.id = options.id
			this.reservationOrderDetail();
		},
		methods: {
			goPage() {
				let pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			showModalChange(type) {
				this.modalType = type;
				if (type == 0) {
					this.modalTitle = '取消预约';
					this.modalContent = '取消后可重新预约，是否取消预约？';
					this.confirmText = '确认';
				} else if (type == 1) {
					this.modalTitle = '删除预约单';
					this.modalContent = '确定删除该预约单?';
					this.confirmText = '确认';
				}
				this.showModal = true;
			},
			handleTap(e) {
				if (e.index) {
					if (this.modalType == 0) {
						postReservationOrderCancel(this.id).then(res => {
							this.reservationOrderDetail();
							this.showModal = false;
						}).catch(err => {
							this.showModal = false;
							this.$util.Tips({
								title: err
							})
						})
					} else {
						delReservationOrder(this.id).then(res => {
							this.showModal = false;
							uni.navigateTo({
								url: '/pages/goods/reservation_list/index?id=' + this.info.oid
							})
						}).catch(err => {
							this.showModal = false;
							this.$util.Tips({
								title: err
							})
						})
					}
				} else {
					this.showModal = false;
				}
			},
			// 预约详情
			reservationOrderDetail() {
				getReservationOrderDetail(this.id).then(res => {
					let data = res.data;
					this.info = data;
					this.cartInfo = data.cart_info;
					this.productInfo = data.cart_info.productInfo;
					this.attrInfo = data.cart_info.productInfo.attrInfo;
					this.storeInfo = data.storeInfo;
				}).catch(err => {
					this.$util.Tips({
						title: err
					})
				})
			},
			qrR(img) {
				this.codeSrc = img;
			},
			copy(code) {
				uni.setClipboardData({
					data: code
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.white_jianbian{
		height:120rpx;
		background: linear-gradient(0deg, #F5F5F5 0%, rgba(245,245,245,0) 100%);
	}
	
	.cell~.cell {
		margin-top: 26rpx;
	}

	.copy_btn {
		width: 68rpx;
		height: 36rpx;
		background: #F5F5F5;
		border-radius: 20rpx;
		text-align: center;
		line-height: 36rpx;
	}

	.footer {
		width: 100%;
		background-color: #fff;
		padding: 0 20rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 20;
		height: calc(96rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(96rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		box-sizing: border-box;
	}

	.heights {
		height: calc(116rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(116rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
</style>