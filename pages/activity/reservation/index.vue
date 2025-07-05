<template>
	<view :style="colorStyle">
	   <!-- #ifdef MP || APP-PLUS -->
	   <NavBar titleText="立即预约" :iconColor="iconColor" :textColor="iconColor" :bagColor="bagColor" :isScrolling="false" showBack></NavBar>
	   <!-- #endif -->
	   <view class="header"></view>
	   <view class="bg--w111-fff pl-24 pr-24 pt-32 pb-32 rd-16rpx relative w-710 m-auto">
		  <view class="acea-row row-between-wrapper" v-if="!orderId">
			  <view class="fs-28">预约门店</view>
			  <view class="fs-28">{{storeName}}</view>
		  </view>
		  <view class="acea-row row-between-wrapper" :class="orderId?'':'mt-32'">
			  <view class="fs-28">预约人数</view>
			  <view>
				<view class="acea-row row-middle">
					<text class="iconfont icon-ic_Reduce fs-26 text--w111-333 mr-4" :class="cartNum<=1?'text--w111-ccc':''" @click.stop="addCart(0)"></text>
					<input type="number" maxlength="3" class="w-72 h-36 rd-4rpx bg--w111-f5f5f5 acea-row row-center-wrapper text-center fs-24 text--w111-333 mx-6" v-model="cartNum" />
					<text class="iconfont icon-ic_increase fs-26 text--w111-333 ml-4" :class="(cartNum >= maxCartNum && orderId)?'text--w111-ccc':''" @click.stop="addCart(1)"></text>
				</view>
			  </view>
		  </view>
		  <view v-if="attrList.length" class="mt-32">
			 <view class="acea-row row-between-wrapper">
				 <view class="fs-28">规格</view>
				 <view class="iconfont  text--w111-666 fs-28" :class="attrStyle?'icon-a-ic_Imageandtextsorting':'icon-a-ic_Picturearrangement'" v-if="attrList[0].pic" @click="attrStyleTap"></view>
			 </view>
			 <scroll-view v-if="attrStyle" scroll-x="true" show-scrollbar="false" class="mt-32 white-nowrap vertical-middle w-full overflow">
				 <view v-for="(item,index) in attrList" class="w-196 h-252 bg--w111-f5f5f5 rd-12rpx inline-block mr-12 relative border-F5F5F5-1" :class="current==index?'bntActive':''" @click="arrtTap(item,index)">
				 	<view @click="showImg(item)" class="absolute w-36 h-36 acea-row row-center-wrapper bg--w111-ddd rd-50rpx top-8 right-8 z-4">
						<text class="iconfont icon-ic_enlarge text--w111-fff fs-24"></text>
				 	</view>
				 	<view class="w-full h-194">
						<image :src="item.pic" class="w-full h-full rd-t-12rpx"></image>
				 	</view>
				 	<view class="w-full h-58 fs-24 acea-row row-center-wrapper">{{item.attr}}</view>		 				  
				 </view>
			 </scroll-view>
			 <scroll-view v-else scroll-x="true" show-scrollbar="false" class="mt-32 white-nowrap vertical-middle w-full overflow">
			 	<view v-for="(item,index) in attrList" class="inline-block mr-24 vertical-middle" @click="arrtTap(item,index)">
			 		<view class="acea-row row-middle h-56 bg--w111-f5f5f5 pl-4 pr-20 rd-50rpx border-F5F5F5-1" :class="current==index?'bntActive':''">
			 			<view class="w-48 h-48 mr-8" v-if="item.pic">
							<image :src="item.pic" class="w-full h-full rd-50-p111-"></image>
			 			</view>
			 			<view class="fs-24" :class="!item.pic?'pl-16':''">{{item.attr}}</view>
			 		</view>
			 	</view>		  
			 </scroll-view>
		  </view>
		  <view class="acea-row row-between-wrapper mt-32" v-if="orderId">
			  <view class="fs-28">服务类型</view>
			  <view class="fs-28">{{reservationName}}</view>
		  </view> 
		  <view v-else>
			 <view class="mt-32 fs-28">服务类型</view>
			 <view class="acea-row row-middle mt-32">
			 	<view v-for="(item,index) in serviceList" @click="serviceTap(index)" class="w-136 h-56 bg--w111-f5f5f5 acea-row row-center-wrapper fs-24 rd-50rpx border-F5F5F5-1 mr-24" :class="currentService==index?'bntActive':''">{{item.name}}</view>
			 </view> 
		  </view>
	   </view>
	   <view>
		   <calendar @dateChange="getCalendar" @dayChange="dayChange" :dotList='userDate' :reservationDefaultDate='reservationDefaultDate'></calendar>
	   </view>
	   <view class="bg--w111-fff pl-24 pr-24 pt-12 pb-32 rd-16rpx relative w-710 m-auto mt-20">
		   <view class="list acea-row overflow" :class="timeArrow?'on':''">
			   <view v-for="(item,index) in reservationTimeData" class="time mr-18" @click="timeDataTap(item)">
				 <view class="rd-16rpx border-DDDDDD w-208 fs-28 text--w111-333 pt-24 pb-24 pl-20 pr-20 mt-20" :class="[item.is_valid && item.stock>0?'':'bntHui',currentTimeId==item.id?'bntActive':'']">
					<view class="text-center">{{item.show_time}}</view>
					<view v-if="productInfo.is_show_stock">
						<view v-if="!item.is_valid" class="text-center mt-10">不可约</view>
						<view v-else-if="item.stock<=0" class="text-center mt-10">约满</view>
						<view v-else class="text-center mt-10">余{{item.stock}}</view>
					</view>
				 </view>
			   </view>
		   </view>
		   <view v-if="reservationTimeData.length>9" class="text--w111-999 fs-22 text-center mt-24" @click="timetap">{{timeArrow?'收起':'展开全部'}}<text class="iconfont fs-22 ml-4" :class="timeArrow?'icon-ic_uparrow':'icon-ic_downarrow'"></text></view>
	   </view>
	   <view v-if="confirmShow">
	   	<view v-for="(x,xindex) in confirm" :key="xindex" class="bg--w111-fff pl-24 pr-24 pt-32 pb-32 rd-16rpx relative w-710 m-auto mt-20">
	   		<view class="cell flex justify-between fw-500">{{customFormTitle}}{{xindex+1}}</view>
	   		<view class="cell flex justify-between" v-for="(item,index) in x" :key="index">
	   			<text class="relative text--w111-333 fs-28 pl-16" :class="{'pt-10':item.name=='radios' || item.name=='checkboxs'}">
	   				<text class="asterisk" v-if="item.titleShow.val">*</text>
	   				{{ item.titleConfig.value }}
	   			</text>
	   			<!-- radio -->
	   			<view v-if="item.name=='radios'" class="discount">
	   				<radio-group @change="radioChange($event, index, item, xindex)" class="acea-row row-middle row-right">
	   				  <label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
	   					<view class="acea-row row-middle">
	   					  <!-- #ifndef MP -->
	   					  <radio :value="jindex.toString()" :checked='j.show'/>
	   					  <!-- #endif -->
	   					  <!-- #ifdef MP -->
	   					  <radio :value="jindex" :checked='j.show'/>
	   					  <!-- #endif -->
	   					  <view>{{j.val}}</view>
	   					</view>
	   				  </label>
	   				</radio-group>
	   			</view>
	   			<!-- checkbox -->
	   			<view v-if="item.name=='checkboxs'" class="discount">
	   				<checkbox-group @change="checkboxChange($event, index, item, xindex)" class="acea-row row-middle row-right w-530">
	   				  <label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
	   					<view class="acea-row row-middle">
	   					  <!-- #ifndef MP -->
	   					  <checkbox :value="jindex.toString()" :checked="j.show" style="transform:scale(0.9)" />
	   					  <!-- #endif -->
	   					  <!-- #ifdef MP -->
	   					  <checkbox :value="jindex" :checked="j.show" style="transform:scale(0.9)" />
	   					  <!-- #endif -->
	   					  <view>{{j.val}}</view>
	   					</view>
	   				  </label>
	   				</checkbox-group>
	   			</view>
	   			<!-- text -->
	   			<view v-if="item.name=='texts' && item.valConfig.tabVal == 0" class="discount">
	   			  <input type="text" :placeholder="item.tipConfig.value" placeholder-class="placeholder" class="fs-28" v-model="item.value" />
	   			</view>
	   			<!-- number -->
	   			<view v-if="item.name=='texts' && item.valConfig.tabVal == 4" class="discount">
	   			  <input type="number" :placeholder="item.tipConfig.value" placeholder-class="placeholder" class="fs-28" v-model="item.value" />
	   			</view>
	   			<!-- email -->
	   			<view v-if="item.name=='texts' && item.valConfig.tabVal == 3" class="discount">
	   			  <input type="text" :placeholder="item.tipConfig.value" placeholder-class="placeholder" class="fs-28" v-model="item.value" />
	   			</view>
	   			<!-- data -->
	   			<view v-if="item.name=='dates'" class="discount">
	   			  <picker mode="date" :value="item.value" @change="bindDateChange($event,index,xindex)">
	   			    <view class="acea-row row-between-wrapper">
	   			      <view v-if="item.value == ''">{{item.tipConfig.value}}</view>
	   			      <view v-else>{{item.value}}</view>
	   			      <text class='iconfont icon-jiantou'></text>
	   			    </view>
	   			  </picker>
	   			</view>
	   			<!-- dateranges -->
	   			<view v-if="item.name=='dateranges'" class="discount">
	   				<uni-datetime-picker v-model="item.value" type="daterange" @maskClick="maskClick">
	   				{{item.value.length?item.value[0]+' - '+item.value[1]:item.tipConfig.value}}
	   				<text class='iconfont icon-jiantou'></text>
	   				</uni-datetime-picker>
	   			</view>
	   			<!-- time -->
	   			<view v-if="item.name=='times'" class="discount">
	   			  <picker mode="time" :value="item.value" @change="bindTimeChange($event,index,xindex)"
	   			    :placeholder="item.tipConfig.value">
	   			    <view class="acea-row row-between-wrapper">
	   			      <view v-if="item.value == ''">{{item.tipConfig.value}}</view>
	   			      <view v-else>{{item.value}}</view>
	   			      <text class='iconfont icon-jiantou'></text>
	   			    </view>
	   			  </picker>
	   			</view>
	   			<!-- timeranges -->
	   			<view v-if="item.name=='timeranges'" class="discount acea-row row-between-wrapper" @click="getTimeranges(index,xindex)">
	   				<view v-if="item.value">{{item.value}}</view>
	   				<view v-else>{{item.tipConfig.value}}</view>
	   				<text class='iconfont icon-jiantou'></text>
	   			</view>
	   			<!-- select -->
	   			<view v-if="item.name=='selects'" class="discount">
	   				<picker :value="item.value" :range="item.wordsConfig.list" @change="bindSelectChange($event,index,item,xindex)" range-key="val">
	   				 <view class="acea-row row-between-wrapper">
	   				    <view v-if="item.value == ''">请选择</view>
	   				    <view v-else>{{item.value}}</view>
	   				    <text class='iconfont icon-jiantou'></text>
	   				  </view>
	   				</picker>
	   			</view>
	   			<!-- city -->
	   			<view v-if="item.name=='citys'" class="discount" @click="changeRegion(index,xindex)">
	   				<view class="acea-row row-middle row-right">
	   					<view class="city" v-if="item.value == ''">{{item.tipConfig.value}}</view>
	   					<view class="city" v-else>{{item.value}}</view>
	   					<text class='iconfont icon-jiantou'></text>
	   				</view>
	   			</view>
	   			<!-- id -->
	   			<view v-if="item.name=='texts' && item.valConfig.tabVal == 2" class="discount">
	   			  <input type="idcard" :placeholder="item.tipConfig.value" placeholder-class="placeholder" class="fs-28" v-model="item.value" />
	   			</view>
	   			<!-- phone -->
	   			<view v-if="item.name=='texts' && item.valConfig.tabVal == 1" class="discount">
	   			  <input type="number" :placeholder="item.tipConfig.value" placeholder-class="placeholder" class="fs-28" v-model="item.value" />
	   			</view>
	   			<!-- img -->
	   			<view v-if="item.name=='uploadPicture'" class="flex-1">
	   				<view class="flex justify-end" v-if="item.value.length < 3">
	   					<view class="relative" v-for="(items,indexs) in item.value" :key="indexs">
	   						<image class="w-128 h-128 rd-12rpx ml-16" :src="items"></image>
	   						<view class="abs-rt w-32 h-32 bg--w111-bbb clear-btn flex-center fs-24 text--w111-fff" @click="DelPic(index,indexs,xindex)">
	   							<text class="iconfont icon-ic_close"></text>
	   						</view>
	   					</view>
	   					 <view class="w-128 h-128 rd-12rpx bg--w111-f5f5f5 flex-col flex-center ml-16"
	   						v-if="item.value.length < item.numConfig.val" @tap="uploadpic(index,xindex)">
	   						 <text class='iconfont icon-ic_camera fs-40'></text>
	   						 <view class="fs-20 text--w111-333">上传图片</view>
	   					 </view>
	   				</view>
	   				<view class="flex justify-end" v-else>
	   					<scroll-view scroll-x="true" scroll-with-animation
	   						class="white-nowrap vertical-middle w-508" show-scrollbar="false">
	   						<view class="w-full h-full flex">
	   							<view class="inline-block h-128 mr-12">
	   								<view class="w-128 h-128 rd-12rpx bg--w111-f5f5f5 ml-16 flex-col flex-center"
	   									v-if="item.value.length < item.numConfig.val" @tap="uploadpic(index,xindex)">
	   									 <text class='iconfont icon-ic_camera fs-40'></text>
	   									 <view class="fs-20 text--w111-333">上传图片</view>
	   								</view>
	   							</view>
	   							<view class="inline-block mr-12 relative" v-for="(items,indexs) in item.value" :key="index">
	   								<image class="w-128 h-128 rd-12rpx" :src="items"></image>
	   								<view class="abs-rt w-32 h-32 bg--w111-bbb rd-rt-12rpx flex-center fs-24 text--w111-fff" @click="DelPic(index,indexs,xindex)">
	   									<text class="iconfont icon-ic_close"></text>
	   								</view>
	   							</view>
	   						</view>
	   					</scroll-view>
	   				</view>
	   			</view>
	   		</view>
	   	</view>
	   </view>
	   <view class="bg--w111-fff pl-24 pr-24 pt-32 pb-32 rd-16rpx relative w-710 m-auto mt-20">
		   <view class="fs-28 text--w111-333">预约须知</view>
		   <view class="fs-26 text--w111-666 mt-12">
			   <view class="mb-7" v-if="productInfo.is_advance==1">预约时间：为确保服务品质，请至少提前{{productInfo.advance_time}}小时预约，服务开始前{{productInfo.advance_time}}小时内不可选。</view>
			   <view>预定规则：预定成功后，系统不支持修改订单，如您有时间调整等需求，请联系商家协商</view>
			   <view class="mt-7" v-if="productInfo.is_cancel_reservation">取消预约：请于预约开始时间前 {{productInfo.cancel_reservation_time}} 小时进行操作。若距离预约开始已不足 {{productInfo.cancel_reservation_time}} 小时，请您联系商家协商处理。</view>
			   <view class="mt-7" v-else>取消预约：预定成功后，不支持取消预约，若您有相关需求请联系商家处理。</view>
		   </view>
	   </view>
	   <view class="heights"></view>
	   <view class="footer acea-row row-middle" v-if="orderId">
		   <view class="flex-1 h-72 bg-color rd-50rpx text--w111-fff fs-26 acea-row row-center-wrapper" @click="reservationOrderCreate">立即预约</view>
	   </view>
	   <view class="footer acea-row row-middle" v-else>
		   <view class="w-190">
			   <baseMoney
			   :money="computedPrice.deduction.pay_price"
			   symbolSize="24"
			   integerSize="36"
			   decimalSize="24"></baseMoney>
			   <view class="fs-24 text--w111-999 ml-2 mt-6" @click="openPerferentDrawer">优惠明细<text class="iconfont icon-ic_downarrow fs-24 ml-8"></text></view>
		   </view>
		   <view class="flex-1">
			   <view class="acea-row row-middle" v-if="productInfo.reservation_timing_type == 1">
				   <view @click="confirmOrder(1)" class="purchase mr-20 w-260 h-72 rd-50rpx text--w111-fff fs-26 acea-row row-center-wrapper">暂不预约，先购买</view>
				   <view @click="confirmOrder(2)" class="flex-1 h-72 bg-color rd-50rpx text--w111-fff fs-26 acea-row row-center-wrapper">确认下单</view>
			   </view>
			   <view class="acea-row row-middle" v-else-if="productInfo.reservation_timing_type == 2">
			   	   <view @click="confirmOrder(2)" class="flex-1 h-72 bg-color rd-50rpx text--w111-fff fs-26 acea-row row-center-wrapper">确认下单</view>
			   </view>
			   <view v-else>
				   <view @click="confirmOrder(1)" class="purchase flex-1 h-72 rd-50rpx text--w111-fff fs-26 acea-row row-center-wrapper">暂不预约，先购买</view>
			   </view>
		   </view>
	   </view>
	   <!-- 优惠弹窗 -->
	   <preferential-modal
	   	:visible="showPerferentDrawer"
	   	:discountInfo="discountInfo"
	   	:coupon="coupon"
	   	:computedPrice="computedPrice"
	   	@ChangCouponsUseState="ChangCouponsUseState"
	   	@closeDrawer="()=>{showPerferentDrawer = false}"
	   	@ruleToggle="ruleToggle"></preferential-modal>
		<cusPreviewImg ref="cusPreviewImg" :list="attrList" @changeSwitch="changeSwitch"></cusPreviewImg>
		<timeranges :isShow='isShow' :time='timeranges' @confrim="confrim" @cancel="cancels"></timeranges>
		<areaWindow ref="areaWindow" :display="display" :address='addressInfoArea' :cityShow='cityShow' @submit="OnAreaAddress" @changeClose="changeAddressClose"></areaWindow>
	</view>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import calendar from '../components/calendar/index.vue';
import preferentialModal from '@/components/preferentialModal/index.vue';
import cusPreviewImg from '@/components/cusPreviewImg';
import timeranges from '@/components/timeranges';
import areaWindow from '@/components/areaWindow';
import colors from "@/mixins/color";
import confirm from "@/mixins/confirm";
import { Debounce } from '@/utils/validate.js'
import {getReservationInfo,getReservationDate,getReservationTimes,postReservationCompute} from '@/api/activity.js';
import {postCartAdd} from '@/api/store.js';
import { setCouponReceive } from '@/api/api.js';
import {getReservationOrderInfo,postReservationOrderCreate} from '@/api/order.js';
export default {
	name: 'reservation',
	components: {
		NavBar,
		calendar,
		preferentialModal,
		cusPreviewImg,
		timeranges,
		areaWindow
	},
	mixins: [colors,confirm],
	data() {
		return {
			// 日历组件数据
			targetDate: 0, //本月
			iconColor:'#fff',
			bagColor:'var(--view-theme)',
			timeArrow:false,
			productId:0, //商品id；
			storeId:0, //门店id；
			unique:'', //默认选中的属性唯一值；
			attrList:[],
			storeName:'', //门店名称
			attrStyle:false,
			cartNum:1, //预约数量
			reservationTimeData:[], //时间段
			current:0, //当前选中属性索引值
			productInfo:{},
			serviceData:[
				{id:3,name:'上门服务',status:1},
				{id:2,name:'到店服务',status:1}
			],
			serviceList:[], //服务类型
			currentService:0,
			userDate:[],
			targetDay:0,//选中天数
			currentTimeId:0, //选中时间段id
			showPerferentDrawer:false,
			discountInfo: {
				discount: []
			},
			coupon: {
				list: []
			},
			computedPrice:{
				deduction:{
					pay_price:0,
					sum_price:0,
					vip_price:0
				}
			},
			orderId:'',
			reservationName:'',
			maxCartNum:0,
			cartInfoId:0,
			customFormTitle:'',
			reservationDefaultDate:''
		}
	},
	computed: {
		confirmShow(){
			let obj = this.orderId && this.confirm.length && this.confirm[0].length;
			return obj;
		}
	},
	onLoad(options){
		let m = (parseInt(new Date().getMonth() + 1) < 10 ? '0' : '') + parseInt(new Date().getMonth() + 1);
		let d = (parseInt(new Date().getDate()) < 10 ? '0' : '') + parseInt(new Date().getDate());
		this.targetDate = parseInt(new Date().getFullYear()) + '-' + m;
		this.targetDay = parseInt(new Date().getFullYear()) + '-' + m + '-'+ d;
		this.productId = options.id;
		this.storeId = options.store_id;
		this.unique = options.unique;
		this.orderId = options.orderId;
		this.cartInfoId = options.cartInfoId;
	},
	mounted(){
		if(this.orderId){
			this.reservationOrderInfo();
		}else{
			this.reservationInfo();
			this.reservationDate();
			this.reservationCompute();
		}
	},
	methods: {
		reservationOrderCreate(){
			if(!this.currentTimeId){
				return this.$util.Tips({
					title: '请选择时间段'
				});
			}
			let timeData = this.reservationTimeData.find(item => item.id === this.currentTimeId);
			if(this.cartNum>timeData.stock){
				return this.$util.Tips({
					title: `该时间段库存最大为${timeData.stock}`
				});
			}
			if(!this.verify()){
				return
			}
			let data = {
				cart_num:this.cartNum,
				reservation_time:this.targetDay,
				reservation_time_id:this.currentTimeId,
				custom_form:this.confirm,
				cart_info_id:this.cartInfoId,
			}
			postReservationOrderCreate(this.orderId,data).then(res=>{
				uni.navigateTo({
					url: `/pages/goods/reservation_status/index?orderId=${this.orderId}`
				});
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		// 预约订单详情
		reservationOrderInfo(){
			getReservationOrderInfo(this.orderId, {
				cart_info_id:this.cartInfoId,
			}).then(res=>{
				let data = res.data;
				this.customFormTitle = data.custom_form_title;
				this.maxCartNum = data.cart_num;
				this.storeId = data.store_id;
				this.productId = data.product_id;
				this.unique = data.unique;
				this.productInfo.is_show_stock = data.is_show_stock;
				this.reservationName = data.reservation_type == 3?'上门服务':'到店服务';
				this.reservationDate();
				this.reservationTimes();
				this.confirmInfo(data.custom_form,this.cartNum);
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		// 放大图
		showImg(item){
			this.$refs.cusPreviewImg.open(item.attr)
		},
		changeSwitch(e){
			this.current = e;
			this.unique = this.attrList[e].unique;
			this.reservationTimes();
			this.reservationCompute();
		},
		confirmOrder(num){
			// num：1：暂不预约，先购买
			// num：2：确认下单
			if(num==2){
				if(!this.currentTimeId){
					return this.$util.Tips({
						title: '请选择时间段'
					});
				}
				let timeData = this.reservationTimeData.find(item => item.id === this.currentTimeId);
				if(this.cartNum>timeData.stock){
					return this.$util.Tips({
						title: `该时间段库存最大为${timeData.stock}`
					});
				}
			}
			let reservationType = this.serviceList[this.currentService].id;
			let data = {
				cartNum: this.cartNum,
				new: 1,
				uniqueId: this.unique,
				store_id: this.storeId,
				productId: this.productId,
				reservation_type: reservationType
			}
			if(num==2){
				data.reservation_time = this.targetDay
				data.reservation_time_id = this.currentTimeId
			}
			postCartAdd(data).then(res=>{
				let url = `/pages/goods/order_confirm/index?new=1&cartId=${res.data.cartId}&store_id=${this.storeId}&store_name=${this.storeName}&product_id=${this.productId}&is_store=${this.storeId ? 1 : 0}&productType=6`
				//领券下单
				if(this.computedPrice.coupon && this.computedPrice.coupon.id){
					if(!this.computedPrice.coupon.used){
						setCouponReceive(this.computedPrice.coupon.id).then(resp => {
							uni.navigateTo({
								url: url + '&couponId=' + resp.data.id + '&couponTitle=' + this.computedPrice.coupon.coupon_title
							});
						}).catch(err => {
							return this.$util.Tips({
								title: err
							});
						})
					}else{
						uni.navigateTo({
							url: url + '&couponId=' + this.computedPrice.coupon.id + '&couponTitle=' + this.computedPrice.coupon.coupon_title
						});
					}
				}else{
					uni.navigateTo({
						url: url
					});
				}
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		reservationCompute(){
			let data = {
				unique:this.unique,
				product_id:this.productId,
				reservation_time_id:this.currentTimeId,
				cart_num:this.cartNum,
				store_id:this.storeId
			}
			postReservationCompute(data).then(res=>{
				let data = res.data;
				this.coupon.list = data.coupons;
				this.discountInfo.discount = data.promotions;
				this.computedPrice = data.computed;
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		openPerferentDrawer(){
			this.showPerferentDrawer = true;
		},
		timeDataTap(item){
			if(item.is_valid && item.stock>0){
				if(this.currentTimeId == item.id){
					this.currentTimeId = 0;
				}else{
					this.currentTimeId = item.id;
				}
			}
		},
		dayChange(e){
			this.currentTimeId = 0;
			this.targetDay = e;
			this.reservationDefaultDate = e;
			this.reservationTimes();
		},
		reservationTimes(){
			let data = {
				unique:this.unique,
				date:this.targetDay
			}
			getReservationTimes(this.productId,data).then(res=>{
				this.reservationTimeData = res.data;
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		getCalendar(e){
			this.targetDate = e;
			this.reservationDate();
		},
		// 获取可选择日期；
		reservationDate(){
			let data = {
				store_id:this.storeId,
				month:this.targetDate
			}
			getReservationDate(this.productId,data).then(res=>{
				this.userDate = res.data;
				this.targetDay = res.data[0].date
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		serviceTap(index){
			this.currentService = index;
		},
		// 点击属性
		arrtTap(item,index){
			this.current = index;
			this.unique = item.unique;
			this.reservationTimes();
			this.reservationCompute();
		},
		// 切换属性样式
		attrStyleTap(){
			this.attrStyle = !this.attrStyle;
		},
		// 获取预约信息
		reservationInfo(){
			let data = {
				unique:this.unique,
				store_id:this.storeId
			}
			getReservationInfo(this.productId,data).then(res=>{
				let data = res.data;
				this.storeName = data.storeInfo.name;
				this.reservationTimeData = data.reservationTimeData;
				this.reservationDefaultDate = data.reservationDefaultDate;
				this.productInfo = data.productInfo;
				if(data.productAttr.length){
					this.attrList = data.productAttr[0].attr_value;
					this.current = data.productAttr[0].attr_values.indexOf(data.selectAttrValue.suk);
					this.attrList.forEach(item=>{
						item.unique = data.productValue[item.attr].unique,
						item.suk = item.attr,
						item.image = item.pic
					})
				}else{
					this.unique = data.selectAttrValue.unique
				}
				let serviceList = []
				this.serviceData.forEach(item=>{
					if(this.productInfo.reservation_type==1){
						serviceList.push(item)
					}else if(this.productInfo.reservation_type==2 && item.id == 2){
						serviceList.push(item)
					}else if(this.productInfo.reservation_type==3 && item.id == 3){
						serviceList.push(item)
					}
				})
				this.serviceList = serviceList;
			}).catch(err=>{
				return this.$util.Tips({
					title: err
				});
			})
		},
		timetap(){
			this.timeArrow = !this.timeArrow;
		},
		addCart(type){
			if(type == 1){
				if(this.cartNum>=this.maxCartNum && this.orderId) return this.$util.Tips({
					title: '已到达你购买的最大人数'
				});
				this.cartNum ++
				if(this.orderId){
					this.confirm.push(this.confirmDefault)
				}
			}else{
				if(this.cartNum <= 1) return
				this.cartNum --
				if(this.orderId){
					this.confirm.pop()
				}
			}
			if(!this.orderId){
				this.reservationCompute();
			}
		},
		setValue: Debounce(function(e){
			this.cartNum = e.detail.value;
		}),
	}
};
</script>

<style lang="scss" scoped>
	/deep/uni-checkbox .uni-checkbox-input{
		border-radius: 3px;
	}
	.cell input{
		width: 450rpx;
		text-align:right;
	}
	.cell .radio {
		margin: 0 22rpx;
		padding: 10rpx 0;
	}
	.cell ~ .cell{
		margin-top: 40rpx;
	}
	.placeholder {
		color: #ccc;
	}
	.asterisk{
		position: absolute;
		color:red;
		left:0;
		padding-top: 2px;
	}
	.bntHui{
		color: #CCCCCC;
		background: #F9F9F9;
		border-color: #F9F9F9 !important;
	}
	.bntActive{
		color: var(--view-theme);
		background: var(--view-minorColorT);
		border-color: var(--view-theme) !important;
	}
	.purchase{
		background-color: var(--view-bntColor);
	}
	.footer{
		width: 100%;
		background-color: #fff;
		padding: 0 20rpx;
		position: fixed;
		bottom: 0;
		left:0;
		z-index: 20;
		height: calc(108rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(108rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
		padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
		box-sizing: border-box;
	}
	.heights{
		height: calc(128rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(128rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.time:nth-of-type(3n){
		margin-right: 0;
	}
	.list{
		max-height: 480rpx;
		transition: all 0.3s;
		&.on{
			max-height:unset;
			height: max-content;
		}
	}
	.header{
		background: var(--view-theme);
		padding: 0 20rpx 30rpx 24rpx;
		position: relative;
		&::before{
			position: absolute;
			content: ' ';
			width: 100%;
			height: 90rpx;
			background: linear-gradient( 180deg, var(--view-theme) 0%, #F5F5F5 100%);
			right: 0;
			bottom: -90rpx;
		}
	}
</style>