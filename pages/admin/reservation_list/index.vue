<template>
	<view :style="colorStyle">
		<view class="fixed-lt bg--w111-f5f5f5 w-full z-999 header_box" :style="{'padding-top': sysHeight + 'px'}">
			<view class="h-80 px-20 flex-y-center">
				<text class="iconfont icon-ic_leftarrow fs-40 text--w111-333" @click="goPage"></text>
				<!--  #ifdef  MP-WEIXIN -->
				<view class="w-460 h-58 rd-30 bg--w111-fff flex-y-center px-32 ml-20">
				<!--  #endif -->
				<!--  #ifndef  MP-WEIXIN -->
				<view class="flex-1 h-58 rd-30 bg--w111-fff flex-y-center px-32 ml-20">
				<!--  #endif -->
					<text class="iconfont icon-ic_search fs-24 text--w111-999"></text>
					<input v-model="keyword" confirm-type="search" @confirm="inputConfirm"
					class="pl-18 flex-1 fs-24" placeholder="请输入订单编号/商品名称" placeholder-class="text--w111-999" />
				</view>
			</view>
			<view class="h-100 w-full px-32 flex-between-center fs-26">
				<view v-for="(item,index) in navList" :key="index" class="relative" :class="orderStatus === item.type ? 'active' : ''" @click="statusClick(item.type)">
					{{item.name}}
					<image src="../static/adorn.png" v-if="orderStatus === item.type" class="w-14 h-14 absolute block right-f8 bottom-f8"></image>
				</view>
			</view>
		</view>
		<view class="px-20" :style="{'margin-top':marTop + 'px'}">
			<view class="order_card bg--w111-fff rd-24rpx pt-32 pb-32 pl-24 pr-24"
			v-for="(item, index) in orderList" :key="index" @click="goReservationDetails(item.id)">
				<view class="flex-between-center">
					<view class="flex-y-center">
						<text class="h-32 bg--w111-fff px-6 rd-6rpx fs-20 border_con text-w111-2A7EFB acea-row row-middle">
							{{item.reservation_type==3?'上门':'到店'}}</text>
						<text class="fs-28 lh-40rpx text--w111-333 pl-16">{{item.order_id}}</text>
					</view>
					<view class="text-w111-2A7EFB fs-26">
						<text v-if="item.status == 0">待服务</text>
						<text v-if="item.status == 1">进行中</text>
						<text v-if="item.status == 2">已完成</text>
						<text v-if="item.status == -1">已取消</text>
					</view>
			    </view>
				<view class="mt-26" v-if="item.cart_info">
					<view class="flex justify-between">
						<view class="flex">
							<easy-loadimage
							mode="widthFix" 
							:image-src="item.cart_info.productInfo.image"
							width="136rpx"
							height="136rpx"
							borderRadius="16rpx"></easy-loadimage>
							<view class="ml-20">
								<view class="w-346 fs-28 text--w111-333 lh-40rpx line2"> {{item.cart_info.productInfo.store_name }}
								</view>
								<view class="w-346 fs-24 text--w111-999 lh-34rpx line1 mt-12">{{item.cart_info.productInfo.attrInfo.suk}}</view>
							</view>
						</view>
						<view>
							<baseMoney :money="item.cart_info.truePrice" symbolSize="20" integerSize="32" decimalSize="20"
								color='#333' weight></baseMoney>
							<view class="fs-24 text--w111-999 lh-34rpx text-right mt-8">共{{item.cart_info.cart_num}}件</view>
						</view>
					</view>
					<view class="fs-24 text--w111-333 mt-26">预约时间：{{item.reservation_time+' '+item.reservation_start+'~'+item.reservation_end}}</view>
				</view>
		    </view>
			<block v-if="orderList.length == 0 && !loading">
				<emptyPage title="暂无订单信息～" :src="keyword ? '/statics/images/noSearch.gif' : '/statics/images/noOrder.gif'"></emptyPage>
			</block>
			<view class="loadingicon flex-center" v-if="orderList.length > 0">
				<text class="loading iconfont icon-ic_Refresh" :hidden="loading == false"></text>
				<text class="fs-26 pb-32">{{ loadTitle }}</text>
			</view>
	    </view>
	    <home :isHide="homeHide" @homehide="onhomehide"></home>
	</view>
</template>

<script>
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import {
		storeReservationList
	} from '@/api/store.js';
	import home from '@/components/home';
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from 'vuex';
	import emptyPage from '@/components/emptyPage.vue';
	import colors from '@/mixins/color.js';
	import Loading from '@/components/Loading/index.vue'
	export default {
		components: {
			Loading,
			home,
			emptyPage
		},
		mixins: [colors],
		data() {
			return {
				navList:[
					{
						name:'全部',
						type:''
					},
					{
						name:'待服务',
						type:0
					},
					{
						name:'进行中',
						type:1
					},
					{
						name:'已完成',
						type:2
					},
					{
						name:'已取消',
						type:-1
					}
				],
				sysHeight:sysHeight,
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [], //订单数组
				orderStatus: '', //订单状态
				page: 1,
				limit: 20,
				keyword: '',
				oid:0,
				marTop:0,
				homeHide: false
			};
		},
		computed: {
			...mapGetters(['isLogin']),
			fixedTop() {
				// #ifdef MP || APP-PLUS
				return this.sysHeight + 'px'
				// #endif
				return this.data
				// #ifndef MP
				return 0
				// #endif
			}
		},
		onShow() {
			this.page = 1;
			this.loadend = false;
			this.orderList = [];
			if (this.isLogin) {
				this.getOrderList();
			} else {
				toLogin()
			}
		},
		onPageScroll(object) {
			uni.$emit('scroll');
			this.homeHide = true;
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.orderStatus = options.orderStatus == undefined?'':parseInt(options.orderStatus);
			this.oid = options.oid;
			this.getMarTop();
		},
		methods: {
			getMarTop(){
				let that = this;
				setTimeout(() => {
					// 获取小程序头部高度
					let info = uni.createSelectorQuery().in(this).select(".header_box");
					info.boundingClientRect(function(data) {
						that.marTop = data.height
					}).exec()
				}, 100)
			},
			goReservationDetails: function(id) {
				if (!id){
					return that.$util.Tips({
						title: '缺少预约单号无法查看预约详情'
					});
				}
				uni.navigateTo({
					url: '/pages/admin/reservation_details/index?id=' + id
				});
			},
			/**
			 * 切换类型
			 */
			statusClick: function(status) {
				if (this.loading) return
				if (status === this.orderStatus) return;
				this.orderStatus = status;
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.getOrderList();
			},
			inputConfirm(){
				this.loadend = false;
				this.loading = false;
				this.page = 1;
				this.orderList = [];
				this.getOrderList();
			},
			/**
			 * 获取订单列表
			 */
			getOrderList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '加载更多';
				storeReservationList ({
					status: that.orderStatus,
					search: this.keyword,
					oid: this.oid,
					page: that.page,
					limit: that.limit
				}).then(res => {
					let list = res.data || [];
					let loadend = list.length < that.limit;
					that.orderList = that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '没有更多内容啦~' : '加载更多';
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
			goPage(){
				let pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
				}else{
					uni.navigateTo({
						url: '/pages/admin/work/store'
					});
				}
			},
			onhomehide() {
				this.homeHide = false;
			},
		},
		onReachBottom: function() {
			this.getOrderList();
		}
	};
</script>

<style scoped lang="scss">
	.border_con {
		border: 1px solid #2A7EFB;
	}

	.border_ccc {
		border: 1rpx solid #ccc;
	}

	.active {
		color: #2A7EFB;
		font-weight: 500;
		font-size: 30rpx;
	}

	.abs-rt {
		position: absolute;
		top: 0;
		right: 0;
	}
	.order_card ~ .order_card{
		margin-top:20rpx;

	}
	.btn ~ .btn{
		margin-left: 16rpx;
	}
</style>